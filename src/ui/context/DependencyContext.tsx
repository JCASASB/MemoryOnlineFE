import React, { useMemo } from "react";
import { DependencyContext } from "./DependencyContextInstance";
import type { MemoryContextType } from "./DependencyContextInstance";
import { OnlineMemoryGameRepository } from "../../infrastructure/repositories/OnlineMemoryGameRepository";
import { SignalRGameHub } from "../../infrastructure/signalr/SignalRGameHub";
import { UseCaseCreateGame } from "../../core/game/domain/useCases/UseCaseCreateGame";
import { ApplicationCreateMatch } from "../../core/game/application/ApplicationCreateMatch";
import { ApplicationFlipCard } from "../../core/game/application/ApplicationFlipCard";
import { UseCaseFlipCard } from "../../core/game/domain/useCases/UseCaseFlipCard";
import { ApplicationCheckCards } from "../../core/game/application/ApplicationCheckCards";
import { UseCaseCheckCards } from "../../core/game/domain/useCases/UseCaseCheckCards";
import { ApplicationAnimationInProgressAdd } from "../../core/game/application/ApplicationAnimationInProgresAdd";
import { ApplicationAnimationInProgressRemove } from "../../core/game/application/ApplicationAnimationInProgresRemove";
import { ApplicationGetNextState } from "../../core/game/application/ApplicationGetNextState";
import { ApplicationGetLastAppliedState } from "../../core/game/application/ApplicationGetLastAppliedState";
import { UseCaseJoinMatch } from "../../core/game/domain/useCases/UseCaseJoinMatch";
import { ApplicationSendChatMessage } from "../../core/chat/application/ApplicationSendChatMessage";
import { UseCaseSendChatMessage } from "../../core/chat/domain/useCases/UseCaseSendChatMessage";
import { ChatRepository } from "../../infrastructure/repositories/ChatRepository";
import { ApplicationJoinGameByMatchId } from "../../core/game/application/ApplicationJoinGameByMatchId";
import { ApplicationCreateChallenge } from "../../core/chat/application/ApplicationCreateChallenge";
import { UseCaseCreateChallenge } from "../../core/chat/domain/useCases/UseCaseCreateChallenge";

interface Props {
  children: React.ReactNode;
  online?: boolean;
}

export const DependencyProvider = ({ children }: Props) => {
  const dependencies = useMemo<MemoryContextType>(() => {
    const gameRepository = new OnlineMemoryGameRepository();
    const chatRepo = new ChatRepository();
    const signalRApplicationHub = SignalRGameHub.getInstance();
    return {
      signalRGameHub: signalRApplicationHub,
      chatRepository: chatRepo,
      onlineRepository: gameRepository,

      applicationFlipCard: new ApplicationFlipCard(
        signalRApplicationHub,
        gameRepository,
        new UseCaseFlipCard(),
      ),
      applicationCreateGame: new ApplicationCreateMatch(
        signalRApplicationHub,
        new UseCaseCreateGame(),
      ),
      applicationCheckCards: new ApplicationCheckCards(
        signalRApplicationHub,
        gameRepository,
        new UseCaseCheckCards(),
      ),
      applicationSendChatMessage: new ApplicationSendChatMessage(
        signalRApplicationHub,
        new UseCaseSendChatMessage(),
      ),
      applicationCreateChallenge: new ApplicationCreateChallenge(
        signalRApplicationHub,
        new UseCaseCreateChallenge(),
      ),
      getNextStateUseCase: new ApplicationGetNextState(gameRepository),
      getLastAppliedStateUseCase: new ApplicationGetLastAppliedState(
        gameRepository,
      ),
      applicationAnimationInProgressAdd: new ApplicationAnimationInProgressAdd(
        gameRepository,
      ),
      applicationAnimationInProgressRemove:
        new ApplicationAnimationInProgressRemove(gameRepository),
      applicationJoinGameByMatchId: new ApplicationJoinGameByMatchId(
        signalRApplicationHub,
        gameRepository,
        new UseCaseJoinMatch(),
      ),
    };
  }, []);

  return (
    <DependencyContext.Provider value={dependencies}>
      {children}
    </DependencyContext.Provider>
  );
};
