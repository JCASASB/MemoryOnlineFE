import { createContext } from 'react';
import type { FlipCardUseCase } from '../../core/application/FlipCard';
import type { StartGameUseCase } from '../../core/application/StartGame';
import type { InMemoryGameRepository } from '../../infrastructure/repositories/InMemoryGameRepository';

interface MemoryContextType {
    repository: InMemoryGameRepository;
    flipCardUseCase: FlipCardUseCase;
    startGameUseCase: StartGameUseCase;
}

export const DependencyContext = createContext<MemoryContextType | undefined>(undefined);
