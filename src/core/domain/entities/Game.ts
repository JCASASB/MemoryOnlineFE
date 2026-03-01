import { Card } from './Card';
import type { GameState } from './GameState';

export class Game implements GameState {
  constructor(
    public readonly cards: Card[],
    public readonly moves: number = 0,
    public readonly isProcessing: boolean = false
  ) {}

  flipCard(cardId: string): Game {
    if (this.isProcessing) return this;
    
    const card = this.cards.find(c => c.id === cardId);
    if (!card || card.isFlipped || card.isMatched) return this;

    const newCards = this.cards.map(c => c.id === cardId ? c.flip() : c);
    const flippedCount = newCards.filter(c => c.isFlipped && !c.isMatched).length;

    return new Game(newCards, this.moves + (flippedCount === 2 ? 1 : 0), flippedCount === 2);
  }

  checkMatch(): Game {
    const flipped = this.cards.filter(c => c.isFlipped && !c.isMatched);
    if (flipped.length !== 2) return this;

    const isMatch = flipped[0].value === flipped[1].value;
    const finalCards = this.cards.map(c => {
      if (c.isFlipped && !c.isMatched) {
        return isMatch ? c.match() : c.unflip();
      }
      return c;
    });

    return new Game(finalCards, this.moves, false);
  }
}
