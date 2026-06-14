import React from 'react';
import { View, Text, useColorScheme } from 'react-native';

interface Props {
  text: string;
  cursor?: boolean;
}

function renderInline(
  raw: string,
  base: object,
  mono: object,
  accent: string,
): React.ReactNode[] {
  const parts = raw.split(/(\*\*[\s\S]*?\*\*|\*[\s\S]*?\*|`[^`]+`)/);
  return parts.map((p, i) => {
    if (p.startsWith('**') && p.endsWith('**')) {
      return (
        <Text key={i} style={[base, { fontWeight: '700' }]}>
          {p.slice(2, -2)}
        </Text>
      );
    }
    if (p.startsWith('*') && p.endsWith('*')) {
      return (
        <Text key={i} style={[base, { fontStyle: 'italic' }]}>
          {p.slice(1, -1)}
        </Text>
      );
    }
    if (p.startsWith('`') && p.endsWith('`')) {
      return (
        <Text key={i} style={[base, mono]}>
          {p.slice(1, -1)}
        </Text>
      );
    }
    return (
      <Text key={i} style={base}>
        {p}
      </Text>
    );
  });
}

export function SimpleMarkdown({ text, cursor }: Props) {
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';

  const textColor = isDark ? '#F9FAFB' : '#111827';
  const mutedColor = isDark ? '#9CA3AF' : '#6B7280';
  const codeBg = isDark ? '#2D3748' : '#F1F5F9';
  const hrColor = isDark ? '#374151' : '#E5E7EB';

  const baseStyle = { color: textColor, fontSize: 16, lineHeight: 26 };
  const monoStyle = {
    fontFamily: 'monospace' as const,
    backgroundColor: codeBg,
    fontSize: 14,
    borderRadius: 4,
  };

  const lines = text.split('\n');
  const nodes: React.ReactNode[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    // Horizontal rule
    if (/^---+$/.test(line.trim())) {
      nodes.push(
        <View
          key={i}
          style={{ height: 1, backgroundColor: hrColor, marginVertical: 10 }}
        />,
      );
      i++;
      continue;
    }

    // Headers
    const hMatch = line.match(/^(#{1,3})\s+(.*)/);
    if (hMatch) {
      const level = hMatch[1].length;
      const sizes = [22, 19, 17];
      const hStyle = {
        color: textColor,
        fontSize: sizes[level - 1] ?? 17,
        fontWeight: '700' as const,
        lineHeight: (sizes[level - 1] ?? 17) * 1.4,
        marginTop: level === 1 ? 14 : 10,
        marginBottom: 4,
      };
      nodes.push(
        <Text key={i} style={hStyle}>
          {renderInline(hMatch[2], hStyle, monoStyle, textColor)}
        </Text>,
      );
      i++;
      continue;
    }

    // List item
    const liMatch = line.match(/^\s*[-*•]\s+(.*)/);
    if (liMatch) {
      nodes.push(
        <View key={i} style={{ flexDirection: 'row', marginVertical: 2, paddingLeft: 4 }}>
          <Text style={[baseStyle, { marginRight: 8 }]}>{'•'}</Text>
          <Text style={[baseStyle, { flex: 1 }]}>
            {renderInline(liMatch[1], baseStyle, monoStyle, textColor)}
          </Text>
        </View>,
      );
      i++;
      continue;
    }

    // Empty line
    if (line.trim() === '') {
      nodes.push(<View key={i} style={{ height: 8 }} />);
      i++;
      continue;
    }

    // Regular paragraph
    nodes.push(
      <Text key={i} style={baseStyle}>
        {renderInline(line, baseStyle, monoStyle, textColor)}
      </Text>,
    );
    i++;
  }

  return (
    <View>
      {nodes}
      {cursor && (
        <Text style={{ color: mutedColor, fontSize: 16, lineHeight: 26 }}>▍</Text>
      )}
    </View>
  );
}
