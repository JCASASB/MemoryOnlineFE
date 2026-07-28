// GameBoard.styles.ts
import styled from "styled-components";

export const BoardWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  /* Eliminamos el min-height fijo para que fluya con el scroll del Layout */
  padding: 12px;
  box-sizing: border-box;
`;

// Contenedor para fijar el ScoreBoard
export const StickyHeader = styled.div`
  position: sticky;
  top: 0;
  z-index: 10;
  padding-bottom: 8px;
  margin: -12px -12px 0 -12px; /* Compensa el padding del BoardWrapper */
  padding: 12px 12px 8px 12px;
`;

export const Header = styled.h1`
  margin: 16px 0;
  flex-shrink: 0;
  color: #fff;
  font-size: 1.5rem;
`;

export const Grid = styled.div<{ $columns: number }>`
  flex: 1;
  display: grid;
  grid-template-columns: repeat(${({ $columns }) => $columns}, 1fr);
  gap: 12px;
  align-content: center;
  justify-items: center;
  margin-top: 16px;
`;

export const WaitingMessage = styled.div`
  text-align: center;
`;
