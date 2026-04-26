import type { ChatRepositoryType } from "../repository/ChatRepositoryType";
import type { UseCaseSendChatMessage } from "../domain/useCases/UseCaseSendChatMessage";

export class ApplicationSendChatMessage {
  constructor(
    private readonly repository: ChatRepositoryType,
    private readonly useCase: UseCaseSendChatMessage,
  ) {}

  async execute(message: string, playerName: string): Promise<void> {
    const cleanMessage = this.useCase.execute(message);
    const cleanPlayerName = playerName.trim();

    if (!cleanPlayerName) {
      throw new Error("No se encontro el nombre del jugador.");
    }

    await this.repository.sendChatMessageToServer(
      cleanMessage,
      cleanPlayerName,
    );
  }
}
