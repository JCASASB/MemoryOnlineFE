import type { Challenge } from "../entities/Challenge";
import { v4 as uuidv4 } from "uuid";

export class UseCaseCreateChallenge {
  execute(matchId: string, player1Id: string, player2Id: string): Challenge {
    return {
      id: uuidv4(),
      player1Id,
      player1Name: "",
      player2Id,
      player2Name: "",
      matchId,
    } as Challenge;
  }
}
