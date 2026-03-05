import { createContext } from 'react';
import type { FlipCardUseCase } from '../../core/application/FlipCard';
import type { StartGameUseCase } from '../../core/application/StartGame';
import type { GameRepository } from '../../core/domain/repositories/GameRepository';
import type { OnlineMemoryGameRepository } from '../../infrastructure/repositories/OnlineMemoryGameRepository';

export interface MemoryContextType {
    repository: GameRepository;
    flipCardUseCase: FlipCardUseCase;
    startGameUseCase: StartGameUseCase;
    // Solo presente cuando online=true, expone connect/disconnect del repo online
    onlineRepository?: OnlineMemoryGameRepository;
}

export const DependencyContext = createContext<MemoryContextType | undefined>(undefined);
