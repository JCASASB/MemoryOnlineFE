import styled from "styled-components";
import { useMemo } from "react";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  min-height: calc(100vh - 60px);
  gap: 24px;
`;

const Title = styled.h1`
  margin: 0;
`;

const Welcome = styled.p`
  margin: 0;
  font-size: 1.05rem;
`;

const UserName = styled.span`
  font-weight: 700;
`;

export const Home = () => {
  const userName = useMemo(
    () => localStorage.getItem("playerName")?.trim() ?? "",
    [],
  );

  return (
    <Wrapper>
      <Title>Memory Online</Title>
      <Welcome>
        Bienvenido
        {userName ? (
          <>
            , <UserName>{userName}</UserName>
          </>
        ) : (
          ""
        )}
        .
      </Welcome>
    </Wrapper>
  );
};
