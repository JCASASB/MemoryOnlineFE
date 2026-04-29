import Dexie, { type Table } from "dexie";
import type { Game } from "../../core/game/domain/entities/Game";

export class GameDatabase extends Dexie {
  // Cambiamos a 'any' o a una interfaz que acepte tu nueva estructura
  games!: Table<any, [string, number]>;

  constructor() {
    super("GameDatabase");
    this.version(2).stores({
      games: "[idMatch+version], idMatch",
    });
  }

  async saveGame(idMatch: string, game: Game): Promise<void> {
    try {
      // Usamos 'put' con la estructura que definiste
      await this.games.put({
        idMatch: idMatch,
        version: game.version,
        // Guardamos el objeto Game original aquí
        stateBoard: game,
      });
    } catch (error) {
      console.error("Error al guardar en IndexedDB:", error);
      throw error;
    }
  }

  // IMPORTANTE: Para recuperar el juego luego
  async getGame(idMatch: string, version: number): Promise<Game | undefined> {
    const record = await this.games.get([idMatch, version]);
    return record?.stateBoard; // Retornamos solo el objeto Game
  }

  /**
   * Obtiene el estado con la versión más alta para un idMatch específico.
   */
  async getLastState(idMatch: string): Promise<Game | undefined> {
    try {
      // 1. Buscamos en el índice 'idMatch'
      // 2. Ordenamos en reversa (la versión más alta primero)
      // 3. Tomamos el primer registro
      const lastRecord = await this.games
        .where("idMatch")
        .equals(idMatch)
        .reverse()
        .sortBy("version")
        .then((results) => results[0]);

      if (!lastRecord) return undefined;

      // Si usas la estructura del mensaje anterior, devolvemos 'stateBoard'
      // Si guardas el Game directamente, devuelves 'lastRecord'
      return lastRecord.stateBoard || lastRecord;
    } catch (error) {
      console.error("Error al obtener el último estado:", error);
      return undefined;
    }
  }
}

export const db = new GameDatabase();
