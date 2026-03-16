import type { GameState } from "../entities/GameState";

export class UseCaseCheckCards {
  execute(gameState: GameState): GameState {
    if (gameState.cards.filter((c) => c.isFlipped === true).length === 2) {
      gameState = this.checkMatch(gameState);

      return {
        id: gameState.id,
        name: gameState.name,
        level: gameState.level,
        cards: gameState.cards,
        players: gameState.players,
        isProcessing: gameState.isProcessing,
      } as GameState;
    } else {
      return gameState;
    }
  }

  checkMatch(gameState: GameState): GameState {
    const flippedCards = gameState.cards.filter(
      (c) => c.isFlipped && !c.isMatched,
    );
    if (flippedCards.length === 2) {
      const [card1, card2] = flippedCards;
      if (card1.value === card2.value) {
        card1.isMatched = true;
        card2.isMatched = true;
      } else {
        card1.isFlipped = false;
        card2.isFlipped = false;
      }
    }

    return gameState;
  }
}
