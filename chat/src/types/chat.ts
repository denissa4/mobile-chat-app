export type MessageRole = 'user' | 'bot';

export interface ChatMessage {
  id: string;
  role: MessageRole;
  text: string;
  timestamp: number;
  error?: boolean;
  isNew?: boolean;
}

export type ConnectionStatus =
  | 'Uninitialized'
  | 'Connecting'
  | 'Online'
  | 'ExpiredToken'
  | 'FailedToConnect'
  | 'Ended';
