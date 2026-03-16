import './App.css';
import { DependencyProvider } from './ui/context/DependencyContext';
import { GameBoard } from './ui/pages/GameBoard';
import { CreateGame } from './ui/pages/CreateGame';
import { JoinGame } from './ui/pages/JoinGame';
import { Home } from './ui/pages/Home';
import { HashRouter, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        {/* Home */}
        {/* Iniciar partida online */}
        <Route path="/create" element={<DependencyProvider><CreateGame /></DependencyProvider>} />
        {/* Unirse a partida online */}
        <Route path="/join" element={<DependencyProvider><JoinGame /></DependencyProvider>} />
        {/* Modo offline (local) */}
        <Route path="/offline" element={
          <DependencyProvider>
            <GameBoard />
          </DependencyProvider>
        } />
        {/* Modo online multijugador - URL: /online?level=4&gameId=mi-sala */}
        <Route path="/online" element={
          <DependencyProvider online={true}>
            <GameBoard />
          </DependencyProvider>
        } />
      </Routes>
    </HashRouter> 
  );
}

export default App;
