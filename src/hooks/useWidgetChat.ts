import { useState, useCallback } from 'react';
import { apiClient } from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';

export interface ChatMessage {
  id: string;
  content: string;
  is_user: boolean;
  response_time?: number;
  ai_model_used?: string;
  tokens_used?: number;
  created_at: string;
}

export interface TestConversation {
  id: string;
  session_id: string;
  visitor_id?: string;
  started_at: string;
  ended_at?: string;
  message_count: number;
  satisfaction_rating?: number;
  resolved: boolean;
  messages?: ChatMessage[];
}

interface UseWidgetChatReturn {
  conversations: TestConversation[];
  currentConversation: TestConversation | null;
  isLoading: boolean;
  error: string | null;
  sendMessage: (widgetId: number, conversationId: string, content: string) => Promise<ChatMessage | null>;
  createConversation: (widgetId: number, sessionId: string, visitorId?: string) => Promise<TestConversation | null>;
  loadConversations: (widgetId: number) => Promise<void>;
  loadConversation: (widgetId: number, conversationId: string) => Promise<void>;
  endConversation: (widgetId: number, conversationId: string, satisfactionRating?: number) => Promise<boolean>;
  clearError: () => void;
}

export const useWidgetChat = (): UseWidgetChatReturn => {
  const { isAuthenticated } = useAuth();
  const [conversations, setConversations] = useState<TestConversation[]>([]);
  const [currentConversation, setCurrentConversation] = useState<TestConversation | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const sendMessage = useCallback(async (widgetId: number, conversationId: string, content: string): Promise<ChatMessage | null> => {
    if (!isAuthenticated) {
      setError('Authentication required');
      return null;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await apiClient.widgetChats.sendMessage(widgetId, conversationId, {
        content,
        is_user: true
      });

      if (response.data?.success) {
        const message = response.data.data;

        // Update current conversation if it matches
        if (currentConversation?.id === conversationId) {
          setCurrentConversation(prev => prev ? {
            ...prev,
            messages: [...(prev.messages || []), message],
            message_count: prev.message_count + 1
          } : null);
        }

        return message;
      } else {
        setError('Failed to send message');
        return null;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to send message';
      setError(errorMessage);
      console.error('Failed to send message:', err);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, currentConversation]);

  const createConversation = useCallback(async (widgetId: number, sessionId: string, visitorId?: string): Promise<TestConversation | null> => {
    if (!isAuthenticated) {
      setError('Authentication required');
      return null;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await apiClient.widgetChats.createConversation(widgetId, {
        session_id: sessionId,
        visitor_id: visitorId
      });

      if (response.data?.success) {
        const conversation = response.data.data;
        setConversations(prev => [conversation, ...prev]);
        setCurrentConversation(conversation);
        return conversation;
      } else {
        setError('Failed to create conversation');
        return null;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create conversation';
      setError(errorMessage);
      console.error('Failed to create conversation:', err);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  const loadConversations = useCallback(async (widgetId: number): Promise<void> => {
    if (!isAuthenticated) {
      setError('Authentication required');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await apiClient.widgetChats.getConversations(widgetId);
      if (response.data?.success) {
        setConversations(response.data.data.conversations || []);
      } else {
        setError('Failed to load conversations');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load conversations';
      setError(errorMessage);
      console.error('Failed to load conversations:', err);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  const loadConversation = useCallback(async (widgetId: number, conversationId: string): Promise<void> => {
    if (!isAuthenticated) {
      setError('Authentication required');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await apiClient.widgetChats.getConversationMessages(widgetId, conversationId);
      if (response.data?.success) {
        const messages = response.data.data.messages || [];

        // Find and update the conversation with messages
        const conversation = conversations.find(c => c.id === conversationId);
        if (conversation) {
          const updatedConversation = { ...conversation, messages };
          setCurrentConversation(updatedConversation);
        }
      } else {
        setError('Failed to load conversation');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load conversation';
      setError(errorMessage);
      console.error('Failed to load conversation:', err);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, conversations]);

  const endConversation = useCallback(async (widgetId: number, conversationId: string, satisfactionRating?: number): Promise<boolean> => {
    if (!isAuthenticated) {
      setError('Authentication required');
      return false;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await apiClient.widgetChats.endConversation(widgetId, conversationId, {
        satisfaction_rating: satisfactionRating,
        resolved: true
      });

      if (response.data?.success) {
        // Update conversations list
        setConversations(prev => prev.map(c =>
          c.id === conversationId
            ? { ...c, ended_at: new Date().toISOString(), satisfaction_rating: satisfactionRating, resolved: true }
            : c
        ));

        // Update current conversation if it matches
        if (currentConversation?.id === conversationId) {
          setCurrentConversation(prev => prev ? {
            ...prev,
            ended_at: new Date().toISOString(),
            satisfaction_rating: satisfactionRating,
            resolved: true
          } : null);
        }

        return true;
      } else {
        setError('Failed to end conversation');
        return false;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to end conversation';
      setError(errorMessage);
      console.error('Failed to end conversation:', err);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, currentConversation]);

  return {
    conversations,
    currentConversation,
    isLoading,
    error,
    sendMessage,
    createConversation,
    loadConversations,
    loadConversation,
    endConversation,
    clearError,
  };
};
