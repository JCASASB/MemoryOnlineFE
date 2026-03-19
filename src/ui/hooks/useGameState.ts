import { useEffect, useState, useSyncExternalStore } from "react";
import { useDependencies } from "../context/useDependencies";
import { Game } from "../../core/domain/entities/Game";
/**
 * Hook unificado para el juego (offline y online).
 * - Si existe onlineRepository y se pasa gameName, conecta/desconecta al hub.
 * - Los use cases (FlipCard, StartGame) son siempre los mismos;
 *   la diferencia está en la implementación del repositorio inyectado.
 */
export const useGameState = () => {
  const [stateGame, setStateGame] = useState<Game>(new Game("", "", 0));

  const { getUpdatedStateUseCase, onlineRepository } = useDependencies();

  // useSyncExternalStore se suscribe a los cambios del repositorio
  const versionChange = useSyncExternalStore(onlineRepository.subscribe, () =>
    onlineRepository.getVersion(),
  );

  // Cuando cambia la versión, llama a UseCaseUpdateStateFromServer
  useEffect(() => {
    const updateState = async () => {
      if ((onlineRepository as any).getVersion && versionChange > 0) {
        // Solo si existe el método y la versión es mayor a 0
        // Llama al caso de uso para actualizar desde el servidor
        // Suponiendo que tienes acceso a UseCaseUpdateStateFromServer
        // y que espera el estado actual
        // new UseCaseUpdateStateFromServer(onlineRepository).execute(onlineRepository.getState());
        // Si tienes el caso de uso en dependencias, úsalo así:
        const state = await getUpdatedStateUseCase.execute();
        setStateGame(state);
      }
    };
    updateState();
  }, [versionChange]);

  return {
    stateGame: stateGame,
  };
};
