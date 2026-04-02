import type { GameRepository } from "../domain/repositories/GameRepository";

export class ApplicationAnimationInProgressAdd {
  constructor(private readonly repository: GameRepository) {}

  async execute(animationId: string): Promise<void> {
    await this.repository.addAnimationInProgress(animationId);
  }
}
