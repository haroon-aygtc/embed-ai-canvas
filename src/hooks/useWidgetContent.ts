import { useState, useCallback } from 'react';
import { apiClient } from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';

export interface QuickResponse {
  id: number;
  text: string;
  category: string;
  enabled: boolean;
  sort_order: number;
}

export interface ConversationStarter {
  id: number;
  message: string;
  trigger_type: 'immediate' | 'time_delay' | 'scroll' | 'exit_intent';
  delay_seconds: number;
  page_pattern?: string;
  enabled: boolean;
  sort_order: number;
}

interface UseWidgetContentReturn {
  quickResponses: QuickResponse[];
  conversationStarters: ConversationStarter[];
  isLoading: boolean;
  error: string | null;
  loadContent: (widgetId: number) => Promise<void>;
  loadQuickResponses: (widgetId: number) => Promise<void>;
  loadConversationStarters: (widgetId: number) => Promise<void>;
  createQuickResponse: (widgetId: number, data: Partial<QuickResponse>) => Promise<QuickResponse | null>;
  updateQuickResponse: (widgetId: number, responseId: number, data: Partial<QuickResponse>) => Promise<QuickResponse | null>;
  deleteQuickResponse: (widgetId: number, responseId: number) => Promise<boolean>;
  createConversationStarter: (widgetId: number, data: Partial<ConversationStarter>) => Promise<ConversationStarter | null>;
  updateConversationStarter: (widgetId: number, starterId: number, data: Partial<ConversationStarter>) => Promise<ConversationStarter | null>;
  deleteConversationStarter: (widgetId: number, starterId: number) => Promise<boolean>;
  clearError: () => void;
}

export const useWidgetContent = (widgetId?: number): UseWidgetContentReturn => {
  const { isAuthenticated } = useAuth();
  const [quickResponses, setQuickResponses] = useState<QuickResponse[]>([]);
  const [conversationStarters, setConversationStarters] = useState<ConversationStarter[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const loadContent = useCallback(async (widgetId: number): Promise<void> => {
    if (!isAuthenticated) {
      setError('Authentication required');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await apiClient.widgetContent.getWidgetContent(widgetId);
      if (response.data?.success) {
        setQuickResponses(response.data.data.quickResponses || []);
        setConversationStarters(response.data.data.conversationStarters || []);
      } else {
        setError('Failed to load widget content');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load widget content';
      setError(errorMessage);
      console.error('Failed to load widget content:', err);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  const loadQuickResponses = useCallback(async (widgetId: number): Promise<void> => {
    if (!isAuthenticated) {
      setError('Authentication required');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await apiClient.widgetContent.getQuickResponses(widgetId);
      if (response.data?.success) {
        setQuickResponses(response.data.data);
      } else {
        setError('Failed to load quick responses');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load quick responses';
      setError(errorMessage);
      console.error('Failed to load quick responses:', err);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  const loadConversationStarters = useCallback(async (widgetId: number): Promise<void> => {
    if (!isAuthenticated) {
      setError('Authentication required');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await apiClient.widgetContent.getConversationStarters(widgetId);
      if (response.data?.success) {
        setConversationStarters(response.data.data);
      } else {
        setError('Failed to load conversation starters');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load conversation starters';
      setError(errorMessage);
      console.error('Failed to load conversation starters:', err);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  const createQuickResponse = useCallback(async (widgetId: number, data: Partial<QuickResponse>): Promise<QuickResponse | null> => {
    if (!isAuthenticated) {
      setError('Authentication required');
      return null;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await apiClient.widgetContent.createQuickResponse(widgetId, data);
      if (response.data?.success) {
        const newResponse = response.data.data;
        setQuickResponses(prev => [...prev, newResponse]);
        return newResponse;
      } else {
        setError('Failed to create quick response');
        return null;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create quick response';
      setError(errorMessage);
      console.error('Failed to create quick response:', err);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  const updateQuickResponse = useCallback(async (widgetId: number, responseId: number, data: Partial<QuickResponse>): Promise<QuickResponse | null> => {
    if (!isAuthenticated) {
      setError('Authentication required');
      return null;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await apiClient.widgetContent.updateQuickResponse(widgetId, responseId, data);
      if (response.data?.success) {
        const updatedResponse = response.data.data;
        setQuickResponses(prev => prev.map(r => r.id === responseId ? updatedResponse : r));
        return updatedResponse;
      } else {
        setError('Failed to update quick response');
        return null;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update quick response';
      setError(errorMessage);
      console.error('Failed to update quick response:', err);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  const deleteQuickResponse = useCallback(async (widgetId: number, responseId: number): Promise<boolean> => {
    if (!isAuthenticated) {
      setError('Authentication required');
      return false;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await apiClient.widgetContent.deleteQuickResponse(widgetId, responseId);
      if (response.data?.success) {
        setQuickResponses(prev => prev.filter(r => r.id !== responseId));
        return true;
      } else {
        setError('Failed to delete quick response');
        return false;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete quick response';
      setError(errorMessage);
      console.error('Failed to delete quick response:', err);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  const createConversationStarter = useCallback(async (widgetId: number, data: Partial<ConversationStarter>): Promise<ConversationStarter | null> => {
    if (!isAuthenticated) {
      setError('Authentication required');
      return null;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await apiClient.widgetContent.createConversationStarter(widgetId, data);
      if (response.data?.success) {
        const newStarter = response.data.data;
        setConversationStarters(prev => [...prev, newStarter]);
        return newStarter;
      } else {
        setError('Failed to create conversation starter');
        return null;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create conversation starter';
      setError(errorMessage);
      console.error('Failed to create conversation starter:', err);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  const updateConversationStarter = useCallback(async (widgetId: number, starterId: number, data: Partial<ConversationStarter>): Promise<ConversationStarter | null> => {
    if (!isAuthenticated) {
      setError('Authentication required');
      return null;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await apiClient.widgetContent.updateConversationStarter(widgetId, starterId, data);
      if (response.data?.success) {
        const updatedStarter = response.data.data;
        setConversationStarters(prev => prev.map(s => s.id === starterId ? updatedStarter : s));
        return updatedStarter;
      } else {
        setError('Failed to update conversation starter');
        return null;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update conversation starter';
      setError(errorMessage);
      console.error('Failed to update conversation starter:', err);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  const deleteConversationStarter = useCallback(async (widgetId: number, starterId: number): Promise<boolean> => {
    if (!isAuthenticated) {
      setError('Authentication required');
      return false;
    }

    setIsLoading(true);
    setError(null);

    try {
        const response = await apiClient.widgetContent.deleteConversationStarter(widgetId, starterId);
      if (response.data?.success) {
        setConversationStarters(prev => prev.filter(s => s.id !== starterId));
        return true;
      } else {
        setError('Failed to delete conversation starter');
        return false;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete conversation starter';
      setError(errorMessage);
      console.error('Failed to delete conversation starter:', err);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  return {
    quickResponses,
    conversationStarters,
    isLoading,
    error,
    loadContent,
    loadQuickResponses,
    loadConversationStarters,
    createQuickResponse,
    updateQuickResponse,
    deleteQuickResponse,
    createConversationStarter,
    updateConversationStarter,
    deleteConversationStarter,
    clearError,
  };
};
