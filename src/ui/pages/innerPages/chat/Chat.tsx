import { useEffect, useRef, useState } from "react";
import type { ChatMessage } from "../../../../core/chat/domain/entities/ChatMessage";
import { ChatMessage as ChatMessageBubble } from "../../../components/chatMessage/ChatMessage";
import { useDependencies } from "../../../context/useDependencies";
import { usePlayer } from "../../../hooks/usePlayer";
import { useUCs } from "../../../hooks/useUCs";
import {
  Wrapper,
  Title,
  Messages,
  Form,
  Input,
  Button,
  Message,
} from "./Chat.styles";

type UIMessage = {
  id: string;
  playerName: string;
  playerId: string;
  message: string;
  sentAtUtc: string;
};

const toUiMessage = (msg: ChatMessage): UIMessage => ({
  id: msg.id,
  playerName: msg.playerName,
  playerId: msg.playerId,
  message: msg.message,
  sentAtUtc: msg.sentAtUtc,
});

export const Chat = () => {
  const { chatRepository } = useDependencies();
  const { playerName, playerId } = usePlayer();
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

  useEffect(() => {
    let isMounted = true;

    const unsubscribe = chatRepository.subscribeToNumMessages(() => {
      if (isMounted) {
        setMessages(chatRepository.getChatMessages().map(toUiMessage));
      }
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, [chatRepository]);

  useEffect(() => {
    console.log("[Chat] Messages updated, total:", messages);
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

      await sendChatMessageUC(text, playerName, playerId);
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
          //const mine = item.playerName.trim().toLowerCase() === myName;

          return (
            <ChatMessageBubble
              key={item.id}
              id={item.id}
              playerId={item.playerId}
              playerName={item.playerName}
              message={item.message}
              sentAtUtc={item.sentAtUtc}
            />
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
