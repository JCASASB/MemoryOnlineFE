import styled from "styled-components";

export const LayoutContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100dvh;
  width: 100vw;
`;

export const MainContent = styled.main`
  flex: 1;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  padding-bottom: calc(64px + env(safe-area-inset-bottom));
`;

export const BottomNav = styled.nav`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-around;
  align-items: center;
  height: calc(64px + env(safe-area-inset-bottom));
  background: #000;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  padding-bottom: env(safe-area-inset-bottom);
  z-index: 11;
`;

export const NavButton = styled.button<{
  $isActive: boolean;
  $canAccess: boolean;
}>`
  background: none;
  border: none;
  display: flex;
  flex-direction: column;
  align-items: center;
  color: ${({ $isActive, $canAccess }) =>
    $isActive ? "#1e90ff" : $canAccess ? "#fff" : "#555"};
  font-weight: ${({ $isActive }) => ($isActive ? "700" : "400")};
  font-size: 10px;
  flex: 1;
  cursor: ${({ $canAccess }) => ($canAccess ? "pointer" : "not-allowed")};
  position: relative;
  opacity: ${({ $canAccess }) => ($canAccess ? 1 : 0.4)};
`;

export const NavLabel = styled.span`
  margin-top: 4px;
`;

const BaseIcon = styled.svg.attrs({
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: "2",
  strokeLinecap: "round",
  strokeLinejoin: "round",
})`
  width: 24px;
  height: 24px;
`;

export const BoardIcon = () => (
  <BaseIcon>
    <rect x="3" y="3" width="7" height="7" />
    <rect x="14" y="3" width="7" height="7" />
    <rect x="14" y="14" width="7" height="7" />
    <rect x="3" y="14" width="7" height="7" />
  </BaseIcon>
);

export const PhotosIcon = () => (
  <BaseIcon>
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <circle cx="8.5" cy="8.5" r="1.5" />
    <path d="M21 15l-5-5L5 21" />
  </BaseIcon>
);

export const ChatIcon = () => (
  <BaseIcon>
    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7A8.38 8.38 0 0 1 4 11.5a8.5 8.5 0 0 1 17 0z" />
  </BaseIcon>
);

export const LobbyIcon = () => (
  <BaseIcon>
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </BaseIcon>
);

export const ProfileIcon = () => (
  <BaseIcon>
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </BaseIcon>
);
