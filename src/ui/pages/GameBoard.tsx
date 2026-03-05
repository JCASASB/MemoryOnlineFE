import { useCallback, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import styled from 'styled-components';
import { useGame } from '../hooks/useGame';
import { MemoryCard } from '../components/MemoryCard';

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
  const [searchParams] = useSearchParams();
  const level = searchParams.get('level');
  const gameId = searchParams.get('gameId') || undefined;

  const { cards, moves, flip, startGame } = useGame(gameId);

  useEffect(() => {
    const parsedLevel = Number(level) || 1;
    startGame(parsedLevel);
  }, [level, startGame]);

  const stableFlip = useCallback((id: string) => flip(id), [flip]);

  const columns = useMemo(() => Math.ceil(Math.sqrt(cards.length)), [cards.length]);

  return (
    <BoardWrapper>
      <Header>Movimientos: {moves}</Header>
      <Grid $columns={columns}>
        {cards.map(card => (
          <MemoryCard key={card.id} {...card} flip={stableFlip} />
        ))}
      </Grid>
    </BoardWrapper>
  );
};
