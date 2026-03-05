import type { GameRepository } from '../../core/domain/repositories/GameRepository';
import type { GameHubPort, CardDto } from '../../core/domain/ports/GameHubPort';
import type { GameState } from '../../core/domain/entities/GameState';
import { Card } from '../../core/domain/entities/Card';

/**
 * Repositorio online que implementa GameRepository.
 * Extiende la funcionalidad de InMemoryGameRepository integrando
 * las llamadas al hub de SignalR para sincronizar el estado
 * con otros jugadores en tiempo real.
 */
export class OnlineMemoryGameRepository implements GameRepository {

  private state: GameState;
  private listeners: Set<() => void> = new Set();

  constructor(private readonly hub: GameHubPort) {
    this.state = {
      cards: [],
      moves: 0,
      isProcessing: false,
    };
  }

  // ─── Conexión al hub ───────────────────────────────────────

  /** Conecta al hub y registra los listeners de eventos remotos */
  async connect(gameId: string): Promise<void> {
    await this.hub.connect(gameId);

    // Cuando el otro jugador voltea una carta, aplicar localmente
    this.hub.onRemoteFlipCard((cardId: string) => {
      console.log('[OnlineRepo] Acción remota recibida: FlipCard', cardId);
      const card = this.state.cards.find(c => c.id === cardId);
      if (card && !card.isFlipped && !card.isMatched) {
        const updatedCards = this.state.cards.map(c =>
          c.id === cardId ? c.flip() : c
        );
        this.save({ ...this.state, cards: updatedCards });
      }
    });

    // Cuando se inicia una partida remota, sincronizar las cartas
    this.hub.onRemoteStartGame((_level: number, remoteCards: CardDto[]) => {
      console.log('[OnlineRepo] Partida remota iniciada con', remoteCards.length, 'cartas');
      const newCards = remoteCards.map(
        c => new Card(c.id, c.value, c.isFlipped, c.isMatched)
      );
      this.save({ cards: newCards, moves: 0, isProcessing: false });
    });

    this.hub.onPlayerJoined((playerId: string) => {
      console.log('[OnlineRepo] Jugador conectado:', playerId);
    });
  }

  /** Desconecta del hub y limpia los listeners */
  async disconnect(): Promise<void> {
    this.hub.offAll();
    await this.hub.disconnect();
  }

  // ─── Implementación de GameRepository ──────────────────────

  setLevel(level: number): void {
    const selectedValues = Array.from(
      { length: level - 1 },
      (_, i) => (i + 1).toString()
    );
    const values = [...selectedValues, ...selectedValues];

    this.state = {
      cards: values
        .sort(() => Math.random() - 0.5)
        .map((v, i) => new Card(i.toString(), v)),
      moves: 0,
      isProcessing: false,
    };

    // Notificar a los listeners locales
    this.listeners.forEach(l => l());
  }

  getState = (): GameState => this.state;

  save(state: GameState): void {
    this.state = state;
    this.listeners.forEach(l => l());
  }

  subscribe = (listener: () => void): (() => void) => {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  };

  // ─── Acciones online (envío al hub) ────────────────────────

  /** Envía al servidor la acción de voltear carta */
  async sendFlipCard(cardId: string): Promise<void> {
    await this.hub.sendFlipCard(cardId);
  }

  /** Envía al servidor la acción de iniciar partida */
  async sendStartGame(level: number): Promise<void> {
    await this.hub.sendStartGame(level);
  }
}
