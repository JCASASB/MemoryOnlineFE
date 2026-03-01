import './MemoryCard.css';

export const MemoryCard = ({ value, isFlipped, isMatched, onClick }: any) => (
  <div className={`card ${isFlipped ? 'flipped' : ''} ${isMatched ? 'matched' : ''}`} onClick={onClick}>
    <div className="card-inner">
      <div className="card-front">?</div>
      <div className="card-back">{value}</div>
    </div>
  </div>
);
