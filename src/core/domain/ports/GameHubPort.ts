import type { Game } from "../../game/domain/entities/Game";

/**
 * Puerto para comunicación en tiempo real con el servidor de juego.
 * Permite enviar y recibir acciones sin acoplarse a SignalR.
 */
export interface GameHubPort {
  connect(): Promise<void>;
  disconnect(): Promise<void>;

  // Enviar acciones al servidor
  sendCreateGame(game: Game): Promise<void>;
  sendUpdateStateGame(game: Game, matchId: string): Promise<void>;

  // Escuchar acciones remotas
  onRemoteGameUpdated(callback: (gameJson: string) => void): void;

  offAll(): void;
}
