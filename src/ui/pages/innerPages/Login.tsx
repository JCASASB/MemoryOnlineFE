import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { useDependencies } from "../../context/useDependencies";
import { apiService } from "../../../infrastructure/api/apiService";
import { jwtDecode } from "jwt-decode";

const Page = styled.div`
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

const Card = styled.div`
  width: min(92vw, 420px);
  padding: 32px;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.95);
  box-shadow: 0 24px 60px rgba(0, 0, 0, 0.25);
  text-align: left;
`;

const Title = styled.h1`
  margin: 0 0 8px;
  font-size: 2rem;
  color: #0f172a;
`;

const Subtitle = styled.p`
  margin: 0 0 24px;
  color: #475467;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  font-size: 0.95rem;
  font-weight: 600;
  color: #344054;
`;

const Input = styled.input`
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

const Button = styled.button`
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

const ErrorText = styled.p`
  margin: 0 0 12px;
  color: #b42318;
  font-size: 0.9rem;
`;

export const Login = () => {
  const { onlineRepository, chatRepository } = useDependencies();

  const navigate = useNavigate();
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!user.trim() || !password.trim()) {
      setError("Completa usuario y password para continuar.");
      return;
    }

    setError("");

    try {
      setIsSubmitting(true);

      const response = await apiService.loginUser(user, password);

      const data = response.data as {
        jbearer?: string;
        token?: string;
        authToken?: string;
      };

      const token = data?.jbearer ?? data?.token ?? data?.authToken;

      if (token) {
        try {
          // 2. Decodificar el token
          const decodedToken = jwtDecode(token);

          onlineRepository.setAuthToken(token);
          onlineRepository.savePlayerId(decodedToken.sub || user.trim());
          onlineRepository.savePlayerName(user.trim());

          await Promise.all([
            onlineRepository.connectHub(),
            chatRepository.connect(),
          ]);

          navigate("/");
        } catch (error) {
          console.error("Error al decodificar el token:", error);
        }
      } else {
        setError("La API no devolvio un token de autenticacion.");
        return;
      }
    } catch (requestError) {
      if (axios.isAxiosError(requestError)) {
        const apiMessage =
          typeof requestError.response?.data === "string"
            ? requestError.response.data
            : "Usuario o password invalidos.";
        setError(apiMessage);
      } else {
        setError("No fue posible iniciar sesion.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Page>
      <Card>
        <Title>Iniciar sesion</Title>
        <Subtitle>Accede para guardar tu progreso y jugar online.</Subtitle>

        <form onSubmit={handleSubmit}>
          <Label htmlFor="user">Usuario</Label>
          <Input
            id="user"
            type="text"
            value={user}
            onChange={(event) =>
              setUser(event.target.value.toLowerCase().trim())
            }
            placeholder="tu_usuario"
            autoComplete="username"
          />

          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(event) =>
              setPassword(event.target.value.toLowerCase().trim())
            }
            placeholder="******"
            autoComplete="current-password"
          />

          {error ? <ErrorText>{error}</ErrorText> : null}

          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Entrando..." : "Entrar"}
          </Button>
        </form>
      </Card>
    </Page>
  );
};
