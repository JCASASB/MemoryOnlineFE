import { useState, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
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

const Input = styled.input`
  padding: 10px 14px;
  font-size: 1rem;
  border-radius: 8px;
  border: 2px solid #ccc;
  outline: none;
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

export const JoinGame = () => {
  const { playerName, savePlayerName } = usePlayer();
  const location = useLocation();
  const initialSala = useMemo(() => {
    try {
      const params = new URLSearchParams(location.search);
      return params.get("gameName") || "";
    } catch (e) {
      return "";
    }
  }, [location.search]);

  const [sala, setSala] = useState(initialSala);
  const [usuario] = useState(playerName);
  const navigate = useNavigate();
  const { joinGameUC } = useUCs();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedSala = sala.trim();
    const trimmedUsuario = usuario.trim();

    if (!trimmedSala || !trimmedUsuario) return;

    // Guardar nombre localmente y navegar de inmediato.
    savePlayerName(trimmedUsuario);

    navigate(`/gameboard?gameName=${encodeURIComponent(trimmedSala)}`);

    // Ejecutar join después de la navegación en un tick para evitar que
    // la llamada al hub ocurra antes de que la ruta cambie.
    setTimeout(() => {
      joinGameUC(trimmedSala, trimmedUsuario).catch((err) =>
        console.error("Error joining game:", err),
      );
    }, 50);
  };

  return (
    <Wrapper>
      <Title>Unirse a partida</Title>
      <Form onSubmit={handleSubmit}>
        <Label>
          Nombre de sala
          <Input
            type="text"
            placeholder="Ej: sala-1"
            value={sala}
            onChange={(e) => setSala(e.target.value)}
            maxLength={40}
          />
        </Label>
        <Button type="submit">Unirse</Button>
      </Form>
    </Wrapper>
  );
};
