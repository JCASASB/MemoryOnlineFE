import type { GameRepositoryType } from "../repository/GameRepositoryType";

export class ApplicationAnimationInProgressRemove {
  constructor(private readonly repository: GameRepositoryType) {}

  async execute(animationIds: string | string[]): Promise<void> {
    const ids = Array.isArray(animationIds) ? animationIds : [animationIds];
    await this.repository.removeAnimationInProgress(ids);
  }
}
