import React, { useEffect } from 'react';
import { View, Text, Pressable, useColorScheme } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  Easing,
} from 'react-native-reanimated';
import { TypewriterMarkdown } from './TypewriterMarkdown';
import type { ChatMessage } from '../types/chat';

interface Props {
  message: ChatMessage;
  prevRole?: 'user' | 'bot';
}

export function Bubble({ message, prevRole }: Props) {
  const isUser = message.role === 'user';
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';

  const opacity = useSharedValue(message.isNew ? 0 : 1);
  const translateY = useSharedValue(message.isNew ? 18 : 0);

  useEffect(() => {
    if (message.isNew) {
      opacity.value = withTiming(1, { duration: 700, easing: Easing.out(Easing.cubic) });
      translateY.value = withSpring(0, { damping: 18, stiffness: 100, mass: 1.2 });
    }
  }, [message.isNew, opacity, translateY]);

  const animStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  if (isUser) {
    return (
      <View style={{ marginTop: prevRole === 'bot' ? 24 : 8 }}>
        <View style={{ alignSelf: 'flex-end', maxWidth: '80%', marginHorizontal: 16, marginBottom: 4 }}>
          <View
            style={{
              backgroundColor: isDark ? '#2D2D2D' : '#F0F0F0',
              borderRadius: 20,
              paddingHorizontal: 16,
              paddingVertical: 10,
            }}
          >
            <Text style={{ color: isDark ? '#F9FAFB' : '#111827', fontSize: 16, lineHeight: 24 }}>
              {message.text}
            </Text>
          </View>
        </View>
      </View>
    );
  }

  return (
    <Animated.View style={animStyle}>
      <Pressable
        onLongPress={() => Clipboard.setStringAsync(message.text)}
        style={{ paddingHorizontal: 16, paddingTop: prevRole === 'user' ? 16 : 4, paddingBottom: 4 }}
      >
        <TypewriterMarkdown text={message.text} />
      </Pressable>
    </Animated.View>
  );
}
