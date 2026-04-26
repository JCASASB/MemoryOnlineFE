export class ChatMessage {
  constructor(
    public readonly id: string,
    public readonly playerName: string,
    public readonly message: string,
    public readonly sentAtUtc: string,
  ) {}
}
