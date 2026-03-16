import { Card } from "../entities/Card";
import type { GameState } from "../entities/GameState";
import { Player } from "../entities/Player";

export class UseCaseFlipCard {
  execute(gameState: GameState, cardId: string, playerName: string): GameState {
    console.log(`[UseCaseFlipCard] Estado actual:`, gameState);
    if (this.canClick(gameState, cardId, playerName)) {
      let newState = this.flipCard(gameState, cardId, playerName);

      if (newState.cards.filter((c) => c.isFlipped === true).length === 2) {
        newState = this.checkMatch(newState);
      }

      console.log(`[UseCaseFlipCard] Estado después de flipCard:`, newState);
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
      gameState.players.some(
        (p) => p.name === playerName && p.turn && p.remainMoves > 0,
      ) && gameState.cards.find((c) => c.id === cardId)?.isFlipped === false
    );
  }

  flipCard(
    gameState: GameState,
    cardId: string,
    playerName: string,
  ): GameState {
    const card = gameState.cards.find((c) => c.id === cardId);
    if (!card || card.isFlipped || card.isMatched)
      throw new Error("Invalid card flip");

    const newCards = gameState.cards.map((c) =>
      c.id === cardId ? new Card(c.id, c.value, true, c.isMatched) : c,
    );

    const newPlayers = gameState.players.map((p) => {
      const newRemainMoves = p.remainMoves - 1;

      if (p.name === playerName) {
        const newPlayer = new Player(
          p.id,
          p.name,
          newRemainMoves,
          p.totalMoves + 1,
          p.points,
          p.turn,
        );

        return newPlayer;
      } else {
        return p;
      }
    });

    gameState.players = newPlayers;
    gameState.cards = newCards;

    return gameState;
  }

  checkMatch(gameState: GameState): GameState {
    let hasMatch = false;
    const flippedCards = gameState.cards.filter(
      (c) => c.isFlipped && !c.isMatched,
    );
    if (flippedCards.length === 2) {
      const [card1, card2] = flippedCards;
      if (card1.value === card2.value) {
        hasMatch = true;
        //card1.isMatched = true;
        //card2.isMatched = true;
      } else {
        //card1.isFlipped = false;
        //card2.isFlipped = false;
      }
    }

    if (hasMatch) {
      const currentPlayer = gameState.players.find((p) => p.turn);
      if (currentPlayer) {
        currentPlayer.points += 1;
        currentPlayer.remainMoves = 2; // Reset moves on match
      }
    } else {
      // Si no hay match, pasamos el turno al siguiente jugador
      const currentIndex = gameState.players.findIndex((p) => p.turn);
      const nextIndex = (currentIndex + 1) % gameState.players.length;
      gameState.players[currentIndex].turn = false;
      gameState.players[nextIndex].turn = true;
    }

    return gameState;
  }
}
