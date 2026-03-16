import { createContext } from "react";
import type { UseCaseFlipCard } from "../../core/application/UseCaseFlipCard";
import type { UseCaseJoinGame } from "../../core/application/UseCaseJoinGame";
import type { GameRepository } from "../../core/domain/repositories/GameRepository";
import type { OnlineMemoryGameRepository } from "../../infrastructure/repositories/OnlineMemoryGameRepository";
import type { UseCaseCreateGame } from "../../core/application/UseCaseCreateGame";
import type { UseCaseGetUpdatedState } from "../../core/application/UseCaseGetUpdatedState";

export interface MemoryContextType {
  repository: GameRepository;
  flipCardUseCase: UseCaseFlipCard;
  createGameUseCase: UseCaseCreateGame;
  joinGameUseCase: UseCaseJoinGame;
  getUpdatedStateUseCase: UseCaseGetUpdatedState;
  // Solo presente cuando online=true, expone connect/disconnect del repo online
  onlineRepository?: OnlineMemoryGameRepository;
}

export const DependencyContext = createContext<MemoryContextType | undefined>(
  undefined,
);
