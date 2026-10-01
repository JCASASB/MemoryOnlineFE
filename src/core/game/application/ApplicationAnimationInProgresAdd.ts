import type { GameRepositoryType } from "../repository/GameRepositoryType";

export class ApplicationAnimationInProgressAdd {
  constructor(private readonly repository: GameRepositoryType) {}

  async execute(animationId: string): Promise<void> {
    await this.repository.addAnimationInProgress(animationId);
  }
}
