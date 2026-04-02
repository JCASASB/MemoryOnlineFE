import type { GameRepository } from "../domain/repositories/GameRepository";

export class ApplicationAnimationInProgressRemove {
  constructor(private readonly repository: GameRepository) {}

  async execute(animationId: string): Promise<void> {
    await this.repository.removeAnimationInProgress(animationId);
  }
}
