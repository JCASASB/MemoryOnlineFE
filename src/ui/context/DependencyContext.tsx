import React, { useMemo } from "react";
import { DependencyContext } from "./DependencyContextInstance";
import type { MemoryContextType } from "./DependencyContextInstance";
import { OnlineMemoryGameRepository } from "../../infrastructure/repositories/OnlineMemoryGameRepository";
import { UseCaseFlipCard } from "../../core/application/UseCaseFlipCard";
import { UseCaseJoinGame } from "../../core/application/UseCaseJoinGame";
import { UseCaseCreateGame } from "../../core/application/UseCaseCreateGame";
import { UseCaseGetUpdatedState } from "../../core/application/UseCaseGetUpdatedState";

const SIGNALR_HUB_URL =
  import.meta.env.VITE_SIGNALR_HUB_URL || "http://localhost:5000/gamehub";

interface Props {
  children: React.ReactNode;
  online?: boolean;
}

export const DependencyProvider = ({ children }: Props) => {
  const dependencies = useMemo<MemoryContextType>(() => {
    const onlineRepo = new OnlineMemoryGameRepository(SIGNALR_HUB_URL);
    return {
      repository: onlineRepo,
      flipCardUseCase: new UseCaseFlipCard(onlineRepo),
      createGameUseCase: new UseCaseCreateGame(onlineRepo),
      joinGameUseCase: new UseCaseJoinGame(onlineRepo),
      getUpdatedStateUseCase: new UseCaseGetUpdatedState(onlineRepo),
      onlineRepository: onlineRepo,
    };
  }, []);

  return (
    <DependencyContext.Provider value={dependencies}>
      {children}
    </DependencyContext.Provider>
  );
};
