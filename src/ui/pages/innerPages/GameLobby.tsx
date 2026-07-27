import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { usePlayer } from "../../hooks/usePlayer";
import { useUCs } from "../../hooks/useUCs";
import { useDependencies } from "../../context/useDependencies";
import type { Challenge } from "../../../core/chat/domain/entities/Challenge";
import { ItemChallenge } from "../../components/itemChallenge/ItemChallenge";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px 16px;
  min-height: calc(100vh - 60px);
  gap: 32px;
`;

const Title = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0;
`;

const EmptyMessage = styled.p`
  color: #888;
  font-size: 1rem;
`;

export const GameLobby = () => {
  const { playerName, playerId } = usePlayer();
  const { onlineRepository } = useDependencies();
  const { joinGameByMatchIdUC } = useUCs();
  const navigate = useNavigate();

  const [challenges, setChallenges] = useState<Challenge[]>(() =>
    onlineRepository.getChallenges(),
  );
  const [joiningId, setJoiningId] = useState<string | null>(null);

  useEffect(() => {
    const unsub = onlineRepository.subscribeToChallenges((challenge) => {
      setChallenges((prev) => [...prev, challenge]);
    });
    return unsub;
  }, [onlineRepository]);

  const handleJoin = async (challenge: Challenge) => {
    console.log("Joining challenge:", challenge);
    setJoiningId(challenge.id);
    try {
      joinGameByMatchIdUC(challenge.matchId, playerName, playerId).then(() => {
        navigate(`/gameboard?matchId=${encodeURIComponent(challenge.matchId)}`);
      });
    } catch (err) {
      console.error("Error joining challenge:", err);
    } finally {
      setJoiningId(null);
    }
  };

  return (
    <Wrapper>
      <Title>Desafíos pendientes</Title>
      {challenges.length === 0 ? (
        <EmptyMessage>No hay desafíos disponibles por el momento.</EmptyMessage>
      ) : (
        <ChallengeList>
          {challenges.map((challenge) => (
            <ItemChallenge
              key={challenge.id}
              challenge={challenge}
              joiningId={joiningId}
              handleJoin={handleJoin}
            />
          ))}
        </ChallengeList>
      )}
    </Wrapper>
  );
};

const ChallengeList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  width: 100%;
  max-width: 480px;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;
