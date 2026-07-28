// PopupChallenge.styles.ts
import styled from "styled-components";

export const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

export const Modal = styled.div`
  background: #fff;
  border-radius: 14px;
  padding: 28px 32px;
  width: 320px;
  display: flex;
  flex-direction: column;
  gap: 18px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.18);
`;

export const Title = styled.h2`
  margin: 0;
  font-size: 1.2rem;
`;

export const GameNameBox = styled.div`
  background: #f0f0f0;
  border-radius: 8px;
  padding: 10px 14px;
  font-size: 0.9rem;
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

export const GameNameLabel = styled.span`
  font-size: 0.75rem;
  color: #888;
  font-weight: 600;
  text-transform: uppercase;
`;

export const GameNameValue = styled.span`
  font-weight: 700;
  font-size: 1rem;
  word-break: break-all;
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

export const Label = styled.label`
  display: flex;
  flex-direction: column;
  gap: 4px;
  font-size: 0.95rem;
  font-weight: 600;
`;

export const Select = styled.select`
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

export const ButtonRow = styled.div`
  display: flex;
  gap: 10px;
  justify-content: flex-end;
`;

export const CancelButton = styled.button`
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

export const CreateButton = styled.button`
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

export const ErrorMsg = styled.p`
  margin: 0;
  color: #b00020;
  font-size: 0.88rem;
`;
