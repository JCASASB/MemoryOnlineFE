import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useDependencies } from '../context/useDependencies';
import { useGame } from '../hooks/useGame';
import { MemoryCard } from '../components/MemoryCard';

export const GameBoard = () => {
  const [searchParams] = useSearchParams();
  const level = searchParams.get('level');
  const { startGameUseCase } = useDependencies();

  useEffect(() => {
    const parsedLevel = Number(level) || 1;
    startGameUseCase.execute(parsedLevel);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [level]);

  const { cards, moves } = useGame();

  return (
    <div style={{ padding: '20px' }}>
      <h1>Movimientos: {moves}</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 100px)', gap: '10px' }}>
        {cards.map(card => (
          <MemoryCard key={card.id} {...card} />
        ))}
      </div>
    </div>
  );
};
