import type { GameRepository } from '../../core/domain/repositories/GameRepository';
import type { GameState } from '../../core/domain/entities/GameState';
import { Card } from '../../core/domain/entities/Card';
export class InMemoryGameRepository implements GameRepository {

  private state: GameState;
  private listeners: Set<() => void> = new Set();

  constructor() {
    this.state = {
      cards: [],
      moves: 0,
      isProcessing: false
    };
  }

  setLevel(level: number) {
    // Genera pares de números para las cartas
    const selectedValues = Array.from({ length: level - 1 }, (_, i) => (i + 1).toString());
    const values = [...selectedValues, ...selectedValues];
 
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
