import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { usePlayer } from "../hooks/usePlayer";
import { useUCs } from "../hooks/useUCs";

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

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 14px;
  width: 300px;
`;

const Label = styled.label`
  display: flex;
  flex-direction: column;
  gap: 4px;
  font-size: 0.95rem;
  font-weight: 600;
`;

const Select = styled.select`
  padding: 10px 14px;
  font-size: 1rem;
  border-radius: 8px;
  border: 2px solid #ccc;
  outline: none;
  background: white;
  &:focus {
    border-color: #555;
  }
`;

const Button = styled.button`
  margin-top: 8px;
  padding: 12px;
  font-size: 1.1rem;
  border-radius: 8px;
  border: none;
  background: #333;
  color: white;
  cursor: pointer;
  &:hover {
    background: #555;
  }
`;

export const CreateGame = () => {
  const { playerName } = usePlayer();

  const [nivel, setNivel] = useState("3");
  const navigate = useNavigate();
  const { createGameUC, joinGameUC } = useUCs();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(
      "Creating game with level:",
      nivel,
      "and player name:",
      playerName,
    );
    const trimmedUsuario = playerName.trim();
    if (!trimmedUsuario) return;

    const sala = trimmedUsuario;

    createGameUC(Number(nivel), sala).then(() => {
      joinGameUC(sala, trimmedUsuario).then(() => {
        // Navegar a la sala de juego después de unirse
        navigate(
          `/gameboard?level=${nivel}&gameName=${encodeURIComponent(sala)}`,
        );
      });
    });
  };

  return (
    <Wrapper>
      <Title>Crear partida</Title>
      <Form onSubmit={handleSubmit}>
        <Label>
          Nivel
          <Select value={nivel} onChange={(e) => setNivel(e.target.value)}>
            {[2, 3, 4, 5, 6, 7, 8].map((n) => (
              <option key={n} value={n}>
                Nivel {n}
              </option>
            ))}
          </Select>
        </Label>
        <Button type="submit">Jugar</Button>
      </Form>
    </Wrapper>
  );
};
