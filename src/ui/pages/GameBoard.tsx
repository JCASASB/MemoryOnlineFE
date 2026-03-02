import { useCallback, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useGame } from '../hooks/useGame';
import { MemoryCard } from '../components/MemoryCard';

export const GameBoard = () => {
  const [searchParams] = useSearchParams();
  const level = searchParams.get('level');

  const { cards, moves, flip, startGame } = useGame();

  useEffect(() => {
    const parsedLevel = Number(level) || 1;
    startGame(parsedLevel);
  }, [level, startGame]);

  const stableFlip = useCallback((id: string) => flip(id), [flip]);

  return (
    <div style={{ padding: '20px' }}>
      <h1>Movimientos: {moves}</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 100px)', gap: '10px' }}>
        {cards.map(card => (
          <MemoryCard key={card.id} {...card} flip={stableFlip} />
        ))}
      </div>
    </div>
  );
};
