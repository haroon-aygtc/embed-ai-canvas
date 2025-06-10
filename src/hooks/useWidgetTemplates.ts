import { useState, useEffect, useCallback } from 'react';
import { apiClient } from '@/services/api';

export interface WidgetTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  preview: string;
  popular?: boolean;
  config: {
    theme: 'light' | 'dark' | 'auto';
    primaryColor: string;
    position: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
    size: 'small' | 'medium' | 'large';
    welcomeMessage: string;
    placeholder: string;
    title: string;
    subtitle: string;
    enabled: boolean;
    showBranding: boolean;
  };
}

interface UseWidgetTemplatesReturn {
  templates: WidgetTemplate[];
  isLoading: boolean;
  error: string | null;
  loadTemplates: () => Promise<void>;
  getTemplatesByCategory: (category: string) => Promise<void>;
  getPopularTemplates: () => Promise<void>;
  clearError: () => void;
}

export const useWidgetTemplates = (): UseWidgetTemplatesReturn => {
  const [templates, setTemplates] = useState<WidgetTemplate[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = () => setError(null);

  const loadTemplates = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await apiClient.widgetTemplates.getTemplates();
      if (response.data?.success) {
        setTemplates(response.data.data);
      } else {
        setError('Failed to load templates');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load templates';
      setError(errorMessage);
      console.error('Failed to load templates:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getTemplatesByCategory = useCallback(async (category: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await apiClient.widgetTemplates.getTemplatesByCategory(category);
      if (response.data?.success) {
        setTemplates(response.data.data);
      } else {
        setError('Failed to load templates');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load templates';
      setError(errorMessage);
      console.error('Failed to load templates by category:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getPopularTemplates = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await apiClient.widgetTemplates.getPopularTemplates();
      if (response.data?.success) {
        setTemplates(response.data.data);
      } else {
        setError('Failed to load popular templates');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load popular templates';
      setError(errorMessage);
      console.error('Failed to load popular templates:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Load templates on mount
  useEffect(() => {
    loadTemplates();
  }, [loadTemplates]);

  return {
    templates,
    isLoading,
    error,
    loadTemplates,
    getTemplatesByCategory,
    getPopularTemplates,
    clearError,
  };
};
