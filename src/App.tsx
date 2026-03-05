import './App.css';
import { DependencyProvider } from './ui/context/DependencyContext';
import { GameBoard } from './ui/pages/GameBoard';
import { HashRouter, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <HashRouter>
      <Routes>
        {/* Modo offline (local) */}
        <Route path="/" element={
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
