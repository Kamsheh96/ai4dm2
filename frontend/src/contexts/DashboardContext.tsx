import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import type {
  Notification,
  Assessment,
  WorkstreamContext,
  Draft,
  KnowledgeBase
} from '@domain/models';

interface DashboardContextValue {
  // Notifications
  notifications: Notification[];
  unreadCount: number;
  addNotification: (notification: Omit<Notification, 'id' | 'read'>) => void;
  markAsRead: (notificationId: string) => void;
  clearNotification: (notificationId: string) => void;
  clearAllNotifications: () => void;

  // Assessments
  assessments: Assessment[];
  addAssessment: (assessment: Omit<Assessment, 'id'>) => void;
  updateAssessmentStatus: (assessmentId: string, status: Assessment['status']) => void;
  getUpcomingAssessments: () => Assessment[];

  // Workstream Management
  selectedWorkstream: string | null;
  setSelectedWorkstream: (workstreamId: string | null) => void;
  workstreamContexts: Map<string, WorkstreamContext>;
  getWorkstreamContext: (workstreamId: string) => WorkstreamContext | undefined;
  saveWorkstreamContext: (context: WorkstreamContext) => void;

  // Drafts
  getDraftsForWorkstream: (workstreamId: string) => Draft[];
  saveDraft: (draft: Draft) => void;
  deleteDraft: (draftId: string) => void;

  // Knowledge Bases
  knowledgeBases: KnowledgeBase[];
  addKnowledgeBase: (kb: Omit<KnowledgeBase, 'id' | 'connected' | 'status'>) => void;
  removeKnowledgeBase: (kbId: string) => void;
  connectKnowledgeBase: (kbId: string) => Promise<void>;
  disconnectKnowledgeBase: (kbId: string) => void;
}

const DashboardContext = createContext<DashboardContextValue | undefined>(undefined);

const STORAGE_KEYS = {
  NOTIFICATIONS: 'ai4dm_notifications',
  ASSESSMENTS: 'ai4dm_assessments',
  WORKSTREAM_CONTEXTS: 'ai4dm_workstream_contexts',
  SELECTED_WORKSTREAM: 'ai4dm_selected_workstream',
  KNOWLEDGE_BASES: 'ai4dm_knowledge_bases'
};

// Helper to safely parse localStorage with fallback
function loadFromStorage<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(key);
    if (item) {
      const parsed = JSON.parse(item);
      // Handle date deserialization
      return parsed;
    }
  } catch (error) {
    console.error(`Error loading ${key} from storage:`, error);
  }
  return defaultValue;
}

// Helper to safely save to localStorage
function saveToStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error saving ${key} to storage:`, error);
  }
}

// Generate mock notifications
function generateMockNotifications(): Notification[] {
  const now = new Date();
  return [
    {
      id: 'notif-1',
      type: 'email',
      title: 'New Email from PMO Director',
      message: 'Review of Q4 data quality metrics requested',
      timestamp: new Date(now.getTime() - 2 * 60 * 60 * 1000), // 2 hours ago
      sender: 'PMO Director',
      priority: 'high',
      read: false
    },
    {
      id: 'notif-2',
      type: 'assessment',
      title: 'DQ Assessment Due Soon',
      message: 'PMO Data Quality Assessment due in 7 days',
      timestamp: new Date(now.getTime() - 24 * 60 * 60 * 1000), // 1 day ago
      source: 'Assessment System',
      priority: 'high',
      read: false
    },
    {
      id: 'notif-3',
      type: 'update',
      title: 'Workstream Progress Update',
      message: 'Data Strategy Document reached 30% completion',
      timestamp: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
      source: 'System',
      priority: 'medium',
      read: true
    }
  ];
}

// Generate mock assessments
function generateMockAssessments(): Assessment[] {
  const now = new Date();
  return [
    {
      id: 'assess-1',
      title: 'PMO Data Quality Assessment',
      type: 'data_quality',
      dueDate: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000), // 7 days
      status: 'in_progress',
      assignedTo: 'Current User',
      workstreamId: 'dq-pmo',
      priority: 'high'
    },
    {
      id: 'assess-2',
      title: 'GDPR Compliance Review',
      type: 'compliance',
      dueDate: new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000), // 14 days
      status: 'not_started',
      assignedTo: 'Current User',
      workstreamId: 'rca',
      priority: 'high'
    },
    {
      id: 'assess-3',
      title: 'Data Governance Framework Review',
      type: 'governance',
      dueDate: new Date(now.getTime() + 21 * 24 * 60 * 60 * 1000), // 21 days
      status: 'not_started',
      assignedTo: 'Current User',
      priority: 'medium'
    }
  ];
}

export const DashboardProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>(() =>
    loadFromStorage(STORAGE_KEYS.NOTIFICATIONS, generateMockNotifications())
  );

  const [assessments, setAssessments] = useState<Assessment[]>(() =>
    loadFromStorage(STORAGE_KEYS.ASSESSMENTS, generateMockAssessments())
  );

  const [selectedWorkstream, setSelectedWorkstreamState] = useState<string | null>(() =>
    loadFromStorage(STORAGE_KEYS.SELECTED_WORKSTREAM, null)
  );

  const [workstreamContexts, setWorkstreamContexts] = useState<Map<string, WorkstreamContext>>(() => {
    const stored = loadFromStorage<Record<string, WorkstreamContext>>(STORAGE_KEYS.WORKSTREAM_CONTEXTS, {});
    return new Map(Object.entries(stored));
  });

  const [knowledgeBases, setKnowledgeBases] = useState<KnowledgeBase[]>(() =>
    loadFromStorage(STORAGE_KEYS.KNOWLEDGE_BASES, [])
  );

  // Auto-save to localStorage
  useEffect(() => {
    saveToStorage(STORAGE_KEYS.NOTIFICATIONS, notifications);
  }, [notifications]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.ASSESSMENTS, assessments);
  }, [assessments]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.SELECTED_WORKSTREAM, selectedWorkstream);
  }, [selectedWorkstream]);

  useEffect(() => {
    const contextsObj = Object.fromEntries(workstreamContexts);
    saveToStorage(STORAGE_KEYS.WORKSTREAM_CONTEXTS, contextsObj);
  }, [workstreamContexts]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.KNOWLEDGE_BASES, knowledgeBases);
  }, [knowledgeBases]);

  // Notification methods
  const addNotification = useCallback((notification: Omit<Notification, 'id' | 'read'>): void => {
    const newNotification: Notification = {
      ...notification,
      id: `notif-${Date.now()}-${Math.random()}`,
      read: false
    };
    setNotifications(prev => [newNotification, ...prev]);
  }, []);

  const markAsRead = useCallback((notificationId: string): void => {
    setNotifications(prev =>
      prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
    );
  }, []);

  const clearNotification = useCallback((notificationId: string): void => {
    setNotifications(prev => prev.filter(n => n.id !== notificationId));
  }, []);

  const clearAllNotifications = useCallback((): void => {
    setNotifications([]);
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  // Assessment methods
  const addAssessment = useCallback((assessment: Omit<Assessment, 'id'>): void => {
    const newAssessment: Assessment = {
      ...assessment,
      id: `assess-${Date.now()}-${Math.random()}`
    };
    setAssessments(prev => [...prev, newAssessment]);
  }, []);

  const updateAssessmentStatus = useCallback((assessmentId: string, status: Assessment['status']): void => {
    setAssessments(prev =>
      prev.map(a => a.id === assessmentId ? { ...a, status } : a)
    );
  }, []);

  const getUpcomingAssessments = useCallback((): Assessment[] => {
    const thirtyDaysFromNow = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    return assessments
      .filter(a => a.dueDate <= thirtyDaysFromNow && a.status !== 'completed')
      .sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime());
  }, [assessments]);

  // Workstream methods
  const setSelectedWorkstream = useCallback((workstreamId: string | null): void => {
    setSelectedWorkstreamState(workstreamId);
  }, []);

  const getWorkstreamContext = useCallback((workstreamId: string): WorkstreamContext | undefined => {
    return workstreamContexts.get(workstreamId);
  }, [workstreamContexts]);

  const saveWorkstreamContext = useCallback((context: WorkstreamContext): void => {
    setWorkstreamContexts(prev => {
      const updated = new Map(prev);
      updated.set(context.workstreamId, context);
      return updated;
    });
  }, []);

  // Draft methods
  const getDraftsForWorkstream = useCallback((workstreamId: string): Draft[] => {
    const context = workstreamContexts.get(workstreamId);
    return context?.drafts ?? [];
  }, [workstreamContexts]);

  const saveDraft = useCallback((draft: Draft): void => {
    setWorkstreamContexts(prev => {
      const updated = new Map(prev);
      const context = updated.get(draft.workstreamId) || {
        workstreamId: draft.workstreamId,
        chatHistory: [],
        drafts: [],
        lastAccessed: new Date(),
        files: []
      };

      const existingIndex = context.drafts.findIndex(d => d.id === draft.id);
      if (existingIndex >= 0) {
        context.drafts[existingIndex] = draft;
      } else {
        context.drafts.push(draft);
      }

      updated.set(draft.workstreamId, context);
      return updated;
    });
  }, []);

  const deleteDraft = useCallback((draftId: string): void => {
    setWorkstreamContexts(prev => {
      const updated = new Map(prev);
      updated.forEach((context, workstreamId) => {
        const drafts = context.drafts.filter(d => d.id !== draftId);
        if (drafts.length !== context.drafts.length) {
          updated.set(workstreamId, { ...context, drafts });
        }
      });
      return updated;
    });
  }, []);

  // Knowledge Base methods
  const addKnowledgeBase = useCallback((kb: Omit<KnowledgeBase, 'id' | 'connected' | 'status'>): void => {
    const newKb: KnowledgeBase = {
      ...kb,
      id: `kb-${Date.now()}-${Math.random()}`,
      connected: false,
      status: 'active'
    };
    setKnowledgeBases(prev => [...prev, newKb]);
  }, []);

  const removeKnowledgeBase = useCallback((kbId: string): void => {
    setKnowledgeBases(prev => prev.filter(kb => kb.id !== kbId));
  }, []);

  const connectKnowledgeBase = useCallback(async (kbId: string): Promise<void> => {
    setKnowledgeBases(prev =>
      prev.map(kb => kb.id === kbId ? { ...kb, status: 'syncing' } : kb)
    );

    // Simulate connection delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    setKnowledgeBases(prev =>
      prev.map(kb => kb.id === kbId
        ? { ...kb, connected: true, status: 'active', lastSync: new Date() }
        : kb
      )
    );
  }, []);

  const disconnectKnowledgeBase = useCallback((kbId: string): void => {
    setKnowledgeBases(prev =>
      prev.map(kb => kb.id === kbId ? { ...kb, connected: false, status: 'active' } : kb)
    );
  }, []);

  const value: DashboardContextValue = {
    notifications,
    unreadCount,
    addNotification,
    markAsRead,
    clearNotification,
    clearAllNotifications,
    assessments,
    addAssessment,
    updateAssessmentStatus,
    getUpcomingAssessments,
    selectedWorkstream,
    setSelectedWorkstream,
    workstreamContexts,
    getWorkstreamContext,
    saveWorkstreamContext,
    getDraftsForWorkstream,
    saveDraft,
    deleteDraft,
    knowledgeBases,
    addKnowledgeBase,
    removeKnowledgeBase,
    connectKnowledgeBase,
    disconnectKnowledgeBase
  };

  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  );
};

export const useDashboard = (): DashboardContextValue => {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error('useDashboard must be used within a DashboardProvider');
  }
  return context;
};