import type { GameRepository } from "../domain/repositories/GameRepository";
import type { GameState } from "../domain/entities/GameState";

export class UseCaseUpdateStateToServer {
  constructor(private readonly repository: GameRepository) {}

  execute(newState: GameState): void {
    console.log(
      "[UseCaseUpdateStateToServer] Enviando a server con nuevo estado:",
      newState.cards.length,
      "cartas",
    );
    this.repository.updateStateToServer(newState);
  }
}
