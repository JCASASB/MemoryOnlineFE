import { createContext } from "react";
import type { ApplicationJoinGame } from "../../core/application/ApplicationJoinGame";
import type { OnlineMemoryGameRepository } from "../../infrastructure/repositories/OnlineMemoryGameRepository";
import type { UseCaseGetUpdatedState } from "../../core/application/UseCaseGetUpdatedState";
import type { ApplicationCreateGame } from "../../core/application/ApplicationCreateGame";
import type { ApplicationFlipCard } from "../../core/application/ApplicationFlipCard";
import type { ApplicationCheckCards } from "../../core/application/ApplicationCheckCards";
import type { ApplicationAnimationInProgressAdd } from "../../core/application/ApplicationAnimationInProgresAdd";
import type { ApplicationAnimationInProgressRemove } from "../../core/application/ApplicationAnimationInProgresRemove";
import type { ApplicationGetNextState } from "../../core/application/ApplicationGetNextState";

export interface MemoryContextType {
  applicationFlipCard: ApplicationFlipCard;
  applicationJoinGame: ApplicationJoinGame;
  applicationCreateGame: ApplicationCreateGame;
  applicationCheckCards: ApplicationCheckCards;
  getUpdatedStateUseCase: UseCaseGetUpdatedState;
  getNextStateUseCase: ApplicationGetNextState;
  applicationAnimationInProgressAdd: ApplicationAnimationInProgressAdd;
  applicationAnimationInProgressRemove: ApplicationAnimationInProgressRemove;

  // Solo presente cuando online=true, expone connect/disconnect del repo online
  onlineRepository: OnlineMemoryGameRepository;
}

export const DependencyContext = createContext<MemoryContextType | undefined>(
  undefined,
);
