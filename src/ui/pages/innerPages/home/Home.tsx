// Home.tsx
import { usePlayer } from "../../../hooks/usePlayer";
import * as S from "./Home.styles"; // <-- Importación de los estilos agregada

export const Home = () => {
  const { playerName } = usePlayer();

  return (
    <S.Wrapper>
      <S.Title>Memory Online</S.Title>
      <S.Welcome>
        Bienvenido
        {playerName ? (
          <>
            , <S.UserName>{playerName}</S.UserName>
          </>
        ) : (
          ""
        )}
        .
      </S.Welcome>
    </S.Wrapper>
  );
};
