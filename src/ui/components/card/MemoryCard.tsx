import { memo, useCallback, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import whichTransitionEventF from "./extra";
import { StateCard } from "../../../core/domain/entities/StateCard";
import { useAnimations } from "../../hooks/useAnimations";

interface MemoryCardProps {
  id: string;
  value: number;
  state: StateCard;
  isTurn: boolean;
  flip: (id: string) => void;
}

const CardContainer = styled.div<{
  $state: StateCard;
  $isAnimating: boolean;
}>`
  width: 100%;
  max-width: 160px;
  aspect-ratio: 5 / 7;
  perspective: 1000px;
  cursor: ${({ $state, $isAnimating }) =>
    $state === StateCard.FaceDown && !$isAnimating ? "pointer" : "default"};
  opacity: ${({ $state }) => ($state === StateCard.Matched ? 0.5 : 1)};

  .card-inner {
    position: relative;
    width: 100%;
    height: 100%;
    transition: transform 0.6s;
    transform-style: preserve-3d;
    transform: ${({ $state }) =>
      $state === StateCard.FaceUp || $state === StateCard.Matched
        ? "rotateY(180deg)"
        : "none"};
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

export const MemoryCard = ({
  id,
  value,
  state,
  isTurn,
  flip,
}: MemoryCardProps) => {
  //console.log("Renderizando carta:", id, "Valor:", value, "Revelada:", isRevealed, "Emparejada:", isMatched);
  const { addAnimationInProgress, removeAnimationInProgress } = useAnimations();

  const transitionEvent = whichTransitionEventF();

  const containerRef = useRef<HTMLDivElement>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  const startAnimation = useCallback(() => {
    setIsAnimating(true);
    if (state === StateCard.FaceUp) {
      addAnimationInProgress(id);
      console.log("Animación de volteo iniciada para la carta:", id);
    }
  }, [addAnimationInProgress, state, id]);

  const finishAnimation = useCallback(() => {
    setIsAnimating(false);

    if (state === StateCard.FaceUp) {
      removeAnimationInProgress(id);
      console.log("Animación de volteo finalizada para la carta:", id);
    }
  }, [removeAnimationInProgress, state, id]);

  const handleClick = () => {
    console.log("Carta clickeada:", id, "Estado actual:", state);
    if (state === StateCard.FaceDown && !isAnimating) {
      flip(id);
    }
  };

  useEffect(() => {
    const node = containerRef.current;
    if (transitionEvent && node) {
      node.addEventListener("transitionstart", startAnimation as EventListener);
      node.addEventListener(transitionEvent, finishAnimation as EventListener);
    }

    return () => {
      if (transitionEvent && node) {
        node.removeEventListener(
          "transitionstart",
          startAnimation as EventListener,
        );
        node.removeEventListener(
          transitionEvent,
          finishAnimation as EventListener,
        );
      }
    };
  }, [transitionEvent, startAnimation, finishAnimation]);

  return (
    <CardContainer
      ref={containerRef}
      $state={state}
      $isAnimating={isAnimating}
      data-state={StateCard[state]}
      onClick={handleClick}
    >
      <div className="card-inner">
        <div className="card-front">?</div>
        <div className="card-back">{value}</div>
      </div>
    </CardContainer>
  );
};
