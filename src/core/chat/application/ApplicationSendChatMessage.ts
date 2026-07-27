import type { UseCaseSendChatMessage } from "../domain/useCases/UseCaseSendChatMessage";
import type { ApplicationHubPort } from "../../domain/ports/GameHubPort";

export class ApplicationSendChatMessage {
  constructor(
    private readonly signalRService: ApplicationHubPort,
    private readonly useCase: UseCaseSendChatMessage,
  ) {}

  async execute(
    message: string,
    playerName: string,
    playerId: string,
  ): Promise<void> {
    const cleanPlayerName = playerName.trim();
    const chatMessage = this.useCase.execute(
      message,
      cleanPlayerName,
      playerId,
    );

    if (!cleanPlayerName) {
      throw new Error("No se encontro el nombre del jugador.");
    }

    await this.signalRService.sendChatMessage(chatMessage);
  }
}
