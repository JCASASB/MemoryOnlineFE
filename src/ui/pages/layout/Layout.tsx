import { useState, useEffect } from "react";
import { useNavigate, useLocation, Outlet } from "react-router-dom";
import { useDependencies } from "../../context/useDependencies";
import { useConnectionStatus } from "../../hooks/useConnectionStatus";
import { ConnectionStatus } from "../../components/connection/ConnectionStatus";

export const Layout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { connectionStatus } = useConnectionStatus();

  const { chatRepository } = useDependencies();
  const [unreadCount, setUnreadCount] = useState(() =>
    chatRepository.getUnreadCount(),
  );

  const isLoggedIn = connectionStatus === 2;

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

  useEffect(() => {
    chatRepository.setChatViewActive(location.pathname === "/chat");
  }, [chatRepository, location.pathname]);

  useEffect(() => {
    const unsubscribe = chatRepository.subscribeToUnreadCount((count) => {
      setUnreadCount(count);
    });
    return () => {
      if (typeof unsubscribe === "function") unsubscribe();
    };
  }, [chatRepository]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100dvh",
        width: "100vw",
      }}
    >
      <main
        style={{
          flex: 1,
          overflowY: "auto",
          WebkitOverflowScrolling: "touch",
          paddingBottom: "calc(64px + env(safe-area-inset-bottom))",
        }}
      >
        <Outlet />
      </main>

      <nav
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "space-around",
          alignItems: "center",
          height: "calc(64px + env(safe-area-inset-bottom))",
          background: "#000",
          borderTop: "1px solid rgba(255,255,255,0.08)",
          paddingBottom: "env(safe-area-inset-bottom)",
          zIndex: 11,
        }}
      >
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              style={{
                background: "none",
                border: "none",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                color: isActive ? "#1e90ff" : "#fff",
                fontWeight: isActive ? "700" : "400",
                fontSize: 10,
                flex: 1,
                cursor: "pointer",
                position: "relative",
              }}
            >
              {item.icon}
              <span style={{ marginTop: 4 }}>{item.label}</span>

              {item.path === "/chat" && unreadCount > 0 && (
                <Badge>{unreadCount > 99 ? "99+" : unreadCount}</Badge>
              )}

              {/* Mantenemos el ConnectionStatus en el último botón (Sesión/Perfil) */}
              {(item.path === "/login" || item.path === "/profile") && (
                <div
                  style={{ position: "absolute", top: -2, marginLeft: "45px" }}
                >
                  <ConnectionStatus />
                </div>
              )}
            </button>
          );
        })}
      </nav>
    </div>
  );
};

// --- Sub-componentes de iconos para limpiar el código ---
const BoardIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="3" y="3" width="7" height="7" />
    <rect x="14" y="3" width="7" height="7" />
    <rect x="14" y="14" width="7" height="7" />
    <rect x="3" y="14" width="7" height="7" />
  </svg>
);

const PhotosIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="3" y="5" width="18" height="14" rx="2" ry="2" />
    <circle cx="8.5" cy="10.5" r="1.5" />
    <path d="M21 15l-5-5-6 6-2-2-5 5" />
  </svg>
);

const ChatIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
);

const LobbyIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

const ProfileIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const Badge = ({ children }: { children: React.ReactNode }) => (
  <span
    style={{
      position: "absolute",
      top: -2,
      right: "10%",
      background: "#d32f2f",
      color: "#fff",
      borderRadius: 10,
      padding: "0 5px",
      fontSize: 10,
      minWidth: 16,
      fontWeight: "bold",
      border: "2px solid #000",
    }}
  >
    {children}
  </span>
);
