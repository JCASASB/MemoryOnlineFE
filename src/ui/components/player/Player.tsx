import React from "react";
import styled from "styled-components";
import { Player as PlayerType } from "../../../core/game/domain/entities/Player";

interface PlayerProps {
  player: PlayerType;
  isMe: boolean;
  isSelected: boolean;
  onToggle: (id: string) => void;
  dropdownAlign: "left" | "right";
}

const IconItem = styled.div`
  position: relative;
`;

const PlayerIcon = styled.button<{
  $active: boolean;
  $isMe: boolean;
  $isTurn: boolean;
}>`
  width: 34px;
  height: 34px;
  border-radius: 999px;
  border: 1px solid
    ${({ $active, $isTurn }) =>
      $active ? "#fff" : $isTurn ? "#ffd166" : "#555"};
  background: ${({ $isMe }) => ($isMe ? "#1f4b99" : "#333")};
  color: #fff;
  font-weight: 700;
  font-size: 0.85rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Dropdown = styled.div<{ $align: "left" | "right" }>`
  position: absolute;
  top: calc(100% + 8px);
  left: ${({ $align }) => ($align === "left" ? "0" : "auto")};
  right: ${({ $align }) => ($align === "right" ? "0" : "auto")};
  min-width: 220px;
  padding: 12px;
  border: 1px solid #2a2a2a;
  border-radius: 10px;
  background: #101010;
  color: #fff;
  z-index: 5;
  box-shadow: 0 14px 30px rgba(0, 0, 0, 0.35);
`;

const PlayerName = styled.div`
  font-size: 1rem;
  font-weight: 700;
  margin-bottom: 8px;
`;

const Stat = styled.div`
  font-size: 0.9rem;
  color: #d0d0d0;
`;

export const Player: React.FC<PlayerProps> = ({
  player,
  isMe,
  isSelected,
  onToggle,
  dropdownAlign,
}) => {
  const initial = (player.name?.trim().charAt(0) || "?").toUpperCase();

  return (
    <IconItem>
      <PlayerIcon
        $active={isSelected}
        $isMe={isMe}
        $isTurn={Boolean(player.turn)}
        onClick={() => onToggle(player.id)}
        title={player.name}
        aria-label={`Ver datos de ${player.name}`}
      >
        {initial}
      </PlayerIcon>

      {isSelected && (
        <Dropdown $align={dropdownAlign}>
          <PlayerName>
            {player.name} {isMe ? "(tu)" : ""}
          </PlayerName>
          <Stat>Puntos: {player.points}</Stat>
          <Stat>Movimientos: {player.totalMoves}</Stat>
          <Stat>Turno: {player.turn ? "Si" : "No"}</Stat>
        </Dropdown>
      )}
    </IconItem>
  );
};
