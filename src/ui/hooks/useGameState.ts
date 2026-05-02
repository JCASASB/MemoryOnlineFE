import { useEffect, useRef, useState } from "react";
import { useDependencies } from "../context/useDependencies";
import { Game } from "../../core/game/domain/entities/Game";

/**
 * Hook unificado para el juego (offline y online).
 */
export const useGameState = () => {
  const [stateGame, setStateGame] = useState<Game>(new Game("", "", 0, 0));

  const { getNextStateUseCase, getLastAppliedStateUseCase } = useDependencies();

  // 1. Tipamos el Ref correctamente para que acepte Worker o null
  const workerRef = useRef<Worker | null>(null);

  // Carga el último estado persistido al montar
  useEffect(() => {
    getLastAppliedStateUseCase.execute().then((lastState) => {
      if (lastState) {
        setStateGame(lastState);
      }
    });
  }, [getLastAppliedStateUseCase]);

  useEffect(() => {
    // 2. Creamos la instancia en una variable local para asegurar que no sea null ante TS
    const workerInstance = new Worker(
      new URL("./dbWorker.js", import.meta.url),
      { type: "module" },
    );

    workerRef.current = workerInstance;

    // 3. Tipamos el evento como MessageEvent para evitar el error de 'any'
    workerInstance.onmessage = async (event: MessageEvent) => {
      if (event.data.type === "UPDATE_READY") {
        console.log("Notificación del worker:", event.data.payload);

        const state = await getNextStateUseCase.execute();
        if (state) {
          console.log(`Estado actualizado desde el contador: `, state);
          setStateGame(state);
        }
      }
    };

    // 4. Usamos la instancia local para enviar el mensaje inicial
    workerInstance.postMessage("start");

    // Limpieza al desmontar el componente
    return () => {
      workerInstance.terminate();
      workerRef.current = null;
    };
  }, [getNextStateUseCase]); // Añadida dependencia para consistencia

  return {
    stateGame: stateGame,
  };
};
