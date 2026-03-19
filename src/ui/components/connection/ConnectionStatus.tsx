import { useGame } from "../../hooks/useGame";

type ConnState = "connected" | "connecting" | "disconnected";

export const ConnectionStatus = () => {
  const { connectionStatus } = useGame();

  const color =
    connectionStatus === 2
      ? "#28a745"
      : connectionStatus === 1 || connectionStatus === 4
        ? "#ffc107"
        : "#dc3545";

  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
      <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden>
        <circle cx="6" cy="6" r="6" fill={color} />
      </svg>
      <span style={{ fontSize: 12, color: "#333" }}>{status}</span>
    </div>
  );
};
