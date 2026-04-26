export class Player {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly order: number,
    public readonly remainMoves: number,
    public readonly totalMoves: number,
    public readonly points: number,
    public readonly turn: boolean,
  ) {}
}
