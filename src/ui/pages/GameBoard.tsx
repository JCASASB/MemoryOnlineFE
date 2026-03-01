import { useGame } from '../hooks/useGame';
import { MemoryCard } from '../components/MemoryCard';

export const GameBoard = () => {
  const { cards, moves, flip } = useGame();

  return (
    <div style={{ padding: '20px' }}>
      <h1>Movimientos: {moves}</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 100px)', gap: '10px' }}>
        {cards.map(card => (
          <MemoryCard key={card.id} {...card} onClick={() => flip(card.id)} />
        ))}
      </div>
    </div>
  );
};
