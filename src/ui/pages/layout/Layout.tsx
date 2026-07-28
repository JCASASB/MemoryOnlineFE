import { useNavigate, useLocation, Outlet } from "react-router-dom";
import { useConnectionStatus } from "../../hooks/useConnectionStatus";
import { ConnectionStatus } from "../../components/connection/ConnectionStatus";
import { BadgeNewChatMessage } from "../../components/badgeNewChatMessage/BadgeNewChatMessage";
import {
  LayoutContainer,
  MainContent,
  BottomNav,
  NavButton,
  NavLabel,
  BoardIcon,
  PhotosIcon,
  ChatIcon,
  LobbyIcon,
  ProfileIcon,
} from "./Layout.styles";

export const Layout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const connectionStatus = useConnectionStatus();

  const isLoggedIn = connectionStatus === 2;

  const PROTECTED_ROUTES = [
    "/gameboard",
    "/photos",
    "/lobby",
    "/chat",
    "/profile",
  ];

  const canAccess = (path: string): boolean => {
    if (PROTECTED_ROUTES.includes(path)) return isLoggedIn;
    return true;
  };

  // Definimos los items dentro para poder reaccionar al estado de login
  const navItems = [
    { label: "Board", path: "/gameboard", icon: <BoardIcon /> },
    { label: "Fotos", path: "/photos", icon: <PhotosIcon /> },
    { label: "Chat", path: "/chat", icon: <ChatIcon /> },
    { label: "Lobby", path: "/lobby", icon: <LobbyIcon /> },
    {
      // Cambio dinámico: si está logueado muestra Perfil, si no Sesión
      label: isLoggedIn ? "Perfil" : "Sesión",
      path: isLoggedIn ? "/profile" : "/login",
      icon: <ProfileIcon />,
    },
  ];

  return (
    <LayoutContainer>
      <MainContent>
        <Outlet />
      </MainContent>

      <BottomNav>
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <NavButton
              key={item.path}
              onClick={() => canAccess(item.path) && navigate(item.path)}
              disabled={!canAccess(item.path)}
              $isActive={isActive}
              $canAccess={canAccess(item.path)}
            >
              {item.icon}
              <NavLabel>{item.label}</NavLabel>

              {item.path === "/chat" && (
                <BadgeNewChatMessage location={location.pathname} />
              )}

              {/* Mantenemos el ConnectionStatus en el último botón (Sesión/Perfil) */}
              {(item.path === "/login" || item.path === "/profile") && (
                <ConnectionStatus />
              )}
            </NavButton>
          );
        })}
      </BottomNav>
    </LayoutContainer>
  );
};
