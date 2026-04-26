import { Card } from "../../core/game/domain/entities/Card";
import type { Game } from "../../core/game/domain/entities/Game";
import { Player } from "../../core/game/domain/entities/Player";
import { StateCard } from "../../core/game/domain/entities/StateCard";
import type { GameRepositoryType } from "../../core/game/repository/GameRepositoryType";
import { SignalRGameHub } from "../signalr/SignalRGameHub";

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
  private version: number = 0;
  private matchId: string = "";
  private animationsInProgress: string[] = [];
  private connectionStatus: number = 0;
  private hub!: SignalRGameHub;

  constructor(hubUrl: string) {
    this.hubUrl = hubUrl;
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
      games.forEach((game) => this.save(game));
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

  clearAll(): void {
    try {
      if (this.hub) {
        this.hub.offAll();
        void this.hub.disconnect();
      }
    } catch {
      // ignore disconnect errors on cleanup
    }

    this.authToken = "";
    this.version = 0;
    this.matchId = "";
    this.animationsInProgress = [];
    this.connectionStatus = 0;
    this.listenerVersion = () => {};
    this.listenerStatus = () => {};

    const keysToKeep = new Set(["playerId"]);
    const keysToDelete: string[] = [];

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (!key) continue;
      const isVersionStateKey = /^\d+$/.test(key);
      const isSessionKey =
        key === "auth-jbearer-token" ||
        key === "playerName" ||
        isVersionStateKey;

      if (isSessionKey && !keysToKeep.has(key)) {
        keysToDelete.push(key);
      }
    }

    keysToDelete.forEach((key) => localStorage.removeItem(key));
  }

  getState = (): Game | undefined => {
    const stored = localStorage.getItem(this.version.toString());
    if (stored) {
      return this.normalizeGame(JSON.parse(stored));
    } else {
      return undefined;
    }
  };

  getLastStateFromQueue(): Game {
    const baseState = this.justGetVersionState(this.version);

    if (!baseState) {
      throw new Error(
        `No state found for current version ${this.version}. Cannot resolve last state.`,
      );
    }

    const lastState = this.findLastExistingState(baseState.version, baseState);

    return lastState;
  }

  private findLastExistingState(version: number, lastKnownState: Game): Game {
    const nextState = this.justGetVersionState(version + 1);
    if (!nextState) {
      return lastKnownState;
    }

    return this.findLastExistingState(nextState.version, nextState);
  }

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

  getVersion = (): number => this.version;

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
    await this.hub.sendUpdateStateGame(state, this.matchId);
  }

  convertJsonGameToObject(jsonString: string): Game {
    const parsed = JSON.parse(jsonString);
    return this.normalizeGame(parsed);
  }

  convertJsonGamesToObject(payload: unknown): Game[] {
    if (payload === null || payload === undefined) {
      return [];
    }

    try {
      const parsed =
        typeof payload === "string"
          ? payload.trim().length === 0
            ? []
            : JSON.parse(payload)
          : payload;
      const rawGames = Array.isArray(parsed)
        ? parsed
        : Array.isArray(parsed?.games)
          ? parsed.games
          : [];
      return rawGames.map((g: unknown) => this.normalizeGame(g));
    } catch (error) {
      console.warn("Invalid games JSON payload received from server:", error);
      return [];
    }
  }

  async addStatesToTheQueue(states: Game[]): Promise<void> {
    states.forEach((state) => {
      localStorage.setItem(state.version.toString(), JSON.stringify(state));
    });
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

  setMatchId(matchId: string): void {
    this.matchId = matchId;
  }

  setAuthToken(token: string): void {
    localStorage.setItem("auth-jbearer-token", token);
    this.authToken = token;
  }

  setPlayerName(user: string): void {
    localStorage.setItem("playerName", user.trim());
  }

  private normalizeGame(parsed: unknown): Game {
    const gameData = parsed as {
      id: string;
      name: string;
      level: number;
      version?: number;
      cards?: Array<{
        id: string;
        value: number;
        imgUrl: string;
        state: unknown;
      }>;
      players?: Array<{
        id: string;
        name: string;
        order: number;
        remainMoves: number;
        totalMoves: number;
        points: number;
        turn: boolean;
      }>;
    };

    const cards: Card[] = (gameData.cards ?? []).map(
      (c) =>
        new Card(
          c.id,
          Number(c.value),
          c.imgUrl,
          this.normalizeCardState(c.state),
        ),
    );
    const players: Player[] = (gameData.players ?? []).map(
      (p) =>
        new Player(
          p.id,
          p.name,
          Number(p.order),
          Number(p.remainMoves),
          Number(p.totalMoves),
          Number(p.points),
          Boolean(p.turn),
        ),
    );
    return {
      id: gameData.id,
      name: gameData.name,
      level: Number(gameData.level),
      version: Number(gameData.version ?? 0),
      cards,
      players,
    } as Game;
  }
}
