
import React from 'react';
import { DependencyContext } from './DependencyContextInstance';
import { InMemoryGameRepository } from '../../infrastructure/repositories/InMemoryGameRepository';
import { FlipCardUseCase } from '../../core/application/FlipCard';
import { StartGameUseCase } from '../../core/application/StartGame';


export const DependencyProvider = ({ children }: { children: React.ReactNode }) => {
  const repo = new InMemoryGameRepository();
  const dependencies = {
    repository: repo,
    flipCardUseCase: new FlipCardUseCase(repo),
    startGameUseCase: new StartGameUseCase(repo)
  };
  return (
    <DependencyContext.Provider value={dependencies}>{children}</DependencyContext.Provider>
  );
};

