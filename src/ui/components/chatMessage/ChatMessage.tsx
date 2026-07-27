import { useState } from "react";
import styled from "styled-components";
import { PopupChallenge } from "../popupChallenge/PopupChallenge";
import type { ChatMessage as ChatMessageType } from "../../../core/chat/domain/entities/ChatMessage";
import { usePlayer } from "../../hooks/usePlayer";

const Bubble = styled.div<{ $mine: boolean }>`
  display: flex;
  flex-direction: column;
  align-self: ${({ $mine }) => ($mine ? "flex-end" : "flex-start")};
  max-width: 80%;
  background: ${({ $mine }) => ($mine ? "#dcf8c6" : "#ffffff")};
  border: 1px solid #ddd;
  border-radius: 12px;
  padding: 10px;
`;

const SenderButton = styled.button`
  font-size: 0.82rem;
  font-weight: 700;
  background: none;
  border: none;
  padding: 0;
  margin: 0;
  cursor: pointer;
  color: #1a73e8;
  text-align: left;
  &:hover {
    text-decoration: underline;
  }
`;

const Sender = styled.strong`
  font-size: 0.82rem;
`;

const BubbleText = styled.p`
  margin: 4px 0 0;
  white-space: pre-wrap;
`;

const BubbleTime = styled.span`
  margin-top: 6px;
  font-size: 0.72rem;
  color: #666;
  align-self: flex-end;
`;

export const ChatMessage = ({
  id,
  playerId,
  playerName,
  message,
  sentAtUtc,
}: ChatMessageType) => {
  const [showChallenge, setShowChallenge] = useState(false);
  const { playerName: myName } = usePlayer();

  const mine = playerName === myName;
  const time = new Date(sentAtUtc).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
  return (
    <>
      <Bubble $mine={mine} data-message-id={id}>
        {mine ? (
          <Sender>{playerName}</Sender>
        ) : (
          <SenderButton onClick={() => setShowChallenge(true)}>
            {playerName}
          </SenderButton>
        )}
        <BubbleText>{message}</BubbleText>
        <BubbleTime>{time}</BubbleTime>
      </Bubble>
      {showChallenge && (
        <PopupChallenge
          opponentName={playerName}
          opponentIdPlayer={playerId}
          onClose={() => setShowChallenge(false)}
        />
      )}
    </>
  );
};
