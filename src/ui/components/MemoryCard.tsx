import { useGame } from '../hooks/useGame';
import './MemoryCard.css';


export const MemoryCard = ({ id, value, isFlipped, isMatched }: any)  => {

  const { flip } = useGame();
 
  return (
    <div className={`card ${isFlipped ? 'flipped' : ''} ${isMatched ? 'matched' : ''}`} onClick={() => flip(id)}>
    <div className="card-inner">
      <div className="card-front">?</div>
      <div className="card-back">{value}</div>
    </div>
  </div>
  );
};