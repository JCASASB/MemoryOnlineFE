import React, { useEffect, useMemo } from "react";
import { DependencyContext } from "./DependencyContextInstance";
import type { MemoryContextType } from "./DependencyContextInstance";
import { OnlineMemoryGameRepository } from "../../infrastructure/repositories/OnlineMemoryGameRepository";
import { UseCaseCreateGame } from "../../core/game/domain/useCases/UseCaseCreateGame";
import { ApplicationCreateGame } from "../../core/game/application/ApplicationCreateGame";
import { ApplicationFlipCard } from "../../core/game/application/ApplicationFlipCard";
import { UseCaseFlipCard } from "../../core/game/domain/useCases/UseCaseFlipCard";
import { ApplicationJoinGame } from "../../core/game/application/ApplicationJoinGame";
import { ApplicationCheckCards } from "../../core/game/application/ApplicationCheckCards";
import { UseCaseCheckCards } from "../../core/game/domain/useCases/UseCaseCheckCards";
import { ApplicationAnimationInProgressAdd } from "../../core/game/application/ApplicationAnimationInProgresAdd";
import { ApplicationAnimationInProgressRemove } from "../../core/game/application/ApplicationAnimationInProgresRemove";
import { ApplicationGetNextState } from "../../core/game/application/ApplicationGetNextState";
import { UseCaseJoinMatch } from "../../core/game/domain/useCases/UseCaseJoinMatch";
import { ApplicationSendChatMessage } from "../../core/chat/application/ApplicationSendChatMessage";
import { UseCaseSendChatMessage } from "../../core/chat/domain/useCases/UseCaseSendChatMessage";
import { ChatRepository } from "../../infrastructure/repositories/ChatRepository";

const SIGNALR_HUB_URL = import.meta.env.VITE_SIGNALR_HUB_URL;

interface Props {
  children: React.ReactNode;
  online?: boolean;
}

export const DependencyProvider = ({ children }: Props) => {
  const dependencies = useMemo<MemoryContextType>(() => {
    const onlineRepo = new OnlineMemoryGameRepository(SIGNALR_HUB_URL);
    const chatRepo = new ChatRepository(SIGNALR_HUB_URL);
    return {
      applicationFlipCard: new ApplicationFlipCard(
        onlineRepo,
        new UseCaseFlipCard(),
      ),
      applicationCreateGame: new ApplicationCreateGame(
        onlineRepo,
        new UseCaseCreateGame(),
      ),
      applicationCheckCards: new ApplicationCheckCards(
        onlineRepo,
        new UseCaseCheckCards(),
      ),
      applicationSendChatMessage: new ApplicationSendChatMessage(
        chatRepo,
        new UseCaseSendChatMessage(),
      ),
      chatRepository: chatRepo,
      applicationJoinGame: new ApplicationJoinGame(
        onlineRepo,
        new UseCaseJoinMatch(),
      ),
      getNextStateUseCase: new ApplicationGetNextState(onlineRepo),
      applicationAnimationInProgressAdd: new ApplicationAnimationInProgressAdd(
        onlineRepo,
      ),
      applicationAnimationInProgressRemove:
        new ApplicationAnimationInProgressRemove(onlineRepo),
      onlineRepository: onlineRepo,
    };
  }, []);

  useEffect(() => {
    void dependencies.chatRepository.connect().catch((error: unknown) => {
      console.error("No se pudo conectar al chat en segundo plano:", error);
    });
  }, [dependencies]);

  return (
    <DependencyContext.Provider value={dependencies}>
      {children}
    </DependencyContext.Provider>
  );
};
