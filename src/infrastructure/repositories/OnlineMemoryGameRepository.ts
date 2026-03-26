import type { Game } from "../../core/domain/entities/Game";
import type { GameRepository } from "../../core/domain/repositories/GameRepository";
import { SignalRGameHub } from "../signalr/SignalRGameHub";

/**
 * Repositorio online que implementa GameRepository.
 * Extiende la funcionalidad de InMemoryGameRepository integrando
 * las llamadas al hub de SignalR para sincronizar el estado
 * con otros jugadores en tiempo real.
 */
export class OnlineMemoryGameRepository implements GameRepository {
  private listeners: Set<() => void> = new Set();
  private version: number = 0;
  private connectionStatus: number = 0;
  private hub: SignalRGameHub;

  constructor(hubUrl: string) {
    this.hub = new SignalRGameHub(hubUrl);
  }

  // ─── Conexión al hub ───────────────────────────────────────

  /** Conecta al hub y registra los listeners de eventos remotos */
  async connectHub(): Promise<void> {
    // Registrar callbacks antes de conectar para no perder mensajes inmediatos
    this.hub.onRemoteGameUpdated((GameJson: string) => {
      const reconstructed = this.convertJsonGameToObject(GameJson);

      this.save(reconstructed);
    });

    this.hub.setConnectionStatus((status: number) => {
      console.log("Connection status changed:", status);
      this.connectionStatus = status;
      // Notify subscribers so UI can react to connection status changes
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

  getState = (): Game => {
    const stored = localStorage.getItem("memory-game-state");
    if (stored) {
      const state = JSON.parse(stored);
      return state as Game;
      //  return this.normalizeState(state);
    } else {
      return {} as Game;
    }
  };

  getVersion = (): number => this.version;
  getConnectionStatus = (): number => this.connectionStatus;

  save(state: Game): void {
    localStorage.setItem("memory-game-state", JSON.stringify(state));
    this.version++;
    this.listeners.forEach((l) => l());
  }

  subscribe = (listener: () => void): (() => void) => {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  };

  // ─── Acciones online (envío al hub) ────────────────────────
  async createGameToServer(state: Game): Promise<void> {
    await this.hub.sendCreateGame(state);
  }

  async joinGameToServer(gameName: string, playerName: string): Promise<void> {
    await this.hub.sendJoinGame(gameName, playerName);
  }

  async updateStateToServer(state: Game): Promise<void> {
    await this.hub.sendUpdateStateGame(state);
  }

  convertJsonGameToObject(jsonString: string): Game {
    const parsed = JSON.parse(jsonString);

    return parsed as Game;
  }
}
