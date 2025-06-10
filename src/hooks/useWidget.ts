import { useState, useEffect, useCallback } from 'react';
import { apiClient, Widget, WidgetConfiguration, CreateWidgetRequest, UpdateWidgetRequest } from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';

interface UseWidgetReturn {
    widgets: Widget[];
    currentWidget: Widget | null;
    isLoading: boolean;
    error: string | null;
    createWidget: (data: CreateWidgetRequest) => Promise<Widget | null>;
    updateWidget: (id: number, data: UpdateWidgetRequest) => Promise<Widget | null>;
    deleteWidget: (id: number) => Promise<boolean>;
    toggleWidgetStatus: (id: number) => Promise<boolean>;
    loadWidgets: () => Promise<void>;
    loadWidget: (id: number) => Promise<void>;
    clearError: () => void;
}

export const useWidget = (widgetId?: number): UseWidgetReturn => {
    const { isAuthenticated } = useAuth();
    const [widgets, setWidgets] = useState<Widget[]>([]);
    const [currentWidget, setCurrentWidget] = useState<Widget | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const clearError = useCallback(() => {
        setError(null);
    }, []);

    const loadWidgets = useCallback(async () => {
        if (!isAuthenticated) return;

        setIsLoading(true);
        setError(null);

        try {
            const response = await apiClient.getWidgets();
            if (response.data) {
                setWidgets(response.data);
            }
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to load widgets';
            setError(errorMessage);
            console.error('Failed to load widgets:', err);
        } finally {
            setIsLoading(false);
        }
    }, [isAuthenticated]);

    const loadWidget = useCallback(async (id: number) => {
        if (!isAuthenticated) return;

        setIsLoading(true);
        setError(null);

        try {
            const response = await apiClient.getWidget(id);
            if (response.data) {
                setCurrentWidget(response.data);
            }
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to load widget';
            setError(errorMessage);
            console.error('Failed to load widget:', err);
        } finally {
            setIsLoading(false);
        }
    }, [isAuthenticated]);

    const createWidget = useCallback(async (data: CreateWidgetRequest): Promise<Widget | null> => {
        if (!isAuthenticated) {
            setError('Authentication required');
            return null;
        }

        setIsLoading(true);
        setError(null);

        try {
            const response = await apiClient.createWidget(data);
            if (response.data) {
                setWidgets(prev => [response.data, ...prev]);
                return response.data;
            }
            return null;
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to create widget';
            setError(errorMessage);
            console.error('Failed to create widget:', err);
            return null;
        } finally {
            setIsLoading(false);
        }
    }, [isAuthenticated]);

    const updateWidget = useCallback(async (id: number, data: UpdateWidgetRequest): Promise<Widget | null> => {
        if (!isAuthenticated) {
            setError('Authentication required');
            return null;
        }

        setIsLoading(true);
        setError(null);

        try {
            const response = await apiClient.updateWidget(id, data);
            if (response.data) {
                // Update widgets list
                setWidgets(prev => prev.map(w => w.id === id ? response.data : w));

                // Update current widget if it's the one being updated
                if (currentWidget?.id === id) {
                    setCurrentWidget(response.data);
                }

                return response.data;
            }
            return null;
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to update widget';
            setError(errorMessage);
            console.error('Failed to update widget:', err);
            return null;
        } finally {
            setIsLoading(false);
        }
    }, [isAuthenticated, currentWidget]);

    const deleteWidget = useCallback(async (id: number): Promise<boolean> => {
        if (!isAuthenticated) {
            setError('Authentication required');
            return false;
        }

        setIsLoading(true);
        setError(null);

        try {
            await apiClient.deleteWidget(id);
            setWidgets(prev => prev.filter(w => w.id !== id));

            if (currentWidget?.id === id) {
                setCurrentWidget(null);
            }

            return true;
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to delete widget';
            setError(errorMessage);
            console.error('Failed to delete widget:', err);
            return false;
        } finally {
            setIsLoading(false);
        }
    }, [isAuthenticated, currentWidget]);

    const toggleWidgetStatus = useCallback(async (id: number): Promise<boolean> => {
        if (!isAuthenticated) {
            setError('Authentication required');
            return false;
        }

        setIsLoading(true);
        setError(null);

        try {
            const response = await apiClient.toggleWidgetStatus(id);
            if (response.data) {
                // Update widgets list
                setWidgets(prev => prev.map(w =>
                    w.id === id
                        ? { ...w, enabled: response.data.enabled, last_updated_at: response.data.last_updated_at }
                        : w
                ));

                // Update current widget if it's the one being updated
                if (currentWidget?.id === id) {
                    setCurrentWidget(prev => prev ? {
                        ...prev,
                        enabled: response.data.enabled,
                        last_updated_at: response.data.last_updated_at
                    } : null);
                }

                return true;
            }
            return false;
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to toggle widget status';
            setError(errorMessage);
            console.error('Failed to toggle widget status:', err);
            return false;
        } finally {
            setIsLoading(false);
        }
    }, [isAuthenticated, currentWidget]);

    // Load widgets on mount if authenticated
    useEffect(() => {
        if (isAuthenticated) {
            loadWidgets();
        }
    }, [isAuthenticated, loadWidgets]);

    // Load specific widget if widgetId is provided
    useEffect(() => {
        if (isAuthenticated && widgetId) {
            loadWidget(widgetId);
        }
    }, [isAuthenticated, widgetId, loadWidget]);

    return {
        widgets,
        currentWidget,
        isLoading,
        error,
        createWidget,
        updateWidget,
        deleteWidget,
        toggleWidgetStatus,
        loadWidgets,
        loadWidget,
        clearError,
    };
};
