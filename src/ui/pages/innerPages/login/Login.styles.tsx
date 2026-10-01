// Login.styles.ts
import styled from "styled-components";

export const Page = styled.div`
  min-height: calc(100vh - 60px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  background:
    radial-gradient(
      circle at 10% 20%,
      rgba(255, 185, 110, 0.2),
      transparent 35%
    ),
    radial-gradient(
      circle at 90% 80%,
      rgba(82, 168, 255, 0.18),
      transparent 42%
    ),
    linear-gradient(135deg, #101828 0%, #1d2939 55%, #344054 100%);
`;

export const Card = styled.div`
  width: min(92vw, 420px);
  padding: 32px;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.95);
  box-shadow: 0 24px 60px rgba(0, 0, 0, 0.25);
  text-align: left;
`;

export const Version = styled.label`
  display: flex;
  width: 100%;
  text-align: center;
  font-size: 0.75rem;
  color: rgb(10, 38, 78);
`;

export const Title = styled.h1`
  margin: 0 0 8px;
  font-size: 2rem;
  color: #0f172a;
`;

export const Subtitle = styled.p`
  margin: 0 0 24px;
  color: #475467;
`;

export const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  font-size: 0.95rem;
  font-weight: 600;
  color: #344054;
`;

export const Input = styled.input`
  width: 100%;
  box-sizing: border-box;
  border: 1px solid #d0d5dd;
  border-radius: 10px;
  padding: 12px 14px;
  font-size: 1rem;
  margin-bottom: 16px;

  &:focus {
    border-color: #1570ef;
    outline: 2px solid rgba(21, 112, 239, 0.25);
    outline-offset: 1px;
  }
`;

export const Button = styled.button`
  width: 100%;
  border: none;
  border-radius: 10px;
  padding: 12px 14px;
  font-size: 1rem;
  font-weight: 700;
  color: #ffffff;
  background: linear-gradient(135deg, #1570ef 0%, #1849a9 100%);
  cursor: pointer;

  &:hover {
    filter: brightness(1.05);
  }
`;

export const ErrorText = styled.p`
  margin: 0 0 12px;
  color: #b42318;
  font-size: 0.9rem;
`;
