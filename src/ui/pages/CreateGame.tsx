import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { usePlayer } from "../hooks/usePlayer";
import { useUCs } from "../hooks/useUCs";

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
  const { playerName, savePlayerName } = usePlayer();
  const [sala, setSala] = useState("");
  const [usuario, setUsuario] = useState(playerName);
  const [nivel, setNivel] = useState("3");
  const navigate = useNavigate();
  const startedRef = useRef(false);
  const { createGameUC } = useUCs();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedSala = sala.trim();
    const trimmedUsuario = usuario.trim();
    if (!trimmedSala || !trimmedUsuario) return;
    savePlayerName(trimmedUsuario);

    if (!startedRef.current) {
      createGameUC(Number(nivel), trimmedSala, trimmedUsuario);
      startedRef.current = true;
    }

    navigate(
      `/online?level=${nivel}&gameName=${encodeURIComponent(trimmedSala)}`,
    );
  };

  return (
    <Wrapper>
      <Title>Crear partida</Title>
      <Form onSubmit={handleSubmit}>
        <Label>
          Usuario
          <Input
            type="text"
            placeholder="Tu nombre"
            value={usuario}
            onChange={(e) => setUsuario(e.target.value)}
            maxLength={20}
            autoFocus
          />
        </Label>
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
