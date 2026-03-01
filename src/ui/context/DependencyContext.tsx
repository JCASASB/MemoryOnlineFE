import React, { createContext, useContext } from 'react';
import { InMemoryGameRepository } from '../../infrastructure/repositories/InMemoryGameRepository';
import { FlipCardUseCase } from '../../core/application/FlipCard';

const repo = new InMemoryGameRepository();
const dependencies = {
  repository: repo,
  flipCardUseCase: new FlipCardUseCase(repo)
};

const DependencyContext = createContext(dependencies);

export const DependencyProvider = ({ children }: { children: React.ReactNode }) => (
  <DependencyContext.Provider value={dependencies}>{children}</DependencyContext.Provider>
);

export const useDependencies = () => useContext(DependencyContext);
