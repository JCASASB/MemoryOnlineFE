export class Player {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly remainMoves: number = 2,
    public readonly totalMoves: number = 0,
    public readonly points: number = 0,
    public readonly turn: boolean = false,
  ) {}

}
