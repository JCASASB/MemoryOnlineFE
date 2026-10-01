// Player.tsx
import React from "react";
import { Player as PlayerType } from "../../../core/game/domain/entities/Player";
import * as S from "./Player.styles"; // <-- Importación de los estilos agregada

interface PlayerProps {
  player: PlayerType;
  isMe: boolean;
  isSelected: boolean;
  onToggle: (id: string) => void;
  dropdownAlign: "left" | "right";
}

export const Player: React.FC<PlayerProps> = ({
  player,
  isMe,
  isSelected,
  onToggle,
  dropdownAlign,
}) => {
  const initial = (player.name?.trim().charAt(0) || "?").toUpperCase();

  return (
    <S.IconItem>
      <S.PlayerIcon
        $active={isSelected}
        $isMe={isMe}
        $isTurn={Boolean(player.turn)}
        onClick={() => onToggle(player.id)}
        title={player.name}
        aria-label={`Ver datos de ${player.name}`}
      >
        {initial}
      </S.PlayerIcon>

      {isSelected && (
        <S.Dropdown $align={dropdownAlign}>
          <S.PlayerName>
            {player.name} {isMe ? "(tu)" : ""}
          </S.PlayerName>
          <S.Stat>Puntos: {player.points}</S.Stat>
          <S.Stat>Movimientos: {player.totalMoves}</S.Stat>
          <S.Stat>Turno: {player.turn ? "Si" : "No"}</S.Stat>
        </S.Dropdown>
      )}
    </S.IconItem>
  );
};
