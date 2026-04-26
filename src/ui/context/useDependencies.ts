import { useContext } from 'react';
import { DependencyContext } from './DependencyContextInstance';

export const useDependencies = () => {
  const context = useContext(DependencyContext);
  if (!context) {
    throw new Error('useDependencies must be used within a DependencyProvider');
  }
  return context;
};
