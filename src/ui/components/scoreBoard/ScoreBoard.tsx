// ScoreBoard.tsx
import React, { useMemo, useState } from "react";
import { Player as PlayerType } from "../../../core/game/domain/entities/Player";
import { Player } from "../player/Player";
import * as S from "./ScoreBoard.styles"; // <-- Importación de los estilos agregada

interface ScoreBoardProps {
  players: PlayerType[];
  myPlayerId: string;
  matchName: string;
}

export const ScoreBoard: React.FC<ScoreBoardProps> = ({
  players,
  myPlayerId,
  matchName,
}) => {
  const [selectedPlayerId, setSelectedPlayerId] = useState<string | null>(null);

  const orderedPlayers = useMemo(() => {
    const meIndex = players.findIndex((p) => p.id === myPlayerId);
    if (meIndex === -1) return players;
    return [...players.slice(meIndex), ...players.slice(0, meIndex)];
  }, [players, myPlayerId]);

  const togglePlayer = (id: string) =>
    setSelectedPlayerId((prev) => (prev === id ? null : id));

  return (
    <S.Bar>
      <S.Title>{matchName}</S.Title>

      {orderedPlayers.map((player, index) =>
        index / 2 === 0 ? (
          <S.LeftIcons key={player.id}>
            <Player
              player={player}
              isMe={player.id === myPlayerId}
              isSelected={selectedPlayerId === player.id}
              onToggle={togglePlayer}
              dropdownAlign="left"
            />
          </S.LeftIcons>
        ) : (
          <S.RightIcons key={player.id}>
            <Player
              player={player}
              isMe={player.id === myPlayerId}
              isSelected={selectedPlayerId === player.id}
              onToggle={togglePlayer}
              dropdownAlign="right"
            />
          </S.RightIcons>
        ),
      )}
    </S.Bar>
  );
};
