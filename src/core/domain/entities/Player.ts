export class Player {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public remainMoves: number,
    public totalMoves: number,
    public points: number,
    public turn: boolean,
  ) {}
}
