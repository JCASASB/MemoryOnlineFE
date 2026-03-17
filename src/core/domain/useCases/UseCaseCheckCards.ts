import type { GameState } from "../entities/GameState";

export class UseCaseCheckCards {
  execute(gameState: GameState): GameState {
    const idCardsRevealedAndNotMatched =
      this.getIdCardsRevealedAndNotMatched(gameState);
    if (idCardsRevealedAndNotMatched.length === 2) {
      gameState = this.checkMatch(gameState, idCardsRevealedAndNotMatched);

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

  checkMatch(gameState: GameState, revealedIdCards: string[]): GameState {
    const flippedCards = gameState.cards.filter(
      (c) => c.id === revealedIdCards[0] || c.id === revealedIdCards[1],
    );

    const [card1, card2] = flippedCards;
    if (card1.value === card2.value) {
      card1.isMatched = true;
      card2.isMatched = true;
    } else {
      card1.isRevealed = false;
      card2.isRevealed = false;
    }

    return gameState;
  }

  getIdCardsRevealedAndNotMatched(gameState: GameState): string[] {
    return gameState.cards
      .filter((c) => c.isRevealed && !c.isMatched)
      .map((c) => c.id);
  }
}
