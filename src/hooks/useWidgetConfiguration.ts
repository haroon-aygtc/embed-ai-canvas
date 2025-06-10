import { useState, useEffect, useCallback } from 'react';
import { apiClient } from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';

export interface WidgetConfigurationVersion {
  id: number;
  version: number;
  is_active: boolean;
  created_at: string;
  configuration: any;
}

interface UseWidgetConfigurationReturn {
  configuration: any;
  versions: WidgetConfigurationVersion[];
  isLoading: boolean;
  error: string | null;
  updateConfiguration: (widgetId: number, config: any) => Promise<boolean>;
  rollbackToVersion: (widgetId: number, version: number) => Promise<boolean>;
  getVersionHistory: (widgetId: number) => Promise<void>;
  clearError: () => void;
}

export const useWidgetConfiguration = (widgetId?: number): UseWidgetConfigurationReturn => {
  const { isAuthenticated } = useAuth();
  const [configuration, setConfiguration] = useState<any>(null);
  const [versions, setVersions] = useState<WidgetConfigurationVersion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const updateConfiguration = useCallback(async (widgetId: number, config: any): Promise<boolean> => {
    if (!isAuthenticated) {
      setError('Authentication required');
      return false;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await apiClient.widgets.updateWidget(widgetId, {
        configuration: config
      });

      if (response.data) {
        setConfiguration(response.data.configuration);
        return true;
      }
      return false;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update configuration';
      setError(errorMessage);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  const rollbackToVersion = useCallback(async (widgetId: number, version: number): Promise<boolean> => {
    if (!isAuthenticated) {
      setError('Authentication required');
      return false;
    }

    setIsLoading(true);
    setError(null);

    try {
      // This would be implemented when the backend supports version rollback
      // For now, just return false
      setError('Version rollback not yet implemented');
      return false;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to rollback configuration';
      setError(errorMessage);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  const getVersionHistory = useCallback(async (widgetId: number): Promise<void> => {
    if (!isAuthenticated) {
      setError('Authentication required');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // This would be implemented when the backend supports version history
      // For now, just set empty array
      setVersions([]);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load version history';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  // Load configuration when widgetId changes
  useEffect(() => {
    if (isAuthenticated && widgetId) {
      const loadConfiguration = async () => {
        setIsLoading(true);
        try {
          const response = await apiClient.widgets.getWidget(widgetId);
          if (response.data) {
            setConfiguration(response.data.configuration);
          }
        } catch (err) {
          const errorMessage = err instanceof Error ? err.message : 'Failed to load configuration';
          setError(errorMessage);
        } finally {
          setIsLoading(false);
        }
      };

      loadConfiguration();
    }
  }, [isAuthenticated, widgetId]);

  return {
    configuration,
    versions,
    isLoading,
    error,
    updateConfiguration,
    rollbackToVersion,
    getVersionHistory,
    clearError,
  };
};
