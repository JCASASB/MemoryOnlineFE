// ChatMessage.styles.ts
import styled from "styled-components";

export const Bubble = styled.div<{ $mine: boolean }>`
  display: flex;
  flex-direction: column;
  align-self: ${({ $mine }) => ($mine ? "flex-end" : "flex-start")};
  max-width: 80%;
  background: ${({ $mine }) => ($mine ? "#dcf8c6" : "#ffffff")};
  border: 1px solid #ddd;
  border-radius: 12px;
  padding: 10px;
`;

export const SenderButton = styled.button`
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

export const Sender = styled.strong`
  font-size: 0.82rem;
`;

export const BubbleText = styled.p`
  margin: 4px 0 0;
  white-space: pre-wrap;
`;

export const BubbleTime = styled.span`
  margin-top: 6px;
  font-size: 0.72rem;
  color: #666;
  align-self: flex-end;
`;
