import { useEffect, useState } from "react";
import { useDependencies } from "../context/useDependencies";
import { Game } from "../../core/domain/entities/Game";

/**
 * Hook unificado para el juego (offline y online).
 */
export const useGameState = () => {
  const [stateGame, setStateGame] = useState<Game>(new Game("", "", 0, 0));

  const { getNextStateUseCase } = useDependencies();

  useEffect(() => {
    // 1. Definir el intervalo
    const intervalId = setInterval(async () => {
      const state = await getNextStateUseCase.execute();
      if (state) {
        // console.log(`Estado actualizado desde el contador:  `, state);
        setStateGame(state);
      } else {
        // console.warn("No se pudo obtener el estado actualizado del contador.");
      }
    }, 100); // 5000 milisegundos

    // 2. Limpiar el intervalo al desmontar el componente
    return () => clearInterval(intervalId);
  }, []); // El array vacío [] asegura que solo se ejecute al montar
  /*
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
 */
  return {
    stateGame: stateGame,
  };
};
