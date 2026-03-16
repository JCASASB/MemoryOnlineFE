import React from 'react';
import { Player as PlayerType } from '../../../core/domain/entities/Player';
import { Player } from '../player/Player';

interface ScoreBoardProps {
  players: PlayerType[];
  myPlayerName: string;
}

export const ScoreBoard: React.FC<ScoreBoardProps> = ({ players, myPlayerName }) => {
  console.log('ScoreBoard players:', players);
  console.log('ScoreBoard myPlayerName:', myPlayerName);
  const currentPlayer = players.find(p => p.name === myPlayerName);
  const otherPlayer = players.find(p => p.name !== myPlayerName);

  return (
    <div>
      {currentPlayer && <Player player={currentPlayer} isMe={true} />}
      {otherPlayer && <Player player={otherPlayer} isMe={false} />}
      <div style={{ clear: 'both' }} />
    </div>
  );
};
