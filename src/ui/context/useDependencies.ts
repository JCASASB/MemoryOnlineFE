import { useContext } from 'react';
import { DependencyContext } from './DependencyContextInstance';

export const useDependencies = () => useContext(DependencyContext);
