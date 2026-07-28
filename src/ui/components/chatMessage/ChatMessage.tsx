// ChatMessage.tsx
import { useState } from "react";
import { PopupChallenge } from "../popupChallenge/PopupChallenge";
import type { ChatMessage as ChatMessageType } from "../../../core/chat/domain/entities/ChatMessage";
import { usePlayer } from "../../hooks/usePlayer";
import * as S from "./ChatMessage.styles"; // <-- Importación de los estilos agregada

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
      <S.Bubble $mine={mine} data-message-id={id}>
        {mine ? (
          <S.Sender>{playerName}</S.Sender>
        ) : (
          <S.SenderButton onClick={() => setShowChallenge(true)}>
            {playerName}
          </S.SenderButton>
        )}
        <S.BubbleText>{message}</S.BubbleText>
        <S.BubbleTime>{time}</S.BubbleTime>
      </S.Bubble>
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
