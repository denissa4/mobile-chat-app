import React from 'react';
import { useColorScheme } from 'react-native';
import Markdown from 'react-native-marked';

interface Props {
  content: string;
}

export function MarkdownRenderer({ content }: Props) {
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';

  const textColor = isDark ? '#F9FAFB' : '#111827';
  const codeBackground = isDark ? '#374151' : '#E5E7EB';

  return (
    <Markdown
      value={content}
      flatListProps={{
        scrollEnabled: false,
        style: { backgroundColor: 'transparent' },
        contentContainerStyle: { backgroundColor: 'transparent' },
      }}
      styles={{
        text: { color: textColor, fontSize: 15, lineHeight: 22 },
        strong: { color: textColor, fontWeight: '700' },
        em: { color: textColor, fontStyle: 'italic' },
        codespan: {
          backgroundColor: codeBackground,
          color: textColor,
          fontFamily: 'monospace',
          fontSize: 13,
        },
        code: {
          backgroundColor: codeBackground,
          borderRadius: 6,
          padding: 8,
        },
        link: { color: '#2563EB' },
        h1: { color: textColor, fontSize: 20, fontWeight: '700' },
        h2: { color: textColor, fontSize: 18, fontWeight: '600' },
        h3: { color: textColor, fontSize: 16, fontWeight: '600' },
      }}
    />
  );
}
