import React, { useMemo } from "react";
import { DependencyContext } from "./DependencyContextInstance";
import type { MemoryContextType } from "./DependencyContextInstance";
import { OnlineMemoryGameRepository } from "../../infrastructure/repositories/OnlineMemoryGameRepository";
import { UseCaseGetUpdatedState } from "../../core/application/UseCaseGetUpdatedState";
import { UseCaseCreateGame } from "../../core/domain/useCases/UseCaseCreateGame";
import { ApplicationCreateGame } from "../../core/application/ApplicationCreateGame";
import { ApplicationFlipCard } from "../../core/application/ApplicationFlipCard";
import { UseCaseFlipCard } from "../../core/domain/useCases/UseCaseFlipCard";
import { ApplicationJoinGame } from "../../core/application/ApplicationJoinGame";

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
      applicationFlipCard: new ApplicationFlipCard(
        onlineRepo,
        new UseCaseFlipCard(),
      ),
      applicationCreateGame: new ApplicationCreateGame(
        onlineRepo,
        new UseCaseCreateGame(),
      ),
      applicationJoinGame: new ApplicationJoinGame(onlineRepo),
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
