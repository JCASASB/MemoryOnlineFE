import styled from "styled-components";

export const ProfileWrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding: 24px;
  color: #fff;
  gap: 24px;
  height: 100%;
  box-sizing: border-box;
`;

export const UserHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  padding-bottom: 24px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
`;

export const Avatar = styled.div`
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

export const StatGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
`;

export const StatCard = styled.div`
  background: #1a1a1a;
  border: 1px solid rgba(255, 255, 255, 0.08);
  padding: 20px;
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const StatValue = styled.span<{ $color?: string }>`
  font-size: 1.8rem;
  font-weight: 800;
  color: ${({ $color }) => $color || "#fff"};
`;

export const StatLabel = styled.span`
  font-size: 0.75rem;
  color: #888;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-top: 4px;
`;

export const LogoutButton = styled.button`
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

export const PlayerName = styled.h2`
  margin: 0;
`;

export const PlayerSubtitle = styled.span`
  color: #888;
  font-size: 0.9rem;
`;

export const FooterText = styled.div`
  text-align: center;
  color: #444;
  font-size: 0.8rem;
`;
