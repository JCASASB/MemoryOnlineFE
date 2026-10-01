// GameLobby.styles.ts
import styled from "styled-components";

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px 16px;
  min-height: calc(100vh - 60px);
  gap: 32px;
`;

export const Title = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0;
`;

export const EmptyMessage = styled.p`
  color: #888;
  font-size: 1rem;
`;

export const ChallengeList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  width: 100%;
  max-width: 480px;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;
