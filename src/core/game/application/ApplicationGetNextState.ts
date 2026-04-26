import type { Game } from "../domain/entities/Game";
import type { GameRepositoryType } from "../repository/GameRepositoryType";

export class ApplicationGetNextState {
  constructor(private readonly repository: GameRepositoryType) {}

  async execute(): Promise<Game | undefined> {
    const state = await this.repository.goToNextVersionState();
    return state;
  }
}
