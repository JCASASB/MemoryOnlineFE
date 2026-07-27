import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { usePlayer } from "../../hooks/usePlayer";
import { useUCs } from "../../hooks/useUCs";

const ADJECTIVES = [
  "rapido",
  "furioso",
  "astuto",
  "veloz",
  "feroz",
  "noble",
  "bravo",
  "listo",
  "audaz",
  "fiero",
];
const NOUNS = [
  "leon",
  "tigre",
  "aguila",
  "lobo",
  "zorro",
  "oso",
  "puma",
  "halcon",
  "jaguar",
  "cobra",
];

const generateGameName = () => {
  const adj = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
  const noun = NOUNS[Math.floor(Math.random() * NOUNS.length)];
  const num = Math.floor(Math.random() * 9000) + 1000;
  return `${adj}-${noun}-${num}`;
};

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const Modal = styled.div`
  background: #fff;
  border-radius: 14px;
  padding: 28px 32px;
  width: 320px;
  display: flex;
  flex-direction: column;
  gap: 18px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.18);
`;

const Title = styled.h2`
  margin: 0;
  font-size: 1.2rem;
`;

const GameNameBox = styled.div`
  background: #f0f0f0;
  border-radius: 8px;
  padding: 10px 14px;
  font-size: 0.9rem;
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const GameNameLabel = styled.span`
  font-size: 0.75rem;
  color: #888;
  font-weight: 600;
  text-transform: uppercase;
`;

const GameNameValue = styled.span`
  font-weight: 700;
  font-size: 1rem;
  word-break: break-all;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 14px;
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

const ButtonRow = styled.div`
  display: flex;
  gap: 10px;
  justify-content: flex-end;
`;

const CancelButton = styled.button`
  padding: 10px 18px;
  border-radius: 8px;
  border: 2px solid #ccc;
  background: #fff;
  font-weight: 600;
  cursor: pointer;
  &:hover {
    background: #f5f5f5;
  }
`;

const CreateButton = styled.button`
  padding: 10px 18px;
  border-radius: 8px;
  border: none;
  background: #333;
  color: #fff;
  font-weight: 700;
  cursor: pointer;
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  &:hover:not(:disabled) {
    background: #555;
  }
`;

const ErrorMsg = styled.p`
  margin: 0;
  color: #b00020;
  font-size: 0.88rem;
`;

type PopupChallengeProps = {
  opponentName: string;
  opponentIdPlayer: string;
  onClose: () => void;
};

export const PopupChallenge = ({
  opponentName,
  opponentIdPlayer,
  onClose,
}: PopupChallengeProps) => {
  const navigate = useNavigate();
  const { createMatchUC, createChallengeUC } = useUCs();
  const { playerId } = usePlayer();

  const [gameName] = useState(generateGameName);
  const [level, setLevel] = useState("3");
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState("");

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreating(true);
    setError("");

    try {
      const match = await createMatchUC(Number(level), gameName);

      await createChallengeUC(match.id, playerId, opponentIdPlayer);

      navigate(
        `/gameboard?level=${level}&gameName=${encodeURIComponent(gameName)}`,
      );
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Error al crear la partida.",
      );
      setIsCreating(false);
    }
  };

  return (
    <Overlay onClick={onClose}>
      <Modal onClick={(e) => e.stopPropagation()}>
        <Title>Retar a {opponentName}</Title>
        <GameNameBox>
          <GameNameLabel>Sala</GameNameLabel>
          <GameNameValue>{gameName}</GameNameValue>
        </GameNameBox>
        <Form onSubmit={handleCreate}>
          <Label>
            Nivel
            <Select value={level} onChange={(e) => setLevel(e.target.value)}>
              {[2, 3, 4, 5, 6, 7, 8].map((n) => (
                <option key={n} value={n}>
                  Nivel {n}
                </option>
              ))}
            </Select>
          </Label>
          <ButtonRow>
            <CancelButton type="button" onClick={onClose}>
              Cancelar
            </CancelButton>
            <CreateButton type="submit" disabled={isCreating}>
              {isCreating ? "Creando..." : "Crear partida"}
            </CreateButton>
          </ButtonRow>
        </Form>
        {error && <ErrorMsg>{error}</ErrorMsg>}
      </Modal>
    </Overlay>
  );
};
