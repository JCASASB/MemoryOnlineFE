import type { Game } from "../domain/entities/Game";
import type { GameRepository } from "../domain/repositories/GameRepository";

export class UseCaseUpdateStateToServer {
  constructor(private readonly repository: GameRepository) {}

  execute(newState: Game): void {
    console.log(
      "[UseCaseUpdateStateToServer] Enviando a server con nuevo estado:",
      newState.cards.length,
      "cartas",
    );
    this.repository.updateStateToServer(newState);
  }
}
