import { useMemo } from "react";
import PreventPullToRefresh from "../../PreventPullToRefresh";
import styled from "styled-components";
import { usePlayer } from "../../hooks/usePlayer";
import { MemoryCard } from "../../components/card/MemoryCard";
import { ScoreBoard } from "../../components/scoreBoard/ScoreBoard";
import { useGameState } from "../../hooks/useGameState";
import { useUCs } from "../../hooks/useUCs";

const BoardWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  /* Eliminamos el min-height fijo para que fluya con el scroll del Layout */
  padding: 12px;
  box-sizing: border-box;
`;

// Contenedor para fijar el ScoreBoard
const StickyHeader = styled.div`
  position: sticky;
  top: 0;
  z-index: 10;
  padding-bottom: 8px;
  margin: -12px -12px 0 -12px; /* Compensa el padding del BoardWrapper */
  padding: 12px 12px 8px 12px;
`;

const Header = styled.h1`
  margin: 16px 0;
  flex-shrink: 0;
  color: #fff;
  font-size: 1.5rem;
`;

const Grid = styled.div<{ $columns: number }>`
  flex: 1;
  display: grid;
  grid-template-columns: repeat(${({ $columns }) => $columns}, 1fr);
  gap: 12px;
  align-content: center;
  justify-items: center;
  margin-top: 16px;
`;

export const GameBoard = () => {
  console.log("Renderizando GameBoard");
  const { playerId } = usePlayer();
  const { flipCardUC, checkCardsUC } = useUCs();
  const { stateGame } = useGameState();

  const stableFlip = (idCard: string) => {
    flipCardUC(idCard, playerId)
      .then((versionNumber: number) => {
        checkCardsUC(versionNumber);
      })
      .catch((error) => {
        console.error(`Error flipping card ${idCard}:`, error);
      });
  };

  const columns = useMemo(
    () => Math.ceil(Math.sqrt(stateGame.cards.length)),
    [stateGame.cards.length],
  );

  return (
    <PreventPullToRefresh>
      <BoardWrapper>
        {/* Sección Fija Superior */}
        <StickyHeader>
          <ScoreBoard
            players={stateGame.players}
            myPlayerId={playerId}
            matchName={stateGame.name}
          />
        </StickyHeader>

        {/* Sección con Scroll */}
        {stateGame.players.length < 2 && (
          <div style={{ textAlign: "center" }}>
            <Header>Esperando jugador...</Header>
          </div>
        )}

        <Grid $columns={columns}>
          {stateGame.cards.map((card) => (
            <MemoryCard
              stateCard={card.state}
              key={card.id}
              {...card}
              flip={stableFlip}
            />
          ))}
        </Grid>
      </BoardWrapper>
    </PreventPullToRefresh>
  );
};
