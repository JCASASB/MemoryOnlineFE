// Home.styles.ts
import styled from "styled-components";

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  min-height: calc(100vh - 60px);
  gap: 24px;
`;

export const Title = styled.h1`
  margin: 0;
`;

export const Welcome = styled.p`
  margin: 0;
  font-size: 1.05rem;
`;

export const UserName = styled.span`
  font-weight: 700;
`;
