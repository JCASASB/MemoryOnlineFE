import styled from "styled-components";

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  min-height: calc(100vh - 60px);
  padding: 20px;
  box-sizing: border-box;
  gap: 16px;
`;

export const Title = styled.h1`
  margin: 0;
`;

export const Messages = styled.div`
  flex: 1;
  min-height: 220px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 12px;
  background: #f7f7f7;
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const Input = styled.textarea`
  min-height: 60px;
  resize: vertical;
  padding: 12px;
  border-radius: 10px;
  border: 2px solid #ccc;
  font-size: 1rem;
  font-family: inherit;
`;

export const Button = styled.button`
  width: fit-content;
  padding: 10px 16px;
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
`;

export const Message = styled.p<{ $error?: boolean }>`
  margin: 0;
  color: ${({ $error }) => ($error ? "#b00020" : "#1f7a1f")};
`;
