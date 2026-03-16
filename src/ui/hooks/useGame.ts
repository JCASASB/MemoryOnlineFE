import { useCallback, useEffect, useState, useSyncExternalStore } from "react";
import { useDependencies } from "../context/useDependencies";
import { Game } from "../../core/domain/entities/Game";
import type { GameState } from "../../core/domain/entities/GameState";
/**
 * Hook unificado para el juego (offline y online).
 * - Si existe onlineRepository y se pasa gameName, conecta/desconecta al hub.
 * - Los use cases (FlipCard, StartGame) son siempre los mismos;
 *   la diferencia está en la implementación del repositorio inyectado.
 */
export const useGame = () => {
  const [stateGame, setStateGame] = useState<GameState>(new Game("", 0, ""));

  const {
    repository,
    flipCardUseCase,
    createGameUseCase,
    joinGameUseCase,
    getUpdatedStateUseCase,
  } = useDependencies();

  // useSyncExternalStore se suscribe a los cambios del repositorio
  const versionChange = useSyncExternalStore(repository.subscribe, () =>
    repository.getVersion(),
  );

  // Cuando cambia la versión, llama a UseCaseUpdateStateFromServer
  useEffect(() => {
    const updateState = async () => {
      if ((repository as any).getVersion && versionChange > 0) {
        // Solo si existe el método y la versión es mayor a 0
        // Llama al caso de uso para actualizar desde el servidor
        // Suponiendo que tienes acceso a UseCaseUpdateStateFromServer
        // y que espera el estado actual
        // new UseCaseUpdateStateFromServer(repository).execute(repository.getState());
        // Si tienes el caso de uso en dependencias, úsalo así:
        const state = await getUpdatedStateUseCase.execute();
        setStateGame(state);
      }
    };
    updateState();
  }, [versionChange, repository]);

  return {
    stateGame: stateGame,
    flipCardUC: useCallback(
      (id: string, playerId: string) => flipCardUseCase.execute(id, playerId),
      [flipCardUseCase],
    ),
    createGameUC: useCallback(
      async (level: number, gameName: string, playerName: string) => {
        const newState = await createGameUseCase.execute(
          level,
          gameName,
          playerName,
        );
        setStateGame(newState);
      },
      [createGameUseCase],
    ),
    joinGameUC: useCallback(
      async (gameName: string, playerName: string) =>
        await joinGameUseCase.execute(gameName, playerName),
      [joinGameUseCase],
    ),
  };
};
