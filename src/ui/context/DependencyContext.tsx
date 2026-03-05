
import React, { useMemo } from 'react';
import { DependencyContext } from './DependencyContextInstance';
import type { MemoryContextType } from './DependencyContextInstance';
import { InMemoryGameRepository } from '../../infrastructure/repositories/InMemoryGameRepository';
import { OnlineMemoryGameRepository } from '../../infrastructure/repositories/OnlineMemoryGameRepository';
import { FlipCardUseCase } from '../../core/application/FlipCard';
import { StartGameUseCase } from '../../core/application/StartGame';
import { SignalRGameHub } from '../../infrastructure/signalr/SignalRGameHub';

const SIGNALR_HUB_URL = import.meta.env.VITE_SIGNALR_HUB_URL || 'http://localhost:5000/gamehub';

interface Props {
  children: React.ReactNode;
  online?: boolean;
}

export const DependencyProvider = ({ children, online = false }: Props) => {
  const dependencies = useMemo<MemoryContextType>(() => {
    if (online) {
      const hub = new SignalRGameHub(SIGNALR_HUB_URL);
      const onlineRepo = new OnlineMemoryGameRepository(hub);
      return {
        repository: onlineRepo,
        flipCardUseCase: new FlipCardUseCase(onlineRepo),
        startGameUseCase: new StartGameUseCase(onlineRepo),
        onlineRepository: onlineRepo,
      };
    }

    const repo = new InMemoryGameRepository();
    return {
      repository: repo,
      flipCardUseCase: new FlipCardUseCase(repo),
      startGameUseCase: new StartGameUseCase(repo),
    };
  }, [online]);

  return (
    <DependencyContext.Provider value={dependencies}>{children}</DependencyContext.Provider>
  );
};

