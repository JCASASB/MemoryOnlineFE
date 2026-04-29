import { Card } from "../entities/Card";
import { Game } from "../entities/Game";
import { Player } from "../entities/Player";
import { StateCard } from "../entities/StateCard";
import { v4 as uuidv4 } from "uuid";

export class UseCaseFlipCard {
  execute(game: Game, cardId: string, playerId: string): Game | undefined {
    if (this.canClick(game, cardId, playerId)) {
      const cards = this.flipCard(game.cards, cardId);
      const revealedIdCards = this.getCardsRevealedAndNotMatched(cards);

      const players = this.checkMatchPlayers(game.players, revealedIdCards);

      return {
        id: uuidv4(),
        name: game.name,
        level: game.level,
        version: game.version + 1,
        cards: cards,
        players: players,
      } as Game;
    } else {
      return undefined;
    }
  }

  private logCanClickVariables(
    game: Game,
    cardId: string,
    playerId: string,
  ): void {
    const existsPlayerId = game.players.some((p) => p.id === playerId);

    const playerHasTurn = game.players.some(
      (p) => p.id === playerId && p.turn === true,
    );

    const isCurrentPlayerWithMoves = game.players.some(
      (p) => p.id === playerId && p.turn === true && p.remainMoves > 0,
    );

    const targetCard = game.cards.find((c) => c.id === cardId);
    const isTargetCardFaceDown = targetCard?.state === StateCard.FaceDown;

    console.log(`[UseCaseFlipCard][canClick] existsPlayerId:`, existsPlayerId);
    console.log(`[UseCaseFlipCard][canClick] playerHasTurn:`, playerHasTurn);
    console.log(
      `[UseCaseFlipCard][canClick] isCurrentPlayerWithMoves:`,
      isCurrentPlayerWithMoves,
    );
    console.log(`[UseCaseFlipCard][canClick] targetCard:`, targetCard);
    console.log(
      `[UseCaseFlipCard][canClick] isTargetCardFaceDown:`,
      isTargetCardFaceDown,
    );
  }

  canClick(game: Game, cardId: string, playerId: string): boolean {
    this.logCanClickVariables(game, cardId, playerId);

    return (
      game.players.some(
        (p) => p.id === playerId && p.turn === true && p.remainMoves > 0,
      ) && game.cards.find((c) => c.id === cardId)?.state === StateCard.FaceDown
    );
  }

  flipCard(cards: Card[], cardId: string): Card[] {
    const card = cards.find((c) => c.id === cardId);
    if (!card || card.state !== StateCard.FaceDown)
      throw new Error("Invalid card flip");

    const newCards = cards.map((c) =>
      c.id === cardId ? new Card(c.id, c.value, c.imgUrl, StateCard.FaceUp) : c,
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
              p.order,
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
            return new Player(
              p.id,
              p.name,
              p.order,
              2,
              p.totalMoves,
              p.points,
              false,
            );
          } else {
            return new Player(
              p.id,
              p.name,
              p.order,
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
      .filter((c) => c.state === StateCard.FaceUp)
      .map((c) => [c.id, c.value]);
  }
}
