import "./App.css";
import { DependencyProvider } from "./ui/context/DependencyContext";
import { GameBoard } from "./ui/pages/innerPages/GameBoard";
import { GameLobby } from "./ui/pages/innerPages/GameLobby";
import { Home } from "./ui/pages/innerPages/Home";
import { Login } from "./ui/pages/innerPages/Login";
import { UploadPhotos } from "./ui/pages/innerPages/UploadPhotos";
import { Chat } from "./ui/pages/innerPages/Chat";
import { PrivateRoute } from "./ui/components/PrivateRoute";
import { HashRouter, Routes, Route, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Profile } from "./ui/pages/innerPages/Profile";
import { Layout } from "./ui/pages/layout/Layout";

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
              <Route path="/gameboard" element={<GameBoard />} />
              <Route path="/profile" element={<Profile />} />
            </Route>
          </Route>
        </Routes>
      </DependencyProvider>
    </HashRouter>
  );
}

export default App;
