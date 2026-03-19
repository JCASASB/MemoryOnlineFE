import { createContext } from "react";
import type { ApplicationJoinGame } from "../../core/application/ApplicationJoinGame";
import type { OnlineMemoryGameRepository } from "../../infrastructure/repositories/OnlineMemoryGameRepository";
import type { UseCaseGetUpdatedState } from "../../core/application/UseCaseGetUpdatedState";
import type { ApplicationCreateGame } from "../../core/application/ApplicationCreateGame";
import type { ApplicationFlipCard } from "../../core/application/ApplicationFlipCard";
import type { ApplicationCheckCards } from "../../core/application/ApplicationCheckCards";

export interface MemoryContextType {
  applicationFlipCard: ApplicationFlipCard;
  applicationJoinGame: ApplicationJoinGame;
  applicationCreateGame: ApplicationCreateGame;
  applicationCheckCards: ApplicationCheckCards;
  getUpdatedStateUseCase: UseCaseGetUpdatedState;
  // Solo presente cuando online=true, expone connect/disconnect del repo online
  onlineRepository: OnlineMemoryGameRepository;
}

export const DependencyContext = createContext<MemoryContextType | undefined>(
  undefined,
);
