import type { GameRepository } from "../domain/repositories/GameRepository";

export class ApplicationAnimationInProgressRemove {
  constructor(private readonly repository: GameRepository) {}

  async execute(animationIds: string | string[]): Promise<void> {
    const ids = Array.isArray(animationIds) ? animationIds : [animationIds];
    await this.repository.removeAnimationInProgress(ids);
  }
}
