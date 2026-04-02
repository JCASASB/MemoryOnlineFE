import { Card } from "../../core/domain/entities/Card";
import type { Game } from "../../core/domain/entities/Game";
import { Player } from "../../core/domain/entities/Player";
import { StateCard } from "../../core/domain/entities/StateCard";
import type { GameRepository } from "../../core/domain/repositories/GameRepository";
import { SignalRGameHub } from "../signalr/SignalRGameHub";

/**
 * Repositorio online que implementa GameRepository.
 * Extiende la funcionalidad de InMemoryGameRepository integrando
 * las llamadas al hub de SignalR para sincronizar el estado
 * con otros jugadores en tiempo real.
 */
export class OnlineMemoryGameRepository implements GameRepository {
  private listenerStatus: () => void = () => {};
  private listenerVersion: () => void = () => {};

  private version: number = 0;
  private animationsInProgress: string[] = [];
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

    this.hub.onSetInitialState((GameJson: string) => {
      const reconstructed = this.convertJsonGameToObject(GameJson);
      this.version = reconstructed.version - 1; // Asegurar que la versión local se sincronice con el estado inicial
      this.save(reconstructed);
    });

    this.hub.setConnectionStatus((status: number) => {
      console.log("Connection status changed:", status);
      this.connectionStatus = status;
      // Notify subscribers so UI can react to connection status changes
      this.listenerStatus();
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
    const stored = localStorage.getItem(this.version.toString());
    if (stored) {
      return this.normalizeGame(JSON.parse(stored));
    } else {
      throw new Error(`No state found for version ${this.version}`);
    }
  };

  goToVersionState(stateVersion: number): Game | undefined {
    const stored = localStorage.getItem(stateVersion.toString());
    console.log("try Going to next version state:", stateVersion);
    if (stored) {
      const versionGame = this.normalizeGame(JSON.parse(stored));
      this.version = versionGame.version;
      this.listenerVersion();
      return versionGame;
    } else {
      return undefined;
    }
  }

  justGetVersionState(stateVersion: number): Game | undefined {
    const stored = localStorage.getItem(stateVersion.toString());
    console.log("try Going to next version state:", stateVersion);
    if (stored) {
      const versionGame = this.normalizeGame(JSON.parse(stored));
      return versionGame;
    } else {
      return undefined;
    }
  }

  goToNextVersionState(): Game | undefined {
    if (!this.areAnimationsInProgress()) {
      return this.goToVersionState(this.version + 1);
    }
    return undefined;
  }

  getVersion = (): number => this.version;

  getConnectionStatus = (): number => this.connectionStatus;

  save(state: Game): void {
    console.log("Saving state to localStorage with version:", state.version);
    localStorage.setItem(state.version.toString(), JSON.stringify(state));
    if (!this.areAnimationsInProgress()) {
      //this.goToNextVersionState();
    } else {
      console.log(
        "State saved but animations are in progress. Version update deferred.",
        this.animationsInProgress,
      );
    }
  }

  subscribeToVersion = (callback: () => void): (() => void) => {
    this.listenerVersion = callback;
    return () => {
      this.listenerVersion = () => {};
    };
  };

  subscribeToStatus = (callback: () => void): (() => void) => {
    this.listenerStatus = callback;
    return () => {
      this.listenerStatus = () => {};
    };
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
    return this.normalizeGame(parsed);
  }

  async addAnimationInProgress(animationId: string): Promise<void> {
    this.animationsInProgress.push(animationId);
  }

  async removeAnimationInProgress(animationIds: string[]): Promise<void> {
    this.animationsInProgress = this.animationsInProgress.filter(
      (id) => !animationIds.includes(id),
    );
    console.log(
      "Removed animations:",
      animationIds,
      "Remaining animations:",
      this.animationsInProgress,
    );
  }

  areAnimationsInProgress(): boolean {
    return this.animationsInProgress.length > 0;
  }

  private normalizeGame(parsed: any): Game {
    const cards: Card[] = (parsed.cards ?? []).map(
      (c: any) =>
        new Card(c.id, Number(c.value), c.imgUrl, c.state as StateCard),
    );
    const players: Player[] = (parsed.players ?? []).map(
      (p: any) =>
        new Player(
          p.id,
          p.name,
          Number(p.remainMoves),
          Number(p.totalMoves),
          Number(p.points),
          Boolean(p.turn),
        ),
    );
    return {
      id: parsed.id,
      name: parsed.name,
      level: Number(parsed.level),
      version: Number(parsed.version ?? 0),
      cards,
      players,
    } as Game;
  }
}
