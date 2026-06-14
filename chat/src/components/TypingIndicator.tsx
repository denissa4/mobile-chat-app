import React, { useEffect } from 'react';
import { View, useColorScheme } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  Easing,
} from 'react-native-reanimated';

const DOT_SIZE = 8;
const DELAYS = [0, 150, 300];

function Dot({ delay }: { delay: number }) {
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';
  const opacity = useSharedValue(0.3);

  useEffect(() => {
    opacity.value = withRepeat(
      withSequence(
        withTiming(0.3, { duration: delay, easing: Easing.linear }),
        withTiming(1, { duration: 300, easing: Easing.ease }),
        withTiming(0.3, { duration: 300, easing: Easing.ease }),
      ),
      -1,
      false,
    );
  }, [delay, opacity]);

  const style = useAnimatedStyle(() => ({ opacity: opacity.value }));

  return (
    <Animated.View
      style={[
        style,
        {
          width: DOT_SIZE,
          height: DOT_SIZE,
          borderRadius: DOT_SIZE / 2,
          backgroundColor: isDark ? '#9CA3AF' : '#6B7280',
          marginHorizontal: 3,
        },
      ]}
    />
  );
}

export function TypingIndicator() {
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';

  return (
    <View
      style={{
        alignSelf: 'flex-start',
        marginHorizontal: 16,
        marginVertical: 4,
        backgroundColor: isDark ? '#1F2937' : '#F3F4F6',
        borderRadius: 18,
        borderBottomLeftRadius: 4,
        paddingHorizontal: 16,
        paddingVertical: 14,
        flexDirection: 'row',
        alignItems: 'center',
      }}
    >
      {DELAYS.map((d) => (
        <Dot key={d} delay={d} />
      ))}
    </View>
  );
}
