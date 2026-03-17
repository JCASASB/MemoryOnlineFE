import { Card } from "../entities/Card";
import type { GameState } from "../entities/GameState";
import { Player } from "../entities/Player";

export class UseCaseFlipCard {
  execute(gameState: GameState, cardId: string, playerName: string): GameState {
    // console.log(`[UseCaseFlipCard] Estado actual ds:`, playerName);
    //  console.log(`[UseCaseFlipCard] Estado actual d:`, gameState);
    if (this.canClick(gameState, cardId, playerName)) {
      let newState = this.flipCard(gameState, cardId, playerName);

      const revealedIdCards = this.getIdCardsRevealedAndNotMatched(newState);
      if (revealedIdCards.length === 2) {
        newState = this.checkMatch(newState, revealedIdCards);
      }

      //console.log(`[UseCaseFlipCard] Estado después de flipCard:`, newState);
      return {
        id: newState.id,
        name: newState.name,
        level: newState.level,
        cards: newState.cards,
        players: newState.players,
        isProcessing: newState.isProcessing,
      } as GameState;
    } else {
      console.warn(
        `[UseCaseFlipCard] No se puede hacer clic en la carta ${cardId} para el jugador ${playerName}. Verifique las condiciones de turno y estado de la carta.`,
      );
      throw new Error("Cannot flip card: Invalid conditions");
    }

    return gameState;
  }

  canClick(gameState: GameState, cardId: string, playerName: string): boolean {
    return (
      gameState.players.some(
        (p) => p.name === playerName && p.turn === true && p.remainMoves > 0,
      ) && gameState.cards.find((c) => c.id === cardId)?.isRevealed === false
    );
  }

  flipCard(
    gameState: GameState,
    cardId: string,
    playerName: string,
  ): GameState {
    const card = gameState.cards.find((c) => c.id === cardId);
    if (!card || card.isRevealed || card.isMatched)
      throw new Error("Invalid card flip");

    const newCards = gameState.cards.map((c) =>
      c.id === cardId
        ? new Card(c.id, c.value, c.imageUrl, c.isMatched, true)
        : c,
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

  checkMatch(gameState: GameState, revealedIdCards: string[]): GameState {
    let hasMatch = false;
    const flippedCards = gameState.cards.filter(
      (c) => c.id === revealedIdCards[0] || c.id === revealedIdCards[1],
    );

    const [card1, card2] = flippedCards;
    if (card1.value === card2.value) {
      hasMatch = true;
    }

    const currentPlayer = gameState.players.find((p) => p.turn);
    if (currentPlayer) {
      currentPlayer.remainMoves = 2; // Reset moves on match
    }

    if (hasMatch) {
      if (currentPlayer) {
        currentPlayer.points += 1;
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

  getIdCardsRevealedAndNotMatched(gameState: GameState): string[] {
    return gameState.cards
      .filter((c) => c.isRevealed && !c.isMatched)
      .map((c) => c.id);
  }
}
