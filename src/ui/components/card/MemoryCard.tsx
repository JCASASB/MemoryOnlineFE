import { useCallback, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import whichTransitionEventF from "./extra";
import { StateCard } from "../../../core/game/domain/entities/StateCard";
import { useAnimations } from "../../hooks/useAnimations";

interface MemoryCardProps {
  id: string;
  value: number;
  stateCard: StateCard;
  flip: (id: string) => void;
}

const CardContainer = styled.div<{
  $stateCard: StateCard;
  $isAnimating: boolean;
}>`
  width: 100%;
  max-width: 160px;
  aspect-ratio: 5 / 7;
  perspective: 1000px;
  cursor: ${({ $stateCard, $isAnimating }) =>
    $stateCard === StateCard.FaceDown && !$isAnimating ? "pointer" : "default"};
  opacity: ${({ $stateCard }) => ($stateCard === StateCard.Matched ? 0.5 : 1)};

  .card-inner {
    position: relative;
    width: 100%;
    height: 100%;
    transition: transform 0.6s;
    transform-style: preserve-3d;
    transform: ${({ $stateCard }) =>
      $stateCard === StateCard.FaceUp || $stateCard === StateCard.Matched
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

export const MemoryCard = ({ id, value, stateCard, flip }: MemoryCardProps) => {
  const { addAnimationInProgress, removeAnimationInProgress } = useAnimations();

  const transitionEvent = whichTransitionEventF();

  const containerRef = useRef<HTMLDivElement>(null);
  const [isAnimatingThisCard, setIsAnimatingThisCard] = useState(false);

  const startAnimation = useCallback(() => {
    setIsAnimatingThisCard(true);
    addAnimationInProgress(id);
  }, [addAnimationInProgress, id]);

  const finishAnimation = useCallback(() => {
    setIsAnimatingThisCard(false);
    removeAnimationInProgress(id);
  }, [removeAnimationInProgress, id]);

  const handleClick = () => {
    if (stateCard === StateCard.FaceDown && !isAnimatingThisCard) {
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
      $stateCard={stateCard}
      $isAnimating={isAnimatingThisCard}
      data-state={StateCard[stateCard]}
      onClick={handleClick}
    >
      <div className="card-inner">
        <div className="card-front">?</div>
        <div className="card-back">{value}</div>
      </div>
    </CardContainer>
  );
};
