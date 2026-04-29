import { useEffect, useRef, useState } from "react";
import { useDependencies } from "../context/useDependencies";
import { Game } from "../../core/game/domain/entities/Game";

/**
 * Hook unificado para el juego (offline y online).
 */
export const useGameState = () => {
  const [stateGame, setStateGame] = useState<Game>(new Game("", "", 0, 0));

  const { getNextStateUseCase } = useDependencies();

  const workerRef = useRef(null);

  useEffect(() => {
    // Instanciar el worker usando la sintaxis de URL de módulo (compatible con Vite/Webpack 5)
    workerRef.current = new Worker(new URL("./dbWorker.js", import.meta.url), {
      type: "module",
    });

    // Escuchar mensajes del worker
    workerRef.current.onmessage = async (event) => {
      if (event.data.type === "UPDATE_READY") {
        console.log("Notificación del worker:", event.data.payload);
        // Aquí disparas la actualización de tu estado de React

        const state = await getNextStateUseCase.execute();
        if (state) {
          // console.log(`Estado actualizado desde el contador:  `, state);
          setStateGame(state);
        }
      }
    };

    // Iniciar el proceso
    workerRef.current.postMessage("start");

    // Limpieza al desmontar el componente
    return () => {
      workerRef.current.terminate();
    };
  }, []);

  return {
    stateGame: stateGame,
  };
};
