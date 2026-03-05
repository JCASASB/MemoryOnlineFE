import { useCallback, useEffect, useSyncExternalStore } from 'react';
import { useDependencies } from '../context/useDependencies';

/**
 * Hook unificado para el juego (offline y online).
 * - Si existe onlineRepository y se pasa gameId, conecta/desconecta al hub.
 * - Los use cases (FlipCard, StartGame) son siempre los mismos;
 *   la diferencia está en la implementación del repositorio inyectado.
 */
export const useGame = (gameId?: string) => {
  const { repository, flipCardUseCase, startGameUseCase, onlineRepository } = useDependencies();

  const state = useSyncExternalStore(repository.subscribe, repository.getState);
  const cards = state.cards ? state.cards : [];

  // Si estamos en modo online, conectar/desconectar al hub
  useEffect(() => {
    if (!onlineRepository || !gameId) return;

    onlineRepository.connect(gameId).catch(console.error);
    return () => {
      onlineRepository.disconnect().catch(console.error);
    };
  }, [gameId, onlineRepository]);

  const flip = useCallback(
    (id: string) => flipCardUseCase.execute(id),
    [flipCardUseCase]
  );

  const startGame = useCallback(
    (level: number) => startGameUseCase.execute(level),
    [startGameUseCase]
  );

  return {
    ...state,
    cards,
    flip,
    startGame,
  };
};
