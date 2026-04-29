import { useEffect, useRef, useState } from "react";
import { useDependencies } from "../context/useDependencies";
import { Game } from "../../core/game/domain/entities/Game";

export const useGameState = () => {
  const [stateGame, setStateGame] = useState<Game>(new Game("", "", 0, 0));
  const { getNextStateUseCase } = useDependencies();

  // 1. Tipamos el useRef correctamente para que acepte Worker o null
  const workerRef = useRef<Worker | null>(null);

  useEffect(() => {
    // 2. Usamos el objeto de configuración { type: "module" }
    workerRef.current = new Worker(new URL("./dbWorker.ts", import.meta.url), {
      type: "module",
    });

    const worker = workerRef.current; // Referencia local para evitar problemas de nulidad

    // 3. Tipamos el evento como MessageEvent
    worker.onmessage = async (event: MessageEvent) => {
      if (event.data.type === "UPDATE_READY") {
        const state = await getNextStateUseCase.execute();
        if (state) {
          setStateGame(state);
        }
      }
    };

    worker.postMessage("start");

    return () => {
      // 4. Usamos la referencia local para terminar el worker
      worker.terminate();
    };
  }, [getNextStateUseCase]);

  return {
    stateGame: stateGame,
  };
};
