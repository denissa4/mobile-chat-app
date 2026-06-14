import React from 'react';
import { View, Text, Pressable, useColorScheme } from 'react-native';

const SUGGESTIONS = [
  'Расскажи о своих возможностях',
  'Напиши краткое эссе',
  'Помоги разобраться в теме',
  'Составь список идей',
];

interface Props {
  onSuggestion: (text: string) => void;
}

export function EmptyChat({ onSuggestion }: Props) {
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';

  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 24,
        gap: 32,
      }}
    >
      <View style={{ alignItems: 'center', gap: 8 }}>
        <Text
          style={{
            fontSize: 28,
            fontWeight: '700',
            color: isDark ? '#F9FAFB' : '#111827',
          }}
        >
          Чем могу помочь?
        </Text>
        <Text
          style={{
            fontSize: 15,
            color: isDark ? '#9CA3AF' : '#6B7280',
            textAlign: 'center',
          }}
        >
          Введите вопрос или выберите подсказку
        </Text>
      </View>

      <View style={{ width: '100%', gap: 10 }}>
        {SUGGESTIONS.map((s) => (
          <Pressable
            key={s}
            onPress={() => onSuggestion(s)}
            style={({ pressed }) => ({
              backgroundColor: isDark ? '#1F2937' : '#F3F4F6',
              borderRadius: 12,
              paddingHorizontal: 16,
              paddingVertical: 12,
              opacity: pressed ? 0.7 : 1,
            })}
          >
            <Text
              style={{
                color: isDark ? '#F9FAFB' : '#111827',
                fontSize: 14,
              }}
            >
              {s}
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}
