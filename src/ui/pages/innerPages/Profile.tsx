import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { usePlayer } from "../../hooks/usePlayer";
import type { PlayerStats } from "./PlayerStats";

const STATS_URL = import.meta.env.VITE_LOGIN_URL + "/api/profiles/stats"; // Tu URL de .NET

const ProfileWrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding: 24px;
  color: #fff;
  gap: 24px;
  height: 100%;
  box-sizing: border-box;
`;

const UserHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  padding-bottom: 24px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
`;

const Avatar = styled.div`
  width: 64px;
  height: 64px;
  background: #1e90ff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-weight: bold;
  box-shadow: 0 4px 12px rgba(30, 144, 255, 0.3);
`;

const StatGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
`;

const StatCard = styled.div`
  background: #1a1a1a;
  border: 1px solid rgba(255, 255, 255, 0.08);
  padding: 20px;
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const StatValue = styled.span<{ $color?: string }>`
  font-size: 1.8rem;
  font-weight: 800;
  color: ${({ $color }) => $color || "#fff"};
`;

const StatLabel = styled.span`
  font-size: 0.75rem;
  color: #888;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-top: 4px;
`;

const LogoutButton = styled.button`
  margin-top: auto;
  padding: 16px;
  background: rgba(232, 65, 24, 0.1);
  color: #e84118;
  border: 1px solid #e84118;
  border-radius: 12px;
  font-weight: 700;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s ease;

  &:active {
    background: #e84118;
    color: #fff;
    transform: scale(0.98);
  }
`;

export const Profile = () => {
  const navigate = useNavigate();
  const { playerName, logout } = usePlayer();
  const [stats, setStats] = useState<PlayerStats | null>(null);
  const [loading, setLoading] = useState(true);

  const playerId = playerName || ""; // Asegúrate de que playerName no sea undefined

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch(`${STATS_URL}/${playerId}`);
        if (!response.ok) throw new Error("Error en la petición");
        const data = await response.json();
        setStats(data);
      } catch (error) {
        console.error("Error cargando estadísticas del backend:", error);
      } finally {
        setLoading(false);
      }
    };

    if (playerName) {
      fetchStats();
    }
  }, [playerName]);

  const handleLogout = async () => {
    if (window.confirm("¿Estás seguro de que quieres cerrar sesión?")) {
      await logout?.(); // Ejecuta la limpieza de tokens e IndexedDB
      navigate("/login");
    }
  };

  if (loading) {
    return <ProfileWrapper>Cargando estadísticas...</ProfileWrapper>;
  }

  return (
    <ProfileWrapper>
      <UserHeader>
        <Avatar>{playerName?.charAt(0).toUpperCase()}</Avatar>
        <div>
          <h2 style={{ margin: 0 }}>{playerName}</h2>
          <span style={{ color: "#888", fontSize: "0.9rem" }}>
            Jugador Activo
          </span>
        </div>
      </UserHeader>

      <StatGrid>
        <StatCard>
          <StatValue $color="#4cd137">{stats?.wins || 0}</StatValue>
          <StatLabel>Victorias</StatLabel>
        </StatCard>

        <StatCard>
          <StatValue $color="#e84118">{stats?.losses || 0}</StatValue>
          <StatLabel>Derrotas</StatLabel>
        </StatCard>

        <StatCard style={{ gridColumn: "span 2" }}>
          <StatValue $color="#00a8ff">
            {stats?.averageScore.toFixed(1) || "0.0"}
          </StatValue>
          <StatLabel>Promedio de Puntuación</StatLabel>
        </StatCard>
      </StatGrid>

      <div style={{ textAlign: "center", color: "#444", fontSize: "0.8rem" }}>
        Total de partidas registradas: {stats?.totalGames || 0}
      </div>

      <LogoutButton onClick={handleLogout}>Cerrar Sesión</LogoutButton>
    </ProfileWrapper>
  );
};
