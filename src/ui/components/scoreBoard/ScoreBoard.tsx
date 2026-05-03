import React, { useMemo, useState } from "react";
import styled from "styled-components";
import { Player as PlayerType } from "../../../core/game/domain/entities/Player";
import { Player } from "../player/Player";

interface ScoreBoardProps {
  players: PlayerType[];
  myPlayerId: string;
}

const Bar = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  min-height: 56px;
  padding: 10px 14px;
  border-radius: 12px;
  background: #000;
  border: 1px solid #222;
  box-sizing: border-box;

  /* --- Efecto Blur --- */
  background: rgba(0, 0, 0, 0.8); /* Negro con 60% de opacidad */
  backdrop-filter: blur(12px); /* El desenfoque */
  -webkit-backdrop-filter: blur(12px); /* Soporte para Safari */
`;

const Title = styled.span`
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  color: #fff;
  font-size: 0.9rem;
  font-weight: 700;
  letter-spacing: 0.03em;
  pointer-events: none;
`;

const IconList = styled.div`
  display: flex;
  gap: 8px;
`;

const LeftIcons = styled(IconList)`
  justify-content: flex-start;
`;

const RightIcons = styled(IconList)`
  justify-content: flex-end;
`;

export const ScoreBoard: React.FC<ScoreBoardProps> = ({
  players,
  myPlayerId,
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
    <Bar>
      <Title>Memory - Hispalance</Title>

      {orderedPlayers.map((player, index) =>
        index / 2 === 0 ? (
          <LeftIcons key={player.id}>
            <Player
              player={player}
              isMe={player.id === myPlayerId}
              isSelected={selectedPlayerId === player.id}
              onToggle={togglePlayer}
              dropdownAlign="left"
            />
          </LeftIcons>
        ) : (
          <RightIcons key={player.id}>
            <Player
              player={player}
              isMe={player.id === myPlayerId}
              isSelected={selectedPlayerId === player.id}
              onToggle={togglePlayer}
              dropdownAlign="right"
            />
          </RightIcons>
        ),
      )}
    </Bar>
  );
};
