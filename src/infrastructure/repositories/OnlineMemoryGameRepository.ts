import { Card } from "../../core/game/domain/entities/Card";
import type { Game } from "../../core/game/domain/entities/Game";
import { Player } from "../../core/game/domain/entities/Player";
import { StateCard } from "../../core/game/domain/entities/StateCard";
import type { GameRepositoryType } from "../../core/game/repository/GameRepositoryType";
import { SignalRGameHub } from "../signalr/SignalRGameHub";
import { db } from "./GameDatabase";
/**
 * Repositorio online que implementa GameRepository.
 * Extiende la funcionalidad de InMemoryGameRepository integrando
 * las llamadas al hub de SignalR para sincronizar el estado
 * con otros jugadores en tiempo real.
 */

export class OnlineMemoryGameRepository implements GameRepositoryType {
  private listenerStatus: () => void = () => {};
  private listenerVersion: () => void = () => {};

  private hubUrl: string;
  private authToken: string = "";
  private animationsInProgress: string[] = [];
  private connectionStatus: number = 0;
  private hub!: SignalRGameHub;

  PLAYER_ID_KEY = "playerId";
  PLAYER_NAME_KEY = "playerName";

  constructor(hubUrl: string) {
    this.hubUrl = hubUrl;
  }

  getOrCreatePlayerId(): string {
    let id = localStorage.getItem(this.PLAYER_ID_KEY);
    if (!id) {
      id = crypto.randomUUID();
      localStorage.setItem(this.PLAYER_ID_KEY, id);
    }
    return id;
  }

  savePlayerName(name: string) {
    localStorage.setItem(this.PLAYER_NAME_KEY, name);
  }

  getPlayerName(): string {
    return localStorage.getItem(this.PLAYER_NAME_KEY) ?? "";
  }

  // ─── Conexión al hub ───────────────────────────────────────

  /** Conecta al hub y registra los listeners de eventos remotos */
  async connectHub(): Promise<void> {
    if (this.connectionStatus === 1) {
      console.warn("Already connected to the hub. Skipping connect.");
      return;
    }
    // Si no se inyectó el token en esta instancia, recuperarlo de localStorage
    if (!this.authToken) {
      this.authToken = localStorage.getItem("auth-jbearer-token") ?? "";
    }
    this.hub = SignalRGameHub.getInstance(this.hubUrl, this.authToken);
    // Registrar callbacks antes de conectar para no perder mensajes inmediatos

    this.hub.onUpdateStates((games: Game[]) => {
      games.forEach((game) => this.saveStateToQueue(game));
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

  async clearAll(): Promise<void> {
    try {
      if (this.hub) {
        this.hub.offAll();
        void this.hub.disconnect();
      }
    } catch {
      console.log("error");
    }

    // Limpiar base de datos
    await db.games.clear();
    await db.settings.clear();

    // await db.delete(); // Borra la base de datos física del disco
    //await db.open();

    // Limpiar localStorage (solo para auth y flags pequeños)
    localStorage.removeItem("currentVersionGame");
    this.authToken = "";
    this.animationsInProgress = [];

    // Resto de la lógica de limpieza...
  }

  async getLastStateFromQueue(): Promise<Game | undefined> {
    const matchId = await this.getMatchId();
    console.log("Getting last state from queue for matchId:", matchId);
    return await db.getLastState(matchId);
  }

  async goToNextVersionState(): Promise<Game | undefined> {
    if (!this.areAnimationsInProgress()) {
      const versionApplied = await db.getAppliedVersion();

      return this.goToVersionState(versionApplied + 1);
    }
    return undefined;
  }

  async goToVersionState(stateVersion: number): Promise<Game | undefined> {
    const matchId = await this.getMatchId();
    const stored = await db.getGame(matchId, stateVersion);
    console.log("try Going to next version state:", stateVersion);
    if (stored) {
      await db.setAppliedVersion(stored.version);
      return stored;
    } else {
      return undefined;
    }
  }

  // Helper para obtener una versión específica
  async getGameFromVersion(stateVersion: number): Promise<Game | undefined> {
    const matchId = await this.getMatchId();
    const record = await db.getGame(matchId, stateVersion);
    return record;
  }

  async saveStateToQueue(state: Game): Promise<void> {
    const matchId = await this.getMatchId();
    await db.saveGame(matchId, state);
  }

  async processStateFromQueue(): Promise<Game | undefined> {
    if (!this.areAnimationsInProgress()) {
      const version = await db.getAppliedVersion();
      const matchId = await db.getMatchId();

      if (!matchId) {
        throw new Error("Match ID not found");
      }

      const record = await db.getGame(matchId, version + 1);

      if (!record) {
        throw new Error("No state found in queue for version: " + version);
      }

      this.setCurrentVersionGame(record.version);
      return record;
    } else {
      console.log(
        "Cannot process state from queue because animations are in progress:",
        this.animationsInProgress,
      );
      return undefined;
    }
  }

  getConnectionStatus = (): number => this.connectionStatus;

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

  async joinGameToServer(matchId: string): Promise<void> {
    await this.hub.sendJoinGame(matchId);
  }

  async getMatchIdFromServer(gameName: string): Promise<string> {
    return await this.hub.getMatchIdFromServer(gameName);
  }

  async getServerStatesFromVersion(
    matchId: string,
    version: number,
  ): Promise<Game[]> {
    return await this.hub.getServerStatesFromVersion(matchId, version);
  }

  async updateStateToServer(state: Game): Promise<void> {
    const matchId = await this.getMatchId();
    await this.hub.sendUpdateStateGame(state, matchId);
  }

  async addStatesToTheQueue(states: Game[]): Promise<void> {
    const matchId = await this.getMatchId();
    await db.saveGames(matchId, states);
  }

  async addAnimationInProgress(animationId: string): Promise<void> {
    if (!this.animationsInProgress.includes(animationId)) {
      this.animationsInProgress.push(animationId);
      console.log(
        "Added animation:",
        animationId,
        "Total:",
        this.animationsInProgress,
      );
    }
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

  private normalizeCardState(state: unknown): StateCard {
    if (state === StateCard.FaceDown) return StateCard.FaceDown;
    if (state === StateCard.FaceUp) return StateCard.FaceUp;
    if (state === StateCard.Matched) return StateCard.Matched;

    if (typeof state === "string") {
      const normalized = state.toLowerCase();
      if (normalized === "facedown") return StateCard.FaceDown;
      if (normalized === "faceup") return StateCard.FaceUp;
      if (normalized === "matched") return StateCard.Matched;
    }

    return StateCard.FaceDown;
  }

  async setMatchId(matchId: string): Promise<void> {
    await db.setMatchId(matchId);
  }

  async getMatchId(): Promise<string> {
    const matchId = await db.getMatchId();
    if (!matchId) {
      throw new Error("Match ID not found");
    }
    return matchId;
  }

  setAuthToken(token: string): void {
    localStorage.setItem("auth-jbearer-token", token);
    this.authToken = token;
  }

  setPlayerName(user: string): void {
    localStorage.setItem("playerName", user.trim());
  }

  getCurrentVersionGame(): number {
    const stored = localStorage.getItem("currentVersionGame");
    if (stored) {
      return Number(stored);
    } else {
      return 0;
    }
  }

  setCurrentVersionGame(version: number): void {
    localStorage.setItem("currentVersionGame", version.toString());
    this.listenerVersion();
  }
}
