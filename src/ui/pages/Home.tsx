import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100vw;
  height: 100vh;
  gap: 24px;
`;

const Title = styled.h1`
  margin: 0;
`;

const Button = styled.button`
  width: 240px;
  padding: 14px;
  font-size: 1.1rem;
  border-radius: 8px;
  border: none;
  background: #333;
  color: white;
  cursor: pointer;
  &:hover { background: #555; }
`;

export const Home = () => {
  const navigate = useNavigate();

  return (
    <Wrapper>
      <Title>Memory Online</Title>
      <Button onClick={() => navigate('/create')}>Crear partida</Button>
      <Button onClick={() => navigate('/join')}>Unirse a partida</Button>
    </Wrapper>
  );
};
