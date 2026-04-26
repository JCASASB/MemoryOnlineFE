import "./App.css";
import { DependencyProvider } from "./ui/context/DependencyContext";
import { GameBoard } from "./ui/pages/GameBoard";
import { GameLobby } from "./ui/pages/GameLobby";
import { Home } from "./ui/pages/Home";
import { Login } from "./ui/pages/Login";
import { UploadPhotos } from "./ui/pages/UploadPhotos";
import { Chat } from "./ui/pages/Chat";
import { Layout } from "./ui/components/layout/Layout";
import { PrivateRoute } from "./ui/components/PrivateRoute";
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
      <DependencyProvider>
        <HandleExternalLinkRedirect />
        <Routes>
          <Route element={<Layout />}>
            <Route path="/login" element={<Login />} />
            <Route element={<PrivateRoute />}>
              <Route path="/" element={<Home />} />
              <Route path="/lobby" element={<GameLobby />} />
              <Route path="/photos" element={<UploadPhotos />} />
              <Route path="/chat" element={<Chat />} />
              {/* Unirse a partida online */}
              {/* Modo offline (local) */}
              <Route path="/offline" element={<GameBoard />} />
              {/* Modo online multijugador - URL: /online?level=4&gameName=mi-sala */}
              <Route path="/online" element={<GameBoard />} />
            </Route>
          </Route>
        </Routes>
      </DependencyProvider>
    </HashRouter>
  );
}

export default App;
