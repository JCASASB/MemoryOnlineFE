import { createContext } from "react";
import type { OnlineMemoryGameRepository } from "../../infrastructure/repositories/OnlineMemoryGameRepository";
import type { ApplicationCreateMatch } from "../../core/game/application/ApplicationCreateMatch";
import type { ApplicationFlipCard } from "../../core/game/application/ApplicationFlipCard";
import type { ApplicationCheckCards } from "../../core/game/application/ApplicationCheckCards";
import type { ApplicationAnimationInProgressAdd } from "../../core/game/application/ApplicationAnimationInProgresAdd";
import type { ApplicationAnimationInProgressRemove } from "../../core/game/application/ApplicationAnimationInProgresRemove";
import type { ApplicationGetNextState } from "../../core/game/application/ApplicationGetNextState";
import type { ApplicationGetLastAppliedState } from "../../core/game/application/ApplicationGetLastAppliedState";
import type { ApplicationSendChatMessage } from "../../core/chat/application/ApplicationSendChatMessage";
import type { ChatRepositoryType } from "../../core/chat/repository/ChatRepositoryType";
import type { ApplicationJoinGameByMatchId } from "../../core/game/application/ApplicationJoinGameByMatchId";
import type { ApplicationCreateChallenge } from "../../core/chat/application/ApplicationCreateChallenge";

export interface MemoryContextType {
  applicationFlipCard: ApplicationFlipCard;
  applicationCreateGame: ApplicationCreateMatch;
  applicationCheckCards: ApplicationCheckCards;
  applicationSendChatMessage: ApplicationSendChatMessage;
  chatRepository: ChatRepositoryType;
  getNextStateUseCase: ApplicationGetNextState;
  getLastAppliedStateUseCase: ApplicationGetLastAppliedState;
  applicationAnimationInProgressAdd: ApplicationAnimationInProgressAdd;
  applicationAnimationInProgressRemove: ApplicationAnimationInProgressRemove;
  applicationCreateChallenge: ApplicationCreateChallenge;
  applicationJoinGameByMatchId: ApplicationJoinGameByMatchId;
  // Solo presente cuando online=true, expone connect/disconnect del repo online
  onlineRepository: OnlineMemoryGameRepository;
  signalRGameHub: import("../../infrastructure/signalr/SignalRGameHub").SignalRGameHub;
}

export const DependencyContext = createContext<MemoryContextType | undefined>(
  undefined,
);
