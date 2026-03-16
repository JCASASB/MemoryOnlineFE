export class Player {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public remainMoves: number = 2,
    public totalMoves: number = 0,
    public points: number = 0,
    public turn: boolean = false,
  ) {}
}
