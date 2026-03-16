import { Card } from "../entities/Card";
import type { GameState } from "../entities/GameState";
import { Player } from "../entities/Player";

export class UseCaseFlipCard {
  execute(gameState: GameState, cardId: string, playerName: string): GameState {
    console.log(`[UseCaseFlipCard] Estado actual:`, gameState);
    if (this.canClick(gameState, cardId, playerName)) {
      const newState = this.flipCard(gameState, cardId);

      return {
        id: newState.id,
        name: newState.name,
        level: newState.level,
        cards: newState.cards,
        players: newState.players,
        isProcessing: newState.isProcessing,
      } as GameState;
    }

    return gameState;
  }

  canClick(gameState: GameState, cardId: string, playerName: string): boolean {
    return (
      gameState.players.some((p) => p.name === playerName && p.turn) &&
      !gameState.isProcessing &&
      gameState.cards.find((c) => c.id === cardId)?.isFlipped === false
    );
  }

  flipCard(gameState: GameState, cardId: string): GameState {
    const card = gameState.cards.find((c) => c.id === cardId);
    if (!card || card.isFlipped || card.isMatched)
      throw new Error("Invalid card flip");

    const newCards = gameState.cards.map((c) =>
      c.id === cardId ? new Card(c.id, c.value, true, c.isMatched) : c,
    );

    const flippedCount = newCards.filter(
      (c) => c.isFlipped && !c.isMatched,
    ).length;

    gameState.players.map((p) =>
      p.turn
        ? new Player(
            p.id,
            p.name,
            p.remainMoves,
            p.totalMoves + 1,
            p.points,
            p.turn,
          )
        : p,
    );

    gameState.cards = newCards;
    gameState.isProcessing = flippedCount === 2;

    return gameState;
  }
}
