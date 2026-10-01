// ScoreBoard.styles.ts
import styled from "styled-components";

export const Bar = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  min-height: 56px;
  padding: 10px 14px;
  border-radius: 12px;
  background: #000;
  border: 1px solid #222;
  box-sizing: border-box;

  /* --- Efecto Blur --- */
  background: rgba(0, 0, 0, 0.8); /* Negro con 80% de opacidad */
  backdrop-filter: blur(12px); /* El desenfoque */
  -webkit-backdrop-filter: blur(12px); /* Soporte para Safari */
`;

export const Title = styled.span`
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  color: #fff;
  font-size: 0.9rem;
  font-weight: 700;
  letter-spacing: 0.03em;
  pointer-events: none;
`;

export const IconList = styled.div`
  display: flex;
  gap: 8px;
`;

export const LeftIcons = styled(IconList)`
  justify-content: flex-start;
`;

export const RightIcons = styled(IconList)`
  justify-content: flex-end;
`;
