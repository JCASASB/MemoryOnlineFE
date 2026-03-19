import * as signalR from "@microsoft/signalr";
import type { GameHubPort } from "../../core/domain/ports/GameHubPort";
import { Card } from "../../core/domain/entities/Card";
import { Player } from "../../core/domain/entities/Player";
import { Game } from "../../core/domain/entities/Game";

export class SignalRGameHub implements GameHubPort {
  private connection: signalR.HubConnection;
  // gameName is unused currently; keep if needed later

  // Handlers para evitar el error de "método no encontrado"
  private onGameUpdatedCallback?: (gameJson: string) => void;
  private onCardFlippedCallback?: (cardId: string) => void;

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
    const plainState = this.toPlainGame(game);

    // Asegúrate de que el nombre coincida con el método en C# (UpdateGame)
    await this.connection.invoke("UpdateGameState", plainState);
  }

  async sendCreateGame(game: Game): Promise<void> {
    const plainState = this.toPlainGame(game);

    await this.connection.invoke("CreateGame", plainState);
  }

  async sendJoinGame(gameName: string, playerName: string): Promise<void> {
    await this.connection.invoke("JoinGame", playerName, gameName);
  }

  private setupLoggers() {
    this.connection.onreconnecting((err) =>
      console.warn("[SignalR] Reconectando...", err),
    );
    this.connection.onreconnected((id) =>
      console.log("[SignalR] Reconectado:", id),
    );
    this.connection.onclose((err) =>
      console.log("[SignalR] Conexión cerrada", err),
    );
  }

  async connect(): Promise<void> {
    if (this.connection.state === signalR.HubConnectionState.Disconnected) {
      try {
        await this.connection.start();
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

  // ... (Resto de métodos sendCreateGame, sendJoinGame, disconnect se mantienen igual)

  private toPlainGame(game: Game): any {
    return {
      Id: game.id,
      Name: game.name,
      IsProcessing: game.isProcessing,
      Level: game.level,
      Cards:
        game.cards?.map((c) => ({
          Id: c.id,
          Value: String(c.value),
          IsRevealed: c.isRevealed,
          IsMatched: c.isMatched,
        })) || [],
      Players:
        game.players?.map((p) => ({
          Id: p.id,
          Name: p.name,
          RemainMoves: p.remainMoves,
          TotalMoves: p.totalMoves,
          Points: p.points,
          Turn: p.turn,
        })) || [],
    };
  }

  getNewObjectGame(data: any): Game {
    // Si el servidor envía un string JSON, lo parseamos; si no, usamos el objeto directamente
    const game = typeof data === "string" ? JSON.parse(data) : data;

    const rawCards = game.cards || game.Cards || [];
    const rawPlayers = game.players || game.Players || [];

    const cards = rawCards.map(
      (c: any) =>
        new Card(
          c.id || c.Id,
          c.value || c.Value,
          c.isMatched ?? c.IsMatched,
          c.isRevealed ?? c.IsRevealed,
        ),
    );

    const players = rawPlayers.map(
      (p: any) =>
        new Player(
          p.id || p.Id,
          p.name || p.Name,
          p.remainMoves ?? p.RemainMoves,
          p.totalMoves ?? p.TotalMoves,
          p.points ?? p.Points,
          p.turn ?? p.Turn,
        ),
    );

    const id = game.id || game.Id || "";
    const name = game.name || game.Name || "";
    const level = game.level ?? game.Level ?? 0;

    const reconstructed = new Game(id, name, level);
    reconstructed.cards = cards;
    reconstructed.players = players;
    reconstructed.isProcessing = !!(game.isProcessing ?? game.IsProcessing);

    return reconstructed;
  }

  offAll(): void {
    this.onGameUpdatedCallback = undefined;
    this.onCardFlippedCallback = undefined;
    // Si quieres dejar de escuchar físicamente:
    this.connection.off("GameUpdated");
    this.connection.off("cardFlipped");
    this.connection.off("error");
    this.connection.off("Error");
  }
}
