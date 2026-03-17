import React from 'react';
import { Player as PlayerType } from '../../../core/domain/entities/Player';

interface PlayerProps {
  isMe: boolean;
  player: PlayerType;
}

export const Player: React.FC<PlayerProps> = ({ player, isMe }) => {
  const floatDirection = isMe ? 'left' : 'right';
  return (
    <div style={{
      border: '1px solid #ccc',
      borderRadius: 8,
      padding: 12,
      marginBottom: 8,
      background: '#f9f9f9',
      minWidth: 180,
      textAlign: 'center',
      float: floatDirection,
    }}>
      <div style={{ fontWeight: 'bold', fontSize: 18 }}>{player.name}</div>
      <div>Movimientos: {player.totalMoves}</div>
      <div>Puntos: {player.points}</div>
    </div>
  );
};
