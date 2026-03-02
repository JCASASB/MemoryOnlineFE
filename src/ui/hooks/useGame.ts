import { useSyncExternalStore } from 'react';
import { useDependencies } from '../context/useDependencies';

export const useGame = () => {
  const { repository, flipCardUseCase } = useDependencies();

  const state = useSyncExternalStore(repository.subscribe, repository.getState);

  // Calcula las cartas para el nivel
  const cards = state.cards ? state.cards : [];

  return {
    ...state,
    cards,
    flip: (id: string) => flipCardUseCase.execute(id)
  };
};
