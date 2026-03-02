import './App.css';
import { DependencyProvider } from './ui/context/DependencyContext';
import { GameBoard } from './ui/pages/GameBoard';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

function App() {
  return (
    <DependencyProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/level/:level" element={<GameBoard />} />
          <Route path="*" element={<Navigate to="/level/1" replace />} />
        </Routes>
      </BrowserRouter>
    </DependencyProvider>
  );
}

export default App;
