import { useSyncExternalStore } from 'react';
import { useDependencies } from '../context/DependencyContext';

export const useGame = () => {
  const { repository, flipCardUseCase } = useDependencies();
  const state = useSyncExternalStore(repository.subscribe, repository.getState);

  return {
    ...state,
    flip: (id: string) => flipCardUseCase.execute(id)
  };
};
