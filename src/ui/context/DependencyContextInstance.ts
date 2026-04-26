import { createContext } from "react";
import type { ApplicationJoinGame } from "../../core/game/application/ApplicationJoinGame";
import type { OnlineMemoryGameRepository } from "../../infrastructure/repositories/OnlineMemoryGameRepository";
import type { ApplicationCreateGame } from "../../core/game/application/ApplicationCreateGame";
import type { ApplicationFlipCard } from "../../core/game/application/ApplicationFlipCard";
import type { ApplicationCheckCards } from "../../core/game/application/ApplicationCheckCards";
import type { ApplicationAnimationInProgressAdd } from "../../core/game/application/ApplicationAnimationInProgresAdd";
import type { ApplicationAnimationInProgressRemove } from "../../core/game/application/ApplicationAnimationInProgresRemove";
import type { ApplicationGetNextState } from "../../core/game/application/ApplicationGetNextState";
import type { ApplicationSendChatMessage } from "../../core/chat/application/ApplicationSendChatMessage";
import type { ChatRepositoryType } from "../../core/chat/repository/ChatRepositoryType";

export interface MemoryContextType {
  applicationFlipCard: ApplicationFlipCard;
  applicationJoinGame: ApplicationJoinGame;
  applicationCreateGame: ApplicationCreateGame;
  applicationCheckCards: ApplicationCheckCards;
  applicationSendChatMessage: ApplicationSendChatMessage;
  chatRepository: ChatRepositoryType;
  getNextStateUseCase: ApplicationGetNextState;
  applicationAnimationInProgressAdd: ApplicationAnimationInProgressAdd;
  applicationAnimationInProgressRemove: ApplicationAnimationInProgressRemove;

  // Solo presente cuando online=true, expone connect/disconnect del repo online
  onlineRepository: OnlineMemoryGameRepository;
}

export const DependencyContext = createContext<MemoryContextType | undefined>(
  undefined,
);
