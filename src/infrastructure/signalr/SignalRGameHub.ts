import * as signalR from "@microsoft/signalr";
import type { GameHubPort } from "../../core/domain/ports/GameHubPort";
import { Game } from "../../core/domain/entities/Game";

export class SignalRGameHub implements GameHubPort {
  private connection: signalR.HubConnection;
  // gameName is unused currently; keep if needed later

  // Handlers para evitar el error de "método no encontrado"
  private onGameUpdatedCallback?: (gameJson: string) => void;
  private onCardFlippedCallback?: (cardId: string) => void;
  private setConnectionStatusCallback?: (status: number) => void;

  constructor(hubUrl: string) {
    this.connection = new signalR.HubConnectionBuilder()
      .withUrl(hubUrl)
      .withAutomaticReconnect()
      .configureLogging(signalR.LogLevel.Debug)
      .build();

    // 1. REGISTRO TEMPRANO: Escuchamos los métodos ANTES de conectar.
    // Usamos camelCase por defecto (cardFlipped en vez de CardFlipped)
    this.connection.on("cardFlipped", (cardId: string) => {
      console.log(`[SignalR] <<< Recibido cardFlipped: ${cardId}`);
      if (this.onCardFlippedCallback) this.onCardFlippedCallback(cardId);
    });

    // Manejar invocaciones del servidor a un método 'error' si las hay
    this.connection.on("error", (message: any) => {
      console.error("[SignalR] Server error:", message);
    });
    // Algunos servidores podrían llamar con mayúscula
    this.connection.on("Error", (message: any) => {
      console.error("[SignalR] Server Error:", message);
    });

    this.connection.on("GameStateUpdated", (gameString: string) => {
      if (this.onGameUpdatedCallback) {
        this.onGameUpdatedCallback(gameString);
      }
    });

    this.connection.on("LogFromServer", (message: string) => {
      console.log(`[SignalR] Log: ${message}`);
    });

    this.setupLoggers();
  }
  async disconnect(): Promise<void> {
    await this.connection.stop();
  }

  async sendUpdateStateGame(game: Game): Promise<void> {
    // Asegúrate de que el nombre coincida con el método en C# (UpdateGame)
    console.log(`[SignalR] >>> Enviando UpdateGameState: `, game);
    await this.connection.invoke("UpdateGameState", game);
  }

  async sendCreateGame(game: Game): Promise<void> {
    await this.connection.invoke("CreateGame", game);
  }

  async sendJoinGame(gameName: string, playerName: string): Promise<void> {
    await this.connection.invoke("JoinGame", playerName, gameName);
  }

  private setupLoggers() {
    this.connection.onreconnecting((err) => {
      this.setConnectionStatusCallback?.(1);
      console.warn("[SignalR] Reconectando...", err);
    });
    this.connection.onreconnected((id) => {
      this.setConnectionStatusCallback?.(2);
      console.log("[SignalR] Reconectado:", id);
    });
    this.connection.onclose((err) => {
      this.setConnectionStatusCallback?.(0);
      console.log("[SignalR] Conexión cerrada", err);
    });
  }

  async connect(): Promise<void> {
    if (this.connection.state === signalR.HubConnectionState.Disconnected) {
      try {
        await this.connection.start();
        this.setConnectionStatusCallback?.(2);
        console.log(
          "[SignalR] Conectado con ID:",
          this.connection.connectionId,
        );
      } catch (err) {
        console.error("[SignalR] Error al conectar:", err);
        throw err;
      }
    }
  }

  // Los métodos 'on' ahora solo guardan el callback, el registro real ya se hizo en el constructor
  onRemoteFlipCard(callback: (cardId: string) => void): void {
    this.onCardFlippedCallback = callback;
  }

  onRemoteGameUpdated(callback: (gameJson: string) => void): void {
    this.onGameUpdatedCallback = callback;
  }

  setConnectionStatus(callback: (status: number) => void): void {
    this.setConnectionStatusCallback = callback;
  }

  offAll(): void {
    this.onGameUpdatedCallback = undefined;
    this.onCardFlippedCallback = undefined;
    // Si quieres dejar de escuchar físicamente:
    this.connection.off("GameStateUpdated");
    this.connection.off("cardFlipped");
    this.connection.off("LogFromServer");
    this.connection.off("error");
    this.connection.off("Error");
    this.connection.off("reconnecting");
    this.connection.off("reconnected");
    this.connection.off("close");
  }
}
