import React from 'react';
import { View, Text } from 'react-native';
import type { ConnectionStatus as Status } from '../types/chat';

interface Props {
  status: Status;
}

const STATUS_CONFIG: Record<Status, { label: string; color: string } | null> = {
  Online: null,
  Uninitialized: null,
  Connecting: { label: 'Подключение…', color: '#F59E0B' },
  ExpiredToken: { label: 'Обновление сессии…', color: '#F59E0B' },
  FailedToConnect: { label: 'Нет соединения', color: '#EF4444' },
  Ended: { label: 'Сессия завершена', color: '#6B7280' },
};

export function ConnectionStatus({ status }: Props) {
  const config = STATUS_CONFIG[status];
  if (!config) return null;

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 6,
        paddingHorizontal: 12,
        gap: 6,
      }}
    >
      <View
        style={{
          width: 8,
          height: 8,
          borderRadius: 4,
          backgroundColor: config.color,
        }}
      />
      <Text style={{ color: config.color, fontSize: 12 }}>{config.label}</Text>
    </View>
  );
}
