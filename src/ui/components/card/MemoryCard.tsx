import { memo, useCallback, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import whichTransitionEventF from "./extra";
import { useUCs } from "../../hooks/useUCs";

interface MemoryCardProps {
  id: string;
  value: number;
  isRevealed: boolean;
  isMatched: boolean;
  flip: (id: string) => Promise<void> | void;
}

const CardContainer = styled.div<{
  $isRevealed: boolean;
  $isMatched: boolean;
  $isAnimating: boolean;
}>`
  width: 100%;
  max-width: 160px;
  aspect-ratio: 5 / 7;
  perspective: 1000px;
  cursor: ${({ $isRevealed, $isMatched, $isAnimating }) =>
    $isRevealed || $isMatched || $isAnimating ? "default" : "pointer"};
  opacity: ${({ $isMatched }) => ($isMatched ? 0.5 : 1)};

  .card-inner {
    position: relative;
    width: 100%;
    height: 100%;
    transition: transform 0.6s;
    transform-style: preserve-3d;
    transform: ${({ $isRevealed }) =>
      $isRevealed ? "rotateY(180deg)" : "none"};
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

export const MemoryCard = memo(
  ({ id, value, isRevealed, isMatched, flip }: MemoryCardProps) => {
    //console.log("Renderizando carta:", id, "Valor:", value, "Revelada:", isRevealed, "Emparejada:", isMatched);
    const { checkCardsUC } = useUCs();

    const transitionEvent = whichTransitionEventF();

    const containerRef = useRef<HTMLDivElement>(null);
    const [isAnimating, setIsAnimating] = useState(false);

    const startAnimation = useCallback(() => {
      setIsAnimating(true);
      console.log("Animación de volteo iniciada para la carta:", id);
    }, [id]);

    const finishAnimation = useCallback(() => {
      setIsAnimating(false);
      console.log("Animación de volteo finalizada para la carta:");
      checkCardsUC();
    }, [checkCardsUC]);

    useEffect(() => {
      const node = containerRef.current;
      if (transitionEvent && node) {
        node.addEventListener("transitionstart", startAnimation);
        node.addEventListener(transitionEvent, finishAnimation);
      }

      return () => {
        if (transitionEvent && node) {
          node.removeEventListener("transitionstart", startAnimation);
          node.removeEventListener(transitionEvent, finishAnimation);
        }
      };
    }, [transitionEvent, startAnimation, finishAnimation]);

    return (
      <CardContainer
        ref={containerRef}
        $isRevealed={isRevealed}
        $isMatched={isMatched}
        $isAnimating={isAnimating}
        onClick={() => (isRevealed || isAnimating ? "" : flip(id))}
      >
        <div className="card-inner">
          <div className="card-front">?</div>
          <div className="card-back">{value}</div>
        </div>
      </CardContainer>
    );
  },
);
