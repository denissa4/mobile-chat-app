import React, { useRef, useState } from 'react';
import {
  View,
  TextInput,
  Pressable,
  useColorScheme,
  ActivityIndicator,
  Keyboard,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface Props {
  onSend: (text: string) => void;
  disabled?: boolean;
}

export function Composer({ onSend, disabled = false }: Props) {
  const [text, setText] = useState('');
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';
  const insets = useSafeAreaInsets();
  const inputRef = useRef<TextInput>(null);

  const handleSend = () => {
    const trimmed = text.trim();
    if (!trimmed || disabled) return;
    setText('');
    Keyboard.dismiss();
    onSend(trimmed);
  };

  const canSend = text.trim().length > 0 && !disabled;

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'flex-end',
        paddingHorizontal: 16,
        paddingTop: 12,
        paddingBottom: Math.max(insets.bottom, 16),
        gap: 10,
        borderTopWidth: 1,
        borderTopColor: isDark ? '#374151' : '#E5E7EB',
        backgroundColor: isDark ? '#111827' : '#FFFFFF',
      }}
    >
      <TextInput
        value={text}
        onChangeText={setText}
        placeholder="Сообщение"
        placeholderTextColor={isDark ? '#6B7280' : '#9CA3AF'}
        multiline
        maxLength={4000}
        onSubmitEditing={handleSend}
        blurOnSubmit={false}
        style={{
          flex: 1,
          maxHeight: 120,
          minHeight: 44,
          backgroundColor: isDark ? '#1F2937' : '#F9FAFB',
          borderWidth: 1,
          borderColor: isDark ? '#374151' : '#E5E7EB',
          borderRadius: 22,
          paddingHorizontal: 16,
          paddingVertical: 10,
          fontSize: 15,
          color: isDark ? '#F9FAFB' : '#111827',
        }}
      />
      <Pressable
        onPress={handleSend}
        disabled={!canSend}
        style={({ pressed }) => ({
          width: 44,
          height: 44,
          borderRadius: 22,
          backgroundColor: canSend ? '#2563EB' : isDark ? '#374151' : '#E5E7EB',
          alignItems: 'center',
          justifyContent: 'center',
          opacity: pressed ? 0.7 : 1,
        })}
      >
        {disabled ? (
          <ActivityIndicator size="small" color="#FFFFFF" />
        ) : (
          <View
            style={{
              width: 0,
              height: 0,
              borderTopWidth: 8,
              borderBottomWidth: 8,
              borderLeftWidth: 14,
              borderTopColor: 'transparent',
              borderBottomColor: 'transparent',
              borderLeftColor: canSend ? '#FFFFFF' : isDark ? '#6B7280' : '#9CA3AF',
              marginLeft: 3,
            }}
          />
        )}
      </Pressable>
    </View>
  );
}
