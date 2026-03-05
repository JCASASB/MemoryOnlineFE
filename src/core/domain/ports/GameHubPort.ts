/**
 * Puerto para comunicación en tiempo real con el servidor de juego.
 * Permite enviar y recibir acciones sin acoplarse a SignalR.
 */
export interface GameHubPort {
  connect(gameId: string): Promise<void>;
  disconnect(): Promise<void>;

  // Enviar acciones al servidor
  sendFlipCard(cardId: string): Promise<void>;
  sendStartGame(level: number): Promise<void>;

  // Escuchar acciones remotas
  onRemoteFlipCard(callback: (cardId: string) => void): void;
  onRemoteStartGame(callback: (level: number, cards: CardDto[]) => void): void;
  onPlayerJoined(callback: (playerId: string) => void): void;

  offAll(): void;
}

export interface CardDto {
  id: string;
  value: string;
  isFlipped: boolean;
  isMatched: boolean;
}
