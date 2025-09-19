import { useContext } from 'react';
import ToolsContext from '@contexts/ToolsContext';

export const useTools = () => {
  const context = useContext(ToolsContext);

  if (!context) {
    throw new Error('useTools must be used within a ToolsProvider');
  }

  return context;
};