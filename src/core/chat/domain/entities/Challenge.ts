export class Challenge {
  constructor(
    public readonly id: string,
    public readonly player1Id: string,
    public readonly player1Name: string,
    public readonly player2Id: string,
    public readonly player2Name: string,
    public readonly matchId: string,
    public readonly createdAt: string,
  ) {}
}
