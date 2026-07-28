// GameBoard.tsx
import { useMemo, useState } from "react";
import PreventPullToRefresh from "../../../PreventPullToRefresh";
import { usePlayer } from "../../../hooks/usePlayer";
import { MemoryCard } from "../../../components/card/MemoryCard";
import { ScoreBoard } from "../../../components/scoreBoard/ScoreBoard";
import { useGameState } from "../../../hooks/useGameState";
import { useUCs } from "../../../hooks/useUCs";
import * as S from "./GameBoard.styles"; // <-- Importación de los estilos agregada

export const GameBoard = () => {
  console.log("Renderizando GameBoard");
  const { playerId } = usePlayer();
  const { flipCardUC, checkCardsUC } = useUCs();
  const { stateGame } = useGameState();
  const [isProcessingClick, setIsProcessingClick] = useState(false);

  const stableFlip = (idCard: string) => {
    if (!isProcessingClick) {
      setIsProcessingClick(true);
      flipCardUC(idCard, playerId)
        .then((versionNumber: number) => {
          checkCardsUC(versionNumber);
        })
        .catch((error) => {
          console.error(`Error flipping card ${idCard}:`, error);
        })
        .finally(() => {
          setIsProcessingClick(false);
        });
    }
  };

  const columns = useMemo(
    () => Math.ceil(Math.sqrt(stateGame.cards.length)),
    [stateGame.cards.length],
  );

  return (
    <PreventPullToRefresh>
      <S.BoardWrapper>
        {/* Sección Fija Superior */}
        <S.StickyHeader>
          <ScoreBoard
            players={stateGame.players}
            myPlayerId={playerId}
            matchName={stateGame.name}
          />
        </S.StickyHeader>

        {/* Sección con Scroll */}
        {stateGame.players.length < 2 && (
          <S.WaitingMessage>
            <S.Header>Esperando jugador...</S.Header>
          </S.WaitingMessage>
        )}

        <S.Grid $columns={columns}>
          {stateGame.cards.map((card) => (
            <MemoryCard
              stateCard={card.state}
              key={card.id}
              {...card}
              flip={stableFlip}
            />
          ))}
        </S.Grid>
      </S.BoardWrapper>
    </PreventPullToRefresh>
  );
};
