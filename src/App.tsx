import './App.css';
import { DependencyProvider } from './ui/context/DependencyContext';
import { GameBoard } from './ui/pages/GameBoard';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
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
    </BrowserRouter>
  );
}

export default App;
