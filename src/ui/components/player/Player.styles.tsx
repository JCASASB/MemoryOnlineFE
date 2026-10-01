// Player.styles.ts
import styled from "styled-components";

export const IconItem = styled.div`
  position: relative;
`;

export const PlayerIcon = styled.button<{
  $active: boolean;
  $isMe: boolean;
  $isTurn: boolean;
}>`
  width: 34px;
  height: 34px;
  border-radius: 999px;
  border: 1px solid
    ${({ $active, $isTurn }) =>
      $active ? "#fff" : $isTurn ? "#ffd166" : "#555"};
  background: ${({ $isMe }) => ($isMe ? "#1f4b99" : "#333")};
  color: #fff;
  font-weight: 700;
  font-size: 0.85rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const Dropdown = styled.div<{ $align: "left" | "right" }>`
  position: absolute;
  top: calc(100% + 8px);
  left: ${({ $align }) => ($align === "left" ? "0" : "auto")};
  right: ${({ $align }) => ($align === "right" ? "0" : "auto")};
  min-width: 220px;
  padding: 12px;
  border: 1px solid #2a2a2a;
  border-radius: 10px;
  background: #101010;
  color: #fff;
  z-index: 5;
  box-shadow: 0 14px 30px rgba(0, 0, 0, 0.35);
`;

export const PlayerName = styled.div`
  font-size: 1rem;
  font-weight: 700;
  margin-bottom: 8px;
`;

export const Stat = styled.div`
  font-size: 0.9rem;
  color: #d0d0d0;
`;
