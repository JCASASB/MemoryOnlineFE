import { useState, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import styled from "styled-components";
import { usePlayer } from "../../hooks/usePlayer";
import { useUCs } from "../../hooks/useUCs";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  min-height: calc(100vh - 60px);
  gap: 32px;
`;

const Tabs = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 24px;
`;

const TabButton = styled.button<{ $active: boolean }>`
  padding: 10px 24px;
  border-radius: 8px 8px 0 0;
  border: none;
  background: ${({ $active }) => ($active ? "#333" : "#eee")};
  color: ${({ $active }) => ($active ? "#fff" : "#333")};
  font-weight: 700;
  font-size: 1.1rem;
  cursor: pointer;
  border-bottom: 2px solid ${({ $active }) => ($active ? "#333" : "#eee")};
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

export const GameLobby = () => {
  const { playerName, playerId } = usePlayer();
  const location = useLocation();
  const initialSala = useMemo(() => {
    try {
      const params = new URLSearchParams(location.search);
      return params.get("gameName") || "";
    } catch (e) {
      return "";
    }
  }, [location.search]);

  const [tab, setTab] = useState<"crear" | "unirse">("crear");
  const [nivel, setNivel] = useState("3");
  const [sala, setSala] = useState(initialSala);
  const navigate = useNavigate();
  const { createGameUC, joinGameUC } = useUCs();

  // Crear partida
  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();

    createGameUC(Number(nivel), sala).then(() => {
      joinGameUC(sala, playerName, playerId).then(() => {
        navigate(
          `/gameboard?level=${nivel}&gameName=${encodeURIComponent(sala)}`,
        );
      });
    });
  };

  // Unirse a partida
  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedSala = sala.trim();
    if (!trimmedSala) return;
    navigate(`/gameboard?gameName=${encodeURIComponent(trimmedSala)}`);
    setTimeout(() => {
      joinGameUC(trimmedSala, playerName, playerId).catch((err) =>
        console.error("Error joining game:", err),
      );
    }, 50);
  };

  return (
    <Wrapper>
      <Tabs>
        <TabButton $active={tab === "crear"} onClick={() => setTab("crear")}>
          Crear partida
        </TabButton>
        <TabButton $active={tab === "unirse"} onClick={() => setTab("unirse")}>
          Unirse a partida
        </TabButton>
      </Tabs>
      {tab === "crear" ? (
        <Form onSubmit={handleCreate}>
          <Label>
            Hola {playerName}, quieres crear una sala?
            <Input
              type="text"
              value={sala}
              onChange={(e) => setSala(e.target.value)}
              maxLength={40}
              required
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
          <Button type="submit">Crear y jugar</Button>
        </Form>
      ) : (
        <Form onSubmit={handleJoin}>
          <Label>
            Nombre de sala
            <Input
              type="text"
              placeholder="Ej: sala-1"
              value={sala}
              onChange={(e) => setSala(e.target.value)}
              maxLength={40}
              required
            />
          </Label>

          <Button type="submit">Unirse</Button>
        </Form>
      )}
    </Wrapper>
  );
};
