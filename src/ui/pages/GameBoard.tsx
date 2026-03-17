import { useCallback, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { useGame } from "../hooks/useGame";
import { usePlayer } from "../hooks/usePlayer";
import { MemoryCard } from "../components/MemoryCard";
import { ScoreBoard } from "../components/scoreBoard/ScoreBoard";

const BoardWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100vw;
  height: 100vh;
  padding: 24px;
  box-sizing: border-box;
`;

const Header = styled.h1`
  margin: 0 0 16px;
  flex-shrink: 0;
`;

const Grid = styled.div<{ $columns: number }>`
  flex: 1;
  display: grid;
  grid-template-columns: repeat(${({ $columns }) => $columns}, 1fr);
  gap: 12px;
  align-content: center;
  justify-items: center;
`;

export const GameBoard = () => {
  const navigate = useNavigate();
  const { playerName } = usePlayer();

  // Si no hay nombre, redirigir al login con la URL actual como "next"
  useEffect(() => {
    if (!playerName) {
      const next = encodeURIComponent(
        window.location.hash.replace("#", "") || "/",
      );
      navigate(`/login?next=${next}`);
    }
  }, [playerName, navigate]);

  const { stateGame, flipCardUC } = useGame();

  const stableFlip = useCallback(
    (id: string) => flipCardUC(id, playerName),
    [flipCardUC, playerName],
  );

  const columns = useMemo(
    () => Math.ceil(Math.sqrt(stateGame.cards.length)),
    [stateGame.cards.length],
  );

  return (
    <BoardWrapper>
      <ScoreBoard players={stateGame.players} myPlayerName={playerName} />
      {stateGame.players.length < 2 && <Header>Esperando jugador...</Header>}
      <Grid $columns={columns}>
        {stateGame.cards.map((card) => (
          <MemoryCard key={card.id} {...card} flip={stableFlip} />
        ))}
      </Grid>
    </BoardWrapper>
  );
};
