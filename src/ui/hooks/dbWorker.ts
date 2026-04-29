import { GameDatabase } from "../../infrastructure/repositories/GameDatabase";

const db = new GameDatabase();

self.onmessage = (e) => {
  if (e.data === "start") {
    // Usamos un intervalo, pero Dexie es asíncrono (promesas)
    setInterval(async () => {
      try {
        // 1. Obtenemos la última versión guardada (ejemplo: la más alta)
        const lastGame = await db.games.orderBy("version").last();

        if (lastGame) {
          // 2. Si existe un juego, notificamos al hilo principal
          self.postMessage({
            type: "UPDATE_READY",
            payload: `Versión ${lastGame.version} encontrada en DB`,
          });
        }
      } catch (error) {
        console.error("Error leyendo IndexedDB desde el worker:", error);
      }
    }, 300);
  }
};
