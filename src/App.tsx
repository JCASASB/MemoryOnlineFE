import './App.css';
import { DependencyProvider } from './ui/context/DependencyContext';
import { GameBoard } from './ui/pages/GameBoard';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <DependencyProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<GameBoard />} />
        </Routes>
      </BrowserRouter>
    </DependencyProvider>
  );
}

export default App;
