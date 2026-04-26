import { useEffect, useMemo, useRef, useState } from "react";
import styled from "styled-components";
import type { ChatMessage } from "../../core/chat/domain/entities/ChatMessage";
import { useDependencies } from "../context/useDependencies";
import { usePlayer } from "../hooks/usePlayer";
import { useUCs } from "../hooks/useUCs";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  min-height: calc(100vh - 60px);
  padding: 20px;
  box-sizing: border-box;
  gap: 16px;
`;

const Title = styled.h1`
  margin: 0;
`;

const Messages = styled.div`
  flex: 1;
  min-height: 220px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 12px;
  background: #f7f7f7;
`;

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

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const Input = styled.textarea`
  min-height: 120px;
  resize: vertical;
  padding: 12px;
  border-radius: 10px;
  border: 2px solid #ccc;
  font-size: 1rem;
  font-family: inherit;
`;

const Button = styled.button`
  width: fit-content;
  padding: 10px 16px;
  border-radius: 8px;
  border: none;
  background: #333;
  color: #fff;
  font-weight: 700;
  cursor: pointer;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const Message = styled.p<{ $error?: boolean }>`
  margin: 0;
  color: ${({ $error }) => ($error ? "#b00020" : "#1f7a1f")};
`;

type UIMessage = {
  id: string;
  playerName: string;
  message: string;
  sentAtUtc: string;
};

const toUiMessage = (msg: ChatMessage): UIMessage => ({
  id: msg.id,
  playerName: msg.playerName,
  message: msg.message,
  sentAtUtc: msg.sentAtUtc,
});

export const Chat = () => {
  const { chatRepository } = useDependencies();
  const { playerName } = usePlayer();
  const { sendChatMessageUC } = useUCs();
  const [text, setText] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [status, setStatus] = useState("");
  const [hasError, setHasError] = useState(false);
  const messagesContainerRef = useRef<HTMLDivElement | null>(null);
  const initialScrollDoneRef = useRef(false);
  const [messages, setMessages] = useState<UIMessage[]>(() =>
    chatRepository.getChatMessages().map(toUiMessage),
  );

  const myName = useMemo(() => playerName.trim().toLowerCase(), [playerName]);

  useEffect(() => {
    let isMounted = true;
    let unsubscribe = () => {};

    chatRepository
      .connect()
      .then(() => {
        if (!isMounted) return;

        // Sync any messages that arrived while the page was unmounted
        setMessages(chatRepository.getChatMessages().map(toUiMessage));

        unsubscribe = chatRepository.subscribeToChatMessages((msg: ChatMessage) => {
          setMessages((prev) => [...prev, toUiMessage(msg)]);
        });
      })
      .catch((error: unknown) => {
        const message =
          error instanceof Error
            ? error.message
            : "No se pudo conectar al chat global.";
        setStatus(message);
        setHasError(true);
      });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, [chatRepository]);

  useEffect(() => {
    if (!messages.length || !messagesContainerRef.current) return;

    if (!initialScrollDoneRef.current) {
      const lastSeenMessageId = chatRepository.getLastSeenMessageId();

      if (lastSeenMessageId) {
        const element = messagesContainerRef.current.querySelector(
          `[data-message-id="${lastSeenMessageId}"]`,
        );

        if (element instanceof HTMLElement) {
          element.scrollIntoView({ block: "nearest", behavior: "auto" });
          initialScrollDoneRef.current = true;
          return;
        }
      }
    }

    messagesContainerRef.current.scrollTo({
      top: messagesContainerRef.current.scrollHeight,
      behavior: initialScrollDoneRef.current ? "smooth" : "auto",
    });

    initialScrollDoneRef.current = true;
  }, [chatRepository, messages]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("");
    setHasError(false);

    try {
      setIsSending(true);
      await sendChatMessageUC(text, playerName);
      setText("");
      setStatus("");
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "No se pudo enviar el mensaje.";
      setStatus(message);
      setHasError(true);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Wrapper>
      <Title>Chat global</Title>
      <Messages ref={messagesContainerRef}>
        {messages.map((item) => {
          const mine = item.playerName.trim().toLowerCase() === myName;
          const time = new Date(item.sentAtUtc).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          });

          return (
            <Bubble key={item.id} $mine={mine} data-message-id={item.id}>
              <Sender>{item.playerName}</Sender>
              <BubbleText>{item.message}</BubbleText>
              <BubbleTime>{time}</BubbleTime>
            </Bubble>
          );
        })}
      </Messages>
      <Form onSubmit={onSubmit}>
        <Input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Escribe tu mensaje..."
          maxLength={500}
        />
        <Button type="submit" disabled={isSending || !text.trim()}>
          {isSending ? "Enviando..." : "Enviar"}
        </Button>
      </Form>
      {status ? <Message $error={hasError}>{status}</Message> : null}
    </Wrapper>
  );
};
