import { useCallback, useSyncExternalStore } from 'react';
import { useDependencies } from '../context/useDependencies';

export const useGame = () => {
  const { repository, flipCardUseCase, startGameUseCase } = useDependencies();

  const state = useSyncExternalStore(repository.subscribe, repository.getState);

  // Calcula las cartas para el nivel
  const cards = state.cards ? state.cards : [];

  const flip = useCallback(
    (id: string) => flipCardUseCase.execute(id),
    [flipCardUseCase]
  );

  const startGame = useCallback(
    (level: number) => startGameUseCase.execute(level),
    [startGameUseCase]
  );

  return {
    ...state,
    cards,
    flip,
    startGame,
  };
};
