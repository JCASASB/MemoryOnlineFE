import * as signalR from "@microsoft/signalr";
import { Game } from "../../core/game/domain/entities/Game";
import type { ChatMessage } from "../../core/chat/domain/entities/ChatMessage";
import type { Challenge } from "../../core/chat/domain/entities/Challenge";

export class SignalRGameHub implements ApplicationHubPort {
  private static instance: SignalRGameHub | null = null;
  private static instanceKey = "";
  private static hubUrl = "";
  private static tokenJWT = "";

  private connection?: signalR.HubConnection;
  private connectionStatus: number = 0; // 0: Desc, 1: Reconectando, 2: Conectado

  // Listas de suscriptores internos (Multicast)
  private updateStatesListeners: Array<(games: Game[]) => void> = [];
  private chatMessageListeners: Array<(message: ChatMessage) => void> = [];
  private challengeListeners: Array<(challenge: Challenge) => void> = [];
  private statusListeners: Array<(status: number) => void> = [];

  private constructor() {}

  static getInstance(): SignalRGameHub {
    if (!SignalRGameHub.instance) {
      SignalRGameHub.instance = new SignalRGameHub();
    }
    return SignalRGameHub.instance;
  }

  static setCredentials(url: string, token: string): void {
    SignalRGameHub.hubUrl = url;
    SignalRGameHub.tokenJWT = token;
  }

  /**
   * Inicializa la conexión física y se encarga por completo de su ciclo de vida.
   */
  static initializeInstance(): SignalRGameHub {
    const hub = SignalRGameHub.getInstance();
    const nextKey = `${SignalRGameHub.hubUrl}::${SignalRGameHub.tokenJWT}`;

    if (SignalRGameHub.instanceKey !== nextKey) {
      SignalRGameHub.instanceKey = nextKey;
      hub.buildAndConnect();
    }

    return hub;
  }

  private async buildAndConnect(): Promise<void> {
    if (this.connection) {
      try {
        await this.connection.stop();
      } catch {
        /* no-op */
      }
    }

    this.connection = new signalR.HubConnectionBuilder()
      .withUrl(SignalRGameHub.hubUrl, {
        accessTokenFactory: () => SignalRGameHub.tokenJWT,
      })
      .withAutomaticReconnect()
      .configureLogging(signalR.LogLevel.Debug)
      .build();

    this.setupSocketChannels();
    this.setupLifecycleLoggers();

    try {
      await this.connection.start();
      this.updateStatus(2);
      console.log(
        "[SignalR Hub] Conectado inicialmente con ID:",
        this.connection.connectionId,
      );
    } catch (err) {
      this.updateStatus(0);
      console.error("[SignalR Hub] Error crítico en conexión inicial:", err);
    }
  }

  private setupSocketChannels(): void {
    if (!this.connection) return;

    this.connection.on("Error", (message: unknown) => {
      console.error("[SignalR Hub] Server Error:", message);
    });

    this.connection.on("LogFromServer", (message: string) => {
      console.log(`[SignalR Hub] Log: ${message}`);
    });

    // Redirección interna a todos los repositorios/componentes interesados
    this.connection.on("UpdateStatesFromServer", (games: Game[]) => {
      this.updateStatesListeners.forEach((cb) => cb(games));
    });

    this.connection.on("ChatMessageReceived", (payload: ChatMessage) => {
      this.chatMessageListeners.forEach((cb) => cb(payload));
    });

    this.connection.on("ChallengeReceived", (payload: Challenge) => {
      this.challengeListeners.forEach((cb) => cb(payload));
    });
  }

  private setupLifecycleLoggers(): void {
    if (!this.connection) return;

    this.connection.onreconnecting((err) => {
      this.updateStatus(1);
      console.warn("[SignalR Hub] Reconectando de forma automática...", err);
    });
    this.connection.onreconnected((id) => {
      this.updateStatus(2);
      console.log("[SignalR Hub] Reconexión exitosa. ID:", id);
    });
    this.connection.onclose((err) => {
      this.updateStatus(0);
      console.log("[SignalR Hub] Conexión cerrada de forma definitiva", err);
    });
  }

  private updateStatus(newStatus: number): void {
    this.connectionStatus = newStatus;
    this.statusListeners.forEach((cb) => cb(newStatus));
  }

  getStatus(): number {
    return this.connectionStatus;
  }

  async disconnect(): Promise<void> {
    await this.connection?.stop();
    this.updateStatus(0);
  }

  private ensureConnection(): signalR.HubConnection {
    if (!this.connection) {
      throw new Error(
        "[SignalR Hub] Intentaste operar el Hub sin antes haber hecho Login / Inicializado.",
      );
    }
    return this.connection;
  }

  // ==========================================
  // INVOCACIONES PASIVAS (Para los Repositorios)
  // ==========================================

  async sendUpdateStateGame(game: Game, matchId: string): Promise<void> {
    await this.ensureConnection().invoke("UpdateGameState", game, matchId);
  }

  async sendCreateGame(game: Game): Promise<void> {
    await this.ensureConnection().invoke("CreateGame", game);
  }

  async sendJoinGame(matchId: string): Promise<void> {
    await this.ensureConnection().invoke("JoinGame", matchId);
  }

  async getMatchIdFromServer(gameName: string): Promise<string | undefined> {
    return await this.ensureConnection().invoke("GetMatchIdFromName", gameName);
  }

  async getServerStatesFromVersion(
    matchId: string,
    version: number,
  ): Promise<Game[] | undefined> {
    return await this.ensureConnection().invoke(
      "GetStatesFromVersion",
      matchId,
      version,
    );
  }

  async sendChatMessage(message: ChatMessage): Promise<void> {
    try {
      await this.ensureConnection().invoke("SendChatMessage", {
        playerName: message.playerName,
        playerId: message.playerId,
        message: message.message,
        sentAtUtc: message.sentAtUtc,
      });
    } catch (error) {
      console.error("Failed to send chat message:", error);
    }
  }

  async createChallengeToServer(challenge: Challenge): Promise<void> {
    await this.ensureConnection().invoke("CreateChallenge", challenge);
  }

  // ==========================================
  // SUSCRIPCIONES MULTICAST (Cualquiera se acopla/desacopla)
  // ==========================================

  registerUpdateStatesCallback(callback: (games: Game[]) => void): () => void {
    this.updateStatesListeners.push(callback);
    return () => {
      this.updateStatesListeners = this.updateStatesListeners.filter(
        (cb) => cb !== callback,
      );
    };
  }

  registerChallengeReceivedCallback(
    callback: (challenge: Challenge) => void,
  ): () => void {
    this.challengeListeners.push(callback);
    return () => {
      this.challengeListeners = this.challengeListeners.filter(
        (cb) => cb !== callback,
      );
    };
  }

  registerStatusChangedCallback(
    callback: (status: number) => void,
  ): () => void {
    this.statusListeners.push(callback);
    return () => {
      this.statusListeners = this.statusListeners.filter(
        (cb) => cb !== callback,
      );
    };
  }

  registerChatMessagesReceivedCallback(
    callback: (message: ChatMessage) => void,
  ): () => void {
    this.chatMessageListeners.push(callback);
    return () => {
      this.chatMessageListeners = this.chatMessageListeners.filter(
        (cb) => cb !== callback,
      );
    };
  }

  offAll(): void {
    this.updateStatesListeners = [];
    this.chatMessageListeners = [];
    this.challengeListeners = [];
    this.statusListeners = [];
  }
}
