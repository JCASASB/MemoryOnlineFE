export class UseCaseSendChatMessage {
  execute(message: string): string {
    const sanitized = message.trim();

    if (!sanitized) {
      throw new Error("El mensaje no puede estar vacio.");
    }

    return sanitized;
  }
}
