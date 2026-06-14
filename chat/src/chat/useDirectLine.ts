import { useCallback, useEffect, useRef, useState } from 'react';
import { fetchDirectLineToken } from '../api/token';
import type { ChatMessage, ConnectionStatus } from '../types/chat';

const DL_BASE = 'https://directline.botframework.com/v3/directline';

function uid(): string {
  return 'dl_' + Date.now().toString(36) + Math.random().toString(36).slice(2);
}

interface UseDirectLineReturn {
  messages: ChatMessage[];
  connectionStatus: ConnectionStatus;
  isTyping: boolean;
  sendMessage: (text: string) => Promise<void>;
  retry: () => void;
}

export function useDirectLine(): UseDirectLineReturn {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('Uninitialized');
  const [isTyping, setIsTyping] = useState(false);

  const tokenRef = useRef<string>('');
  // Direct Line user id, set by the backend from the verified Supabase JWT.
  // Falls back to a random id until the token response arrives.
  const userIdRef = useRef<string>(uid());
  const conversationIdRef = useRef<string>('');
  const wsRef = useRef<WebSocket | null>(null);
  const watermarkRef = useRef<string>('');
  const typingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  // Buffer for merging bot messages that arrive close together
  const mergeBufferRef = useRef<string[]>([]);
  const mergeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const flushMergeBuffer = useCallback(() => {
    if (mergeBufferRef.current.length === 0) return;
    const combined = mergeBufferRef.current.reduce((acc, cur) => {
      if (!acc) return cur;
      // If previous chunk ends without sentence punctuation → streaming token, join directly
      const lastChar = acc.trimEnd().slice(-1);
      if (!/[.!?:;。！？]/.test(lastChar)) return acc + cur;
      return acc + '\n\n' + cur;
    }, '');
    mergeBufferRef.current = [];
    setIsTyping(false);
    if (typingTimerRef.current) clearTimeout(typingTimerRef.current);
    setMessages((prev) => [
      ...prev,
      { id: uid(), role: 'bot', text: combined, timestamp: Date.now(), isNew: true },
    ]);
  }, []);

  const cleanup = useCallback(() => {
    if (wsRef.current) {
      wsRef.current.onclose = null;
      wsRef.current.close();
      wsRef.current = null;
    }
    if (typingTimerRef.current) clearTimeout(typingTimerRef.current);
    if (mergeTimerRef.current) clearTimeout(mergeTimerRef.current);
    mergeBufferRef.current = [];
  }, []);

  const connectWebSocket = useCallback((streamUrl: string) => {
    cleanup();
    setConnectionStatus('Connecting');

    const ws = new WebSocket(streamUrl);
    wsRef.current = ws;

    ws.onopen = () => setConnectionStatus('Online');

    ws.onmessage = (event) => {
      try {
        if (!event.data) return;
        const packet = JSON.parse(event.data as string) as {
          activities?: Array<{
            id?: string;
            type: string;
            from: { id: string };
            text?: string;
          }>;
          watermark?: string;
        };

        if (packet.watermark) watermarkRef.current = packet.watermark;
        if (!packet.activities) return;

        for (const activity of packet.activities) {
          if (activity.from.id === userIdRef.current) continue;

          if (activity.type === 'typing') {
            setIsTyping(true);
            if (typingTimerRef.current) clearTimeout(typingTimerRef.current);
            typingTimerRef.current = setTimeout(() => setIsTyping(false), 3000);
            continue;
          }

          if (activity.type !== 'message' || !activity.text?.trim()) continue;

          // Keep typing indicator alive while buffering message chunks
          setIsTyping(true);
          if (typingTimerRef.current) clearTimeout(typingTimerRef.current);

          mergeBufferRef.current.push(activity.text.trim());
          if (mergeTimerRef.current) clearTimeout(mergeTimerRef.current);
          mergeTimerRef.current = setTimeout(flushMergeBuffer, 600);
        }
      } catch {
        // malformed packet — ignore
      }
    };

    ws.onerror = () => setConnectionStatus('FailedToConnect');
    ws.onclose = () => setConnectionStatus('FailedToConnect');
  }, [cleanup, flushMergeBuffer]);

  const connect = useCallback(async () => {
    cleanup();
    setConnectionStatus('Connecting');

    try {
      const tokenResponse = await fetchDirectLineToken();
      tokenRef.current = tokenResponse.token;
      if (tokenResponse.userId) userIdRef.current = tokenResponse.userId;

      const convResponse = await fetch(`${DL_BASE}/conversations`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${tokenRef.current}`,
          'Content-Type': 'application/json',
        },
      });

      if (!convResponse.ok) throw new Error(`Conv failed: ${convResponse.status}`);

      const conv = await convResponse.json() as {
        conversationId: string;
        token: string;
        streamUrl: string;
      };

      conversationIdRef.current = conv.conversationId;
      if (conv.token) tokenRef.current = conv.token;

      connectWebSocket(conv.streamUrl);
    } catch {
      setConnectionStatus('FailedToConnect');
    }
  }, [cleanup, connectWebSocket]);

  const sendMessage = useCallback(async (text: string): Promise<void> => {
    if (!conversationIdRef.current || !tokenRef.current) return;

    const tempId = uid();
    setMessages((prev) => [
      ...prev,
      { id: tempId, role: 'user', text: text.trim(), timestamp: Date.now() },
    ]);
    setIsTyping(true);

    try {
      const res = await fetch(
        `${DL_BASE}/conversations/${conversationIdRef.current}/activities`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${tokenRef.current}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            type: 'message',
            from: { id: userIdRef.current, name: 'User' },
            text: text.trim(),
          }),
        },
      );

      if (!res.ok) throw new Error(`Send failed: ${res.status}`);
    } catch {
      setIsTyping(false);
      setMessages((prev) =>
        prev.map((m) => (m.id === tempId ? { ...m, error: true } : m)),
      );
    }
  }, []);

  useEffect(() => {
    void connect();
    return cleanup;
  }, [connect, cleanup]);

  return {
    messages,
    connectionStatus,
    isTyping,
    sendMessage,
    retry: () => void connect(),
  };
}
