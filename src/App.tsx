import "./App.css";
import { DependencyProvider } from "./ui/context/DependencyContext";
import { GameBoard } from "./ui/pages/GameBoard";
import { CreateGame } from "./ui/pages/CreateGame";
import { JoinGame } from "./ui/pages/JoinGame";
import { Home } from "./ui/pages/Home";
import { HashRouter, Routes, Route, useNavigate } from "react-router-dom";
import { useEffect } from "react";

function HandleExternalLinkRedirect() {
  const navigate = useNavigate();

  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const name = params.get("gameName");
      if (name) {
        navigate(`/join?gameName=${encodeURIComponent(name)}`);
      }
    } catch (e) {
      // ignore
    }
  }, [navigate]);

  return null;
}

function App() {
  return (
    <HashRouter>
      <HandleExternalLinkRedirect />
      <Routes>
        <Route path="/" element={<Home />} />
        {/* Home */}
        {/* Iniciar partida online */}
        <Route
          path="/create"
          element={
            <DependencyProvider>
              <CreateGame />
            </DependencyProvider>
          }
        />
        {/* Unirse a partida online */}
        <Route
          path="/join"
          element={
            <DependencyProvider>
              <JoinGame />
            </DependencyProvider>
          }
        />
        {/* Modo offline (local) */}
        <Route
          path="/offline"
          element={
            <DependencyProvider>
              <GameBoard />
            </DependencyProvider>
          }
        />
        {/* Modo online multijugador - URL: /online?level=4&gameName=mi-sala */}
        <Route
          path="/online"
          element={
            <DependencyProvider online={true}>
              <GameBoard />
            </DependencyProvider>
          }
        />
      </Routes>
    </HashRouter>
  );
}

export default App;
