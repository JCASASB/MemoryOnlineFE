import { memo, useEffect, useRef } from 'react';
import './MemoryCard.css';
import whichTransitionEventF from "./extra";

interface MemoryCardProps {
  id: string;
  value: string;
  isFlipped: boolean;
  isMatched: boolean;
  flip: (id: string) => void;
}

export const MemoryCard = memo(({ id, value, isFlipped, isMatched, flip }: MemoryCardProps)  => {
  console.log("Renderizando carta:", id, "Valor:", value, "Volteada:", isFlipped, "Emparejada:", isMatched);

  const transitionEvent = whichTransitionEventF();

  const containerRef = useRef(null);
  
  const finishAnimation = () => {
    // Aquí puedes manejar lo que sucede al finalizar la animación
    console.log('Animación de volteo finalizada para la carta:', id);
  }

  useEffect(() => {
    // When the component is mounted, add your DOM listener to the "nv" elem.
    // (The "nv" elem is assigned in the render function.)
    // this.nv.addEventListener('nv-enter', this.handleNvEnter);

    if (transitionEvent)
      containerRef.current.addEventListener(
        transitionEvent,
        finishAnimation
      );

    return () => {
      containerRef.current.removeEventListener(
        transitionEvent,
        finishAnimation
      );
    };
  }, [
    transitionEvent,
    finishAnimation,
  ]);

  return (
    <div 
      ref={containerRef}
      className={`card ${isFlipped ? 'flipped' : ''} ${isMatched ? 'matched' : ''}`} 
      onClick={() => isFlipped ? "" : flip(id)}>
    <div className="card-inner">
      <div className="card-front">?</div>
      <div className="card-back">{value}</div>
    </div>
  </div>
  );
});