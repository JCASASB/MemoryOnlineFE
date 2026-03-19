import { Card } from "../entities/Card";
import { Game } from "../entities/Game";
import { Player } from "../entities/Player";

export class UseCaseFlipCard {
  execute(game: Game, cardId: string, playerId: string): Game {
    //  console.log(`[UseCaseFlipCard] Estado actual d:`, game);
    if (this.canClick(game, cardId, playerId)) {
      const cards = this.flipCard(game.cards, cardId);
      const revealedIdCards = this.getCardsRevealedAndNotMatched(cards);

      const players = this.checkMatchPlayers(game.players, revealedIdCards);

      return {
        id: game.id,
        name: game.name,
        level: game.level,
        cards: cards,
        players: players,
        isProcessing: game.isProcessing,
      } as Game;
    } else {
      console.warn(
        `[UseCaseFlipCard] No se puede hacer clic en la carta ${cardId} para el jugador ${playerId}. Verifique las condiciones de turno y estado de la carta.`,
      );
      throw new Error("Cannot flip card: Invalid conditions");
    }

    return game;
  }

  canClick(game: Game, cardId: string, playerId: string): boolean {
    return (
      game.players.some(
        (p) => p.id === playerId && p.turn === true && p.remainMoves > 0,
      ) && game.cards.find((c) => c.id === cardId)?.isRevealed === false
    );
  }

  flipCard(cards: Card[], cardId: string): Card[] {
    const card = cards.find((c) => c.id === cardId);
    if (!card || card.isRevealed || card.isMatched)
      throw new Error("Invalid card flip");

    const newCards = cards.map((c) =>
      c.id === cardId
        ? new Card(c.id, c.value, c.imgUrl, c.isMatched, true)
        : c,
    );

    return newCards;
  }

  checkMatchPlayers(
    players: Player[],
    revealedIdCards: [string, number][],
  ): Player[] {
    if (revealedIdCards.length === 2) {
      const isMatch = revealedIdCards[0][1] === revealedIdCards[1][1];

      const newPlayers = players.map((p) => {
        if (isMatch) {
          if (p.turn) {
            return new Player(
              p.id,
              p.name,
              2,
              p.totalMoves + 1,
              p.points + 1,
              true,
            );
          } else {
            return p;
          }
        }
        //not a match, so change the turn to the other player
        else {
          if (p.turn) {
            return new Player(p.id, p.name, 2, p.totalMoves, p.points, false);
          } else {
            return new Player(
              p.id,
              p.name,
              p.remainMoves,
              p.totalMoves,
              p.points,
              true,
            );
          }
        }
      });

      return newPlayers;
    } else {
      return players;
    }
  }

  getCardsRevealedAndNotMatched(cards: Card[]): [string, number][] {
    return cards
      .filter((c) => c.isRevealed && !c.isMatched)
      .map((c) => [c.id, c.value]);
  }
}
