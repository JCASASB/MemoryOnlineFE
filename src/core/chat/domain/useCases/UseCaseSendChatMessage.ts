import type { ChatMessage } from "../entities/ChatMessage";
import { v4 as uuidv4 } from "uuid";

export class UseCaseSendChatMessage {
  execute(message: string, playerName: string, playerId: string): ChatMessage {
    const sanitized = message.trim();

    if (!sanitized) {
      throw new Error("El mensaje no puede estar vacio.");
    }

    return {
      id: uuidv4(),
      message: sanitized,
      sentAtUtc: new Date().toISOString(),
      playerName: playerName.trim(),
      playerId: playerId,
    };
  }
}
