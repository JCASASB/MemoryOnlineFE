import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { usePlayer } from "../hooks/usePlayer";
import { MemoryCard } from "../components/card/MemoryCard";
import { ScoreBoard } from "../components/scoreBoard/ScoreBoard";
import { ConnectionStatus } from "../components/connection/ConnectionStatus";
import { LinkShare } from "../components/linkShare/LinkShare";
import { useGameState } from "../hooks/useGameState";
import { useUCs } from "../hooks/useUCs";

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

  const { flipCardUC, checkCardsUC } = useUCs();
  const { stateGame } = useGameState();

  const stableFlip = (id: string) => {
    flipCardUC(id, playerName)
      .then((versionNumber: number) => {
        console.log(
          `Flip successful for card ${id} - new version: ${versionNumber}`,
        );
        checkCardsUC(versionNumber);
      })
      .catch((error) => {
        console.error(`Error flipping card ${id}:`, error);
      });
  };

  const columns = useMemo(
    () => Math.ceil(Math.sqrt(stateGame.cards.length)),
    [stateGame.cards.length],
  );

  const currentPlayer = stateGame.players.find((p) => p.name === playerName);

  return (
    <BoardWrapper>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <ScoreBoard players={stateGame.players} myPlayerName={playerName} />
        <ConnectionStatus />
      </div>
      {stateGame.players.length < 2 && (
        <>
          <Header>Esperando jugador...</Header>
          <LinkShare />
        </>
      )}
      <Grid $columns={columns}>
        {stateGame.cards.map((card) => (
          <MemoryCard
            key={card.id}
            {...card}
            isTurn={currentPlayer?.turn ?? false}
            flip={stableFlip}
          />
        ))}
      </Grid>
    </BoardWrapper>
  );
};
