import React, { useCallback, useRef, useState } from 'react';
import {
  View,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  Text,
  Pressable,
  useColorScheme,
  ListRenderItemInfo,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDirectLine } from '../src/chat/useDirectLine';
import { Bubble } from '../src/components/Bubble';
import { Composer } from '../src/components/Composer';
import { TypingIndicator } from '../src/components/TypingIndicator';
import { ConnectionStatus } from '../src/components/ConnectionStatus';
import { EmptyChat } from '../src/components/EmptyChat';
import { useAuth } from '../src/auth/AuthContext';
import type { ChatMessage } from '../src/types/chat';

export default function ChatScreen() {
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';
  const { messages, connectionStatus, isTyping, sendMessage, retry } = useDirectLine();
  const { signOut } = useAuth();
  const flatListRef = useRef<FlatList<ChatMessage>>(null);
  const [showScrollBtn, setShowScrollBtn] = useState(false);
  const distanceFromBottomRef = useRef(0);
  const scrollOnSendRef = useRef(false);
  const sendIndexRef = useRef(-1);

  const scrollToBottom = useCallback(() => {
    flatListRef.current?.scrollToEnd({ animated: true });
    setShowScrollBtn(false);
  }, []);

  const handleSend = useCallback(
    async (text: string) => {
      sendIndexRef.current = messages.length;
      scrollOnSendRef.current = true;
      await sendMessage(text);
    },
    [sendMessage, messages.length],
  );

  const handleSuggestion = useCallback(
    (text: string) => void handleSend(text),
    [handleSend],
  );

  const renderItem = useCallback(
    ({ item, index }: ListRenderItemInfo<ChatMessage>) => {
      const prevRole = index > 0 ? messages[index - 1]?.role : undefined;
      return <Bubble message={item} prevRole={prevRole} />;
    },
    [messages],
  );

  const keyExtractor = useCallback((item: ChatMessage) => item.id, []);

  const isFailed = connectionStatus === 'FailedToConnect';
  const backgroundColor = isDark ? '#111827' : '#FFFFFF';

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor }} edges={['top', 'left', 'right']}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={backgroundColor} />

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'flex-end',
            paddingHorizontal: 16,
            paddingVertical: 8,
          }}
        >
          <Pressable
            onPress={() => void signOut()}
            hitSlop={8}
            style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })}
          >
            <Text style={{ color: isDark ? '#9CA3AF' : '#6B7280', fontSize: 14 }}>
              Выйти
            </Text>
          </Pressable>
        </View>

        <ConnectionStatus status={connectionStatus} />

        {isFailed && (
          <View
            style={{
              marginHorizontal: 16, marginVertical: 8, padding: 12,
              backgroundColor: isDark ? '#1F2937' : '#FEF2F2',
              borderRadius: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
            }}
          >
            <Text style={{ color: '#EF4444', fontSize: 13, flex: 1 }}>
              Не удалось подключиться к серверу
            </Text>
            <Pressable
              onPress={retry}
              style={({ pressed }) => ({
                paddingHorizontal: 12, paddingVertical: 6,
                backgroundColor: '#EF4444', borderRadius: 8, opacity: pressed ? 0.7 : 1,
              })}
            >
              <Text style={{ color: '#FFFFFF', fontSize: 13, fontWeight: '600' }}>Повторить</Text>
            </Pressable>
          </View>
        )}

        <View style={{ flex: 1 }}>
          {messages.length === 0 && !isTyping ? (
            <EmptyChat onSuggestion={handleSuggestion} />
          ) : (
            <FlatList
              ref={flatListRef}
              data={messages}
              renderItem={renderItem}
              keyExtractor={keyExtractor}
              onScroll={(e) => {
                const { layoutMeasurement, contentOffset, contentSize } = e.nativeEvent;
                const dist = contentSize.height - contentOffset.y - layoutMeasurement.height;
                distanceFromBottomRef.current = dist;
                setShowScrollBtn(dist > 120);
              }}
              scrollEventThrottle={50}
              onContentSizeChange={() => {
                if (scrollOnSendRef.current) {
                  scrollOnSendRef.current = false;
                  const idx = sendIndexRef.current;
                  sendIndexRef.current = -1;
                  if (idx >= 0) {
                    flatListRef.current?.scrollToIndex({
                      index: idx,
                      viewPosition: 0,
                      viewOffset: -60,
                      animated: true,
                    });
                  }
                  setShowScrollBtn(false);
                }
              }}
              onScrollToIndexFailed={(info) => {
                flatListRef.current?.scrollToOffset({
                  offset: info.averageItemLength * info.index,
                  animated: true,
                });
              }}
              contentContainerStyle={{ paddingVertical: 12 }}
              showsVerticalScrollIndicator={false}
              keyboardDismissMode="interactive"
              ListFooterComponent={isTyping ? <TypingIndicator /> : null}
            />
          )}

          {/* Scroll-to-bottom button */}
          {showScrollBtn && (
            <Pressable
              onPress={scrollToBottom}
              style={({ pressed }) => ({
                position: 'absolute',
                bottom: 12,
                alignSelf: 'center',
                width: 36,
                height: 36,
                borderRadius: 18,
                backgroundColor: isDark ? '#374151' : '#FFFFFF',
                borderWidth: 1,
                borderColor: isDark ? '#4B5563' : '#E5E7EB',
                alignItems: 'center',
                justifyContent: 'center',
                opacity: pressed ? 0.7 : 1,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.12,
                shadowRadius: 4,
                elevation: 4,
              })}
            >
              <Text style={{ color: isDark ? '#F9FAFB' : '#111827', fontSize: 16, lineHeight: 18 }}>
                ↓
              </Text>
            </Pressable>
          )}
        </View>

        <Composer onSend={handleSend} disabled={isTyping} />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
