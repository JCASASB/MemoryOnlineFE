import type { Game } from "../domain/entities/Game";
import type { GameRepositoryType } from "../repository/GameRepositoryType";

export class ApplicationGetLastAppliedState {
  constructor(private readonly repository: GameRepositoryType) {}

  async execute(): Promise<Game | undefined> {
    const newState = await this.repository.goToLastAppliedState();
    return newState;
  }
}
