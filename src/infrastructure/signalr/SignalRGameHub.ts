import * as signalR from '@microsoft/signalr';
import type { GameHubPort, CardDto } from '../../core/domain/ports/GameHubPort';

/**
 * Implementación de GameHubPort usando SignalR.
 * Se conecta al Hub de .NET y traduce los mensajes.
 */
export class SignalRGameHub implements GameHubPort {
  private connection: signalR.HubConnection;
  private gameId: string = '';

  constructor(hubUrl: string) {
    console.log('[SignalR] Creando conexión a:', hubUrl);
    this.connection = new signalR.HubConnectionBuilder()
      .withUrl(hubUrl)
      .withAutomaticReconnect()
      .configureLogging(signalR.LogLevel.Information)
      .build();

    this.connection.onreconnecting((error) => {
      console.warn('[SignalR] Reconectando...', error);
    });

    this.connection.onreconnected((connectionId) => {
      console.log('[SignalR] Reconectado con ID:', connectionId);
    });

    this.connection.onclose((error) => {
      console.log('[SignalR] Conexión cerrada', error);
    });
  }

  async connect(gameId: string): Promise<void> {
    this.gameId = gameId;
    console.log(`[SignalR] Conectando a sala "${gameId}"...`);

    if (this.connection.state === signalR.HubConnectionState.Disconnected) {
      await this.connection.start();
      console.log('[SignalR] Conectado. Estado:', this.connection.state, '| ConnectionId:', this.connection.connectionId);
    }

    // Unirse a la sala del juego
    await this.connection.invoke('JoinGame', gameId);
    console.log(`[SignalR] Unido a sala "${gameId}"`);
  }

  async disconnect(): Promise<void> {
    console.log(`[SignalR] Desconectando de sala "${this.gameId}"...`);
    if (this.connection.state === signalR.HubConnectionState.Connected) {
      await this.connection.invoke('LeaveGame', this.gameId);
      await this.connection.stop();
      console.log('[SignalR] Desconectado');
    }
  }

  async sendFlipCard(cardId: string): Promise<void> {
    console.log(`[SignalR] >>> Enviando FlipCard: carta "${cardId}" en sala "${this.gameId}"`);
    await this.connection.invoke('FlipCard', this.gameId, cardId);
    console.log(`[SignalR] >>> FlipCard enviado OK`);
  }

  async sendStartGame(level: number): Promise<void> {
    console.log(`[SignalR] >>> Enviando StartGame: nivel ${level} en sala "${this.gameId}"`);
    await this.connection.invoke('StartGame', this.gameId, level);
    console.log(`[SignalR] >>> StartGame enviado OK`);
  }

  onRemoteFlipCard(callback: (cardId: string) => void): void {
    this.connection.on('CardFlipped', (cardId: string) => {
      console.log(`[SignalR] <<< Recibido CardFlipped: carta "${cardId}"`);
      callback(cardId);
    });
  }

  onRemoteStartGame(callback: (level: number, cards: CardDto[]) => void): void {
    this.connection.on('GameStarted', (level: number, cards: CardDto[]) => {
      console.log(`[SignalR] <<< Recibido GameStarted: nivel ${level}, ${cards.length} cartas`, cards);
      callback(level, cards);
    });
  }

  onPlayerJoined(callback: (playerId: string) => void): void {
    this.connection.on('PlayerJoined', (playerId: string) => {
      console.log(`[SignalR] <<< Jugador conectado: ${playerId}`);
      callback(playerId);
    });
  }

  offAll(): void {
    console.log('[SignalR] Eliminando todos los listeners');
    this.connection.off('CardFlipped');
    this.connection.off('GameStarted');
    this.connection.off('PlayerJoined');
  }
}
