import { createRoot } from 'react-dom/client';
import './index.css';
import { DependencyProvider } from './ui/context/DependencyContext';
import { GameBoard } from './ui/pages/GameBoard';

createRoot(document.getElementById('root')!).render(
  <DependencyProvider>
    <GameBoard />
  </DependencyProvider>
);
