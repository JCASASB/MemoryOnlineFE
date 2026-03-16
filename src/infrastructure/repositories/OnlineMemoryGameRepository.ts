import type { GameRepository } from "../../core/domain/repositories/GameRepository";
import { SignalRGameHub } from "../signalr/SignalRGameHub";
import type { GameState } from "../../core/domain/entities/GameState";

/**
 * Repositorio online que implementa GameRepository.
 * Extiende la funcionalidad de InMemoryGameRepository integrando
 * las llamadas al hub de SignalR para sincronizar el estado
 * con otros jugadores en tiempo real.
 */
export class OnlineMemoryGameRepository implements GameRepository {
  private listeners: Set<() => void> = new Set();
  private version: number = 0;
  private hub: SignalRGameHub;

  constructor(hubOrUrl: string | SignalRGameHub) {
    if (typeof hubOrUrl === "string") {
      this.hub = new SignalRGameHub(hubOrUrl);
    } else {
      this.hub = hubOrUrl;
    }
  }

  // ─── Conexión al hub ───────────────────────────────────────

  /** Conecta al hub y registra los listeners de eventos remotos */
  async connect(): Promise<void> {
    // Registrar callbacks antes de conectar para no perder mensajes inmediatos
    this.hub.onRemoteGameStateUpdated((gameState: GameState) => {
      console.log(
        `this.hub.onRemoteGameStateUpdated con ${JSON.stringify(gameState, null, 2)}`,
      );
      this.save(gameState);
      this.listeners.forEach((l) => l());
    });

    // Iniciar la conexión
    await this.hub.connect();
  }

  /** Desconecta del hub y limpia los listeners */
  async disconnect(): Promise<void> {
    this.hub.offAll();
    await this.hub.disconnect();
  }

  getState = (): GameState => {
    const stored = localStorage.getItem("memory-game-state");
    if (stored) {
      const state = JSON.parse(stored);
      return state;
    } else {
      return {} as GameState;
    }
  };

  getVersion = (): number => this.version;

  save(state: GameState): void {
    localStorage.setItem("memory-game-state", JSON.stringify(state));
    this.version++;
    this.listeners.forEach((l) => l());
  }

  subscribe = (listener: () => void): (() => void) => {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  };

  // Permite a useGame leer la versión para forzar actualización si es necesario
  // (ya definido arriba)

  // ─── Acciones online (envío al hub) ────────────────────────

  /** Implementa CreateGame de GameRepository */
  async createGameToServer(state: GameState): Promise<void> {
    await this.hub.sendCreateGame(state);
  }

  async joinGameToServer(gameId: string, playerName: string): Promise<void> {
    await this.hub.sendJoinGame(gameId, playerName);
  }

  async updateStateToServer(state: GameState): Promise<void> {
    await this.hub.sendUpdateStateGame(state);
  }
}
