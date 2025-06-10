import { useState, useCallback } from 'react';
import { apiClient } from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';

export interface WidgetAnalytics {
  total_conversations: number;
  total_messages: number;
  active_conversations: number;
  average_satisfaction: number;
  response_time_avg: number;
  last_30_days: {
    conversations: number;
    messages: number;
  };
}

export interface AnalyticsDateRange {
  start: string;
  end: string;
}

interface UseWidgetAnalyticsReturn {
  analytics: WidgetAnalytics | null;
  isLoading: boolean;
  error: string | null;
  getAnalytics: (widgetId: number, dateRange?: AnalyticsDateRange) => Promise<void>;
  exportAnalytics: (widgetId: number, format: 'csv' | 'pdf') => Promise<void>;
  clearError: () => void;
}

export const useWidgetAnalytics = (): UseWidgetAnalyticsReturn => {
  const { isAuthenticated } = useAuth();
  const [analytics, setAnalytics] = useState<WidgetAnalytics | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const getAnalytics = useCallback(async (widgetId: number, dateRange?: AnalyticsDateRange): Promise<void> => {
    if (!isAuthenticated) {
      setError('Authentication required');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const params = dateRange ? {
        start_date: dateRange.start,
        end_date: dateRange.end
      } : undefined;

      const response = await apiClient.widgetAnalytics.getAnalytics(widgetId, params);
      if (response.data?.success) {
        setAnalytics(response.data.data);
      } else {
        setError('Failed to load analytics data');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load analytics';
      setError(errorMessage);
      console.error('Failed to load analytics:', err);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  const exportAnalytics = useCallback(async (widgetId: number, format: 'csv' | 'pdf'): Promise<void> => {
    if (!isAuthenticated) {
      setError('Authentication required');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await apiClient.widgetAnalytics.exportAnalytics(widgetId, format);
      if (response.data) {
        // Handle file download
        const blob = new Blob([response.data], {
          type: format === 'csv' ? 'text/csv' : 'application/pdf'
        });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `widget-${widgetId}-analytics.${format}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      } else {
        setError('Failed to export analytics data');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to export analytics';
      setError(errorMessage);
      console.error('Failed to export analytics:', err);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  return {
    analytics,
    isLoading,
    error,
    getAnalytics,
    exportAnalytics,
    clearError,
  };
};
