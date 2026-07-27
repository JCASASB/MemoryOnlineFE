import styled from "styled-components";
import type { Challenge } from "../../../core/chat/domain/entities/Challenge";

export const ItemChallenge = ({
  challenge,
  joiningId,
  handleJoin,
}: {
  challenge: Challenge;
  joiningId: string | null;
  handleJoin: (challenge: Challenge) => Promise<void>;
}) => {
  return (
    <>
      <ChallengeItem key={challenge.id}>
        <ChallengeInfo>
          <ChallengeLabel>Desafío</ChallengeLabel>
          <span>De: {challenge.player1Name}</span>
          <span>Para: {challenge.player2Name}</span>
          <span>En: {challenge.createdAt}</span>
        </ChallengeInfo>
        <JoinButton
          onClick={() => void handleJoin(challenge)}
          disabled={joiningId === challenge.id}
        >
          {joiningId === challenge.id ? "Entrando..." : "Unirse"}
        </JoinButton>
      </ChallengeItem>
    </>
  );
};

const ChallengeItem = styled.li`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-radius: 10px;
  border: 2px solid #ddd;
  background: #fafafa;
`;

const ChallengeInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  font-size: 0.9rem;
`;

const ChallengeLabel = styled.span`
  font-weight: 700;
  font-size: 1rem;
`;

const JoinButton = styled.button`
  padding: 10px 22px;
  border-radius: 8px;
  border: none;
  background: #333;
  color: white;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  &:hover {
    background: #555;
  }
  &:disabled {
    background: #aaa;
    cursor: not-allowed;
  }
`;
