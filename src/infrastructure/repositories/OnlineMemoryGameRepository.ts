import type { GameRepository } from "../../core/domain/repositories/GameRepository";
import { SignalRGameHub } from "../signalr/SignalRGameHub";
import type { GameState } from "../../core/domain/entities/GameState";
// Card type not required here; state stored as plain objects

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

  constructor(hubUrl: string) {
    this.hub = new SignalRGameHub(hubUrl);
  }

  // ─── Conexión al hub ───────────────────────────────────────

  /** Conecta al hub y registra los listeners de eventos remotos */
  async connectHub(): Promise<void> {
    // Registrar callbacks antes de conectar para no perder mensajes inmediatos
    this.hub.onRemoteGameStateUpdated((gameStateJson: string) => {
      const reconstructed = this.convertJsonGameStateToObject(gameStateJson);

      this.save(reconstructed);
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
      return state as GameState;
      //  return this.normalizeState(state);
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

  convertJsonGameStateToObject(jsonString: string): GameState {
    const parsed = JSON.parse(jsonString);
    // Aquí podrías agregar lógica adicional para convertir a clases específicas si es necesario
    return parsed as GameState;
  }
}
