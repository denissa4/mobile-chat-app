import React from 'react';
import { useColorScheme } from 'react-native';
import Markdown from 'react-native-marked';

interface Props {
  text: string;
}

export function TypewriterMarkdown({ text }: Props) {
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';

  const textColor = isDark ? '#F9FAFB' : '#111827';
  const codeBackground = isDark ? '#2D3748' : '#F1F5F9';
  const codeBorder = isDark ? '#4A5568' : '#E2E8F0';

  return (
    <Markdown
      value={text}
      flatListProps={{
        scrollEnabled: false,
        style: { backgroundColor: 'transparent' },
        contentContainerStyle: { backgroundColor: 'transparent' },
      }}
      styles={{
        text: { color: textColor, fontSize: 16, lineHeight: 26 },
        strong: { color: textColor, fontWeight: '700' },
        em: { color: textColor, fontStyle: 'italic' },
        paragraph: { marginVertical: 2, backgroundColor: 'transparent' },
        codespan: {
          backgroundColor: codeBackground,
          color: isDark ? '#F9A8D4' : '#BE185D',
          fontFamily: 'monospace',
          fontSize: 14,
          borderRadius: 4,
        },
        code: {
          backgroundColor: codeBackground,
          borderRadius: 8,
          padding: 12,
          borderWidth: 1,
          borderColor: codeBorder,
        },
        link: { color: '#2563EB' },
        h1: { color: textColor, fontSize: 22, fontWeight: '700', marginTop: 12, marginBottom: 4 },
        h2: { color: textColor, fontSize: 19, fontWeight: '700', marginTop: 10, marginBottom: 4 },
        h3: { color: textColor, fontSize: 17, fontWeight: '600', marginTop: 8, marginBottom: 2 },
        li: { color: textColor, fontSize: 16, lineHeight: 26 },
        blockquote: {
          borderLeftWidth: 3,
          borderLeftColor: isDark ? '#4B5563' : '#D1D5DB',
          paddingLeft: 12,
          marginVertical: 4,
        },
      }}
    />
  );
}
