import React, { createContext, useCallback, useState } from 'react';
import type { ReactNode } from 'react';
import { DATA_TOOLS } from '@domain/tools';
import type { DataTool, ToolsState } from '@domain/tools';

interface ToolsContextValue extends ToolsState {
  toggleTool: (toolId: string) => void;
  openToolsModal: () => void;
  closeToolsModal: () => void;
  getSelectedToolsData: () => DataTool[];
}

const ToolsContext = createContext<ToolsContextValue | undefined>(undefined);

interface ToolsProviderProps {
  children: ReactNode;
}

export const ToolsProvider: React.FC<ToolsProviderProps> = ({ children }) => {
  const [selectedTools, setSelectedTools] = useState<string[]>([]);
  const [isToolsModalOpen, setIsToolsModalOpen] = useState(false);

  const toggleTool = useCallback((toolId: string): void => {
    setSelectedTools(prev =>
      prev.includes(toolId)
        ? prev.filter(id => id !== toolId)
        : [...prev, toolId]
    );
  }, []);

  const openToolsModal = useCallback((): void => {
    setIsToolsModalOpen(true);
  }, []);

  const closeToolsModal = useCallback((): void => {
    setIsToolsModalOpen(false);
  }, []);

  const getSelectedToolsData = useCallback((): DataTool[] => {
    return DATA_TOOLS.filter(tool => selectedTools.includes(tool.id));
  }, [selectedTools]);

  const value: ToolsContextValue = {
    selectedTools,
    availableTools: DATA_TOOLS,
    isToolsModalOpen,
    toggleTool,
    openToolsModal,
    closeToolsModal,
    getSelectedToolsData
  };

  return <ToolsContext.Provider value={value}>{children}</ToolsContext.Provider>;
};

export { ToolsContext };
export default ToolsContext;