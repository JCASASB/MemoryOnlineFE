import type { GameRepository } from '../domain/repositories/GameRepository';
import { Game } from '../domain/entities/Game';

export class FlipCardUseCase {
  constructor(private readonly repository: GameRepository) {}

  async execute(cardId: string): Promise<void> {
    const state = this.repository.getState();
    let game = new Game(state.cards, state.moves, state.isProcessing);

    game = game.flipCard(cardId);
    this.repository.save(game);

    if (game.isProcessing) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      game = game.checkMatch();
      this.repository.save(game);
    }
  }
}
