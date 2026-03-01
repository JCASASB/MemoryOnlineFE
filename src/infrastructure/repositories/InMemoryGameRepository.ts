import type { GameRepository } from '../../core/domain/repositories/GameRepository';
import type { GameState } from '../../core/domain/entities/GameState';
import { Card } from '../../core/domain/entities/Card';

export class InMemoryGameRepository implements GameRepository {
  private state: GameState;
  private listeners: Set<() => void> = new Set();

  constructor() {
    // Inicialización básica con 4 cartas (2 parejas)
    const values = ['🍎', '🍌', '🍎', '🍌'];
    this.state = {
      cards: values.sort(() => Math.random() - 0.5).map((v, i) => new Card(i.toString(), v)),
      moves: 0,
      isProcessing: false
    };
  }

  getState = () => this.state;

  save(state: GameState) {
    this.state = state;
    this.listeners.forEach(l => l());
  }

  subscribe = (listener: () => void) => {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  };
}
