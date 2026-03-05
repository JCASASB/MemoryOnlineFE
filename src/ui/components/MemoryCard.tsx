import { memo, useCallback, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import whichTransitionEventF from "./extra";

interface MemoryCardProps {
  id: string;
  value: string;
  isFlipped: boolean;
  isMatched: boolean;
  flip: (id: string) => void;
}

const CardContainer = styled.div<{ $isFlipped: boolean; $isMatched: boolean; $isAnimating: boolean }>`
  width: 100%;
  max-width: 160px;
  aspect-ratio: 5 / 7;
  perspective: 1000px;
  cursor: ${({ $isFlipped, $isMatched, $isAnimating }) => ($isFlipped || $isMatched || $isAnimating ? 'default' : 'pointer')};
  opacity: ${({ $isMatched }) => ($isMatched ? 0.5 : 1)};

  .card-inner {
    position: relative;
    width: 100%;
    height: 100%;
    transition: transform 0.6s;
    transform-style: preserve-3d;
    transform: ${({ $isFlipped }) => ($isFlipped ? 'rotateY(180deg)' : 'none')};
  }

  .card-front,
  .card-back {
    position: absolute;
    width: 100%;
    height: 100%;
    backface-visibility: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 2rem;
    border-radius: 8px;
    border: 2px solid #ccc;
  }

  .card-front {
    background: #2c3e50;
    color: white;
  }

  .card-back {
    background: #f0f0f0;
    transform: rotateY(180deg);
  }
`;

export const MemoryCard = memo(({ id, value, isFlipped, isMatched, flip }: MemoryCardProps)  => {
  
  console.log("Renderizando carta:", id, "Valor:", value, "Volteada:", isFlipped, "Emparejada:", isMatched);

  const transitionEvent = whichTransitionEventF();

  const containerRef = useRef<HTMLDivElement>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  
  const startAnimation = useCallback(() => {
    setIsAnimating(true);
    console.log('Animación de volteo iniciada para la carta:', id);
  }, [id]);

  const finishAnimation = useCallback(() => {
    setIsAnimating(false);
    console.log('Animación de volteo finalizada para la carta:', id);
  }, [id]);

  useEffect(() => {
    const node = containerRef.current;
    if (transitionEvent && node) {
      node.addEventListener('transitionstart', startAnimation);
      node.addEventListener(transitionEvent, finishAnimation);
    }

    return () => {
      if (transitionEvent && node) {
        node.removeEventListener('transitionstart', startAnimation);
        node.removeEventListener(transitionEvent, finishAnimation);
      }
    };
  }, [transitionEvent, startAnimation, finishAnimation]);

  return (
    <CardContainer 
      ref={containerRef}
      $isFlipped={isFlipped}
      $isMatched={isMatched}
      $isAnimating={isAnimating}
      onClick={() => (isFlipped || isAnimating) ? "" : flip(id)}>
    <div className="card-inner">
      <div className="card-front">?</div>
      <div className="card-back">{value}</div>
    </div>
  </CardContainer>
  );
});