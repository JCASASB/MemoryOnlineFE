import { useEffect, useState } from "react";
import { useDependencies } from "../context/useDependencies";
import { Game } from "../../core/game/domain/entities/Game";

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
    }, 300); // 5000 milisegundos

    // 2. Limpiar el intervalo al desmontar el componente
    return () => clearInterval(intervalId);
  }, []); // El array vacío [] asegura que solo se ejecute al montar

  return {
    stateGame: stateGame,
  };
};
