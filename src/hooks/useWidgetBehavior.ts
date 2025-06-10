import { useState, useEffect, useCallback } from "react";
import { apiClient } from "@/services/api";
import { useAuth } from "@/contexts/AuthContext";

interface BehaviorConfig {
    basicBehavior: {
        soundNotifications: boolean;
        typingIndicators: boolean;
        messagePersistence: boolean;
        autoMinimize: boolean;
    };
    operatingHours: {
        enabled: boolean;
        timezone: string;
        offlineMessage: string;
        collectOfflineMessages: boolean;
    };
    richMedia: {
        fileUploads: boolean;
        emojiSupport: boolean;
        linkPreviews: boolean;
        voiceMessages: boolean;
    };
    triggers: Array<{
        type: string;
        enabled?: boolean;
        seconds?: number;
        percentage?: number;
    }>;
    targeting: {
        newVisitorsOnly: boolean;
        returningVisitors: boolean;
        geographicTargeting: boolean;
        pageRules: string;
        urlPatterns: string[];
    };
}

interface OperatingHour {
    day: string;
    dayOfWeek: number;
    enabled: boolean;
    start: string;
    end: string;
    timezone: string;
}

interface UseWidgetBehaviorReturn {
    behaviorConfig: BehaviorConfig | null;
    operatingHours: OperatingHour[];
    isCurrentlyOperating: boolean;
    nextOperatingTime: string | null;
    isLoading: boolean;
    error: string | null;
    loadBehaviorSettings: (widgetId: number) => Promise<void>;
    updateBehaviorSettings: (widgetId: number, config: Partial<BehaviorConfig>) => Promise<boolean>;
    loadOperatingHours: (widgetId: number) => Promise<void>;
    updateOperatingHours: (widgetId: number, hours: OperatingHour[], timezone?: string) => Promise<boolean>;
    checkOperatingStatus: (widgetId: number, timezone?: string) => Promise<void>;
    clearError: () => void;
}

export const useWidgetBehavior = (): UseWidgetBehaviorReturn => {
    const { isAuthenticated } = useAuth();
    const [behaviorConfig, setBehaviorConfig] = useState<BehaviorConfig | null>(null);
    const [operatingHours, setOperatingHours] = useState<OperatingHour[]>([]);
    const [isCurrentlyOperating, setIsCurrentlyOperating] = useState(false);
    const [nextOperatingTime, setNextOperatingTime] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const clearError = useCallback(() => {
        setError(null);
    }, []);

    const loadBehaviorSettings = useCallback(async (widgetId: number) => {
        if (!isAuthenticated) return;

        setIsLoading(true);
        setError(null);

        try {
            const response = await apiClient.widgetBehavior.getBehaviorSettings(widgetId);
            if (response.data) {
                setBehaviorConfig(response.data.behavior);
                setOperatingHours(response.data.operatingHours || []);
                setIsCurrentlyOperating(response.data.isCurrentlyOperating || false);
                setNextOperatingTime(response.data.nextOperatingTime || null);
            }
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : "Failed to load behavior settings";
            setError(errorMessage);
            console.error("Failed to load behavior settings:", err);
        } finally {
            setIsLoading(false);
        }
    }, [isAuthenticated]);

    const updateBehaviorSettings = useCallback(async (
        widgetId: number,
        config: Partial<BehaviorConfig>
    ): Promise<boolean> => {
        if (!isAuthenticated) {
            setError("Authentication required");
            return false;
        }

        setIsLoading(true);
        setError(null);

        try {
            const response = await apiClient.widgetBehavior.updateBehaviorSettings(widgetId, config);
            if (response.data) {
                setBehaviorConfig(response.data.behavior);
                setOperatingHours(response.data.operatingHours || []);
                setIsCurrentlyOperating(response.data.isCurrentlyOperating || false);
                setNextOperatingTime(response.data.nextOperatingTime || null);
                return true;
            }
            return false;
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : "Failed to update behavior settings";
            setError(errorMessage);
            console.error("Failed to update behavior settings:", err);
            return false;
        } finally {
            setIsLoading(false);
        }
    }, [isAuthenticated]);

    const loadOperatingHours = useCallback(async (widgetId: number) => {
        if (!isAuthenticated) return;

        setIsLoading(true);
        setError(null);

        try {
            const response = await apiClient.widgetBehavior.getOperatingHours(widgetId);
            if (response.data) {
                setOperatingHours(response.data.operatingHours || []);
                setIsCurrentlyOperating(response.data.isCurrentlyOperating || false);
                setNextOperatingTime(response.data.nextOperatingTime || null);
            }
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : "Failed to load operating hours";
            setError(errorMessage);
            console.error("Failed to load operating hours:", err);
        } finally {
            setIsLoading(false);
        }
    }, [isAuthenticated]);

    const updateOperatingHours = useCallback(async (
        widgetId: number,
        hours: OperatingHour[],
        timezone = 'UTC'
    ): Promise<boolean> => {
        if (!isAuthenticated) {
            setError("Authentication required");
            return false;
        }

        setIsLoading(true);
        setError(null);

        try {
            const response = await apiClient.widgetBehavior.updateOperatingHours(widgetId, {
                operatingHours: hours,
                timezone
            });
            if (response.data) {
                setOperatingHours(response.data.operatingHours || []);
                return true;
            }
            return false;
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : "Failed to update operating hours";
            setError(errorMessage);
            console.error("Failed to update operating hours:", err);
            return false;
        } finally {
            setIsLoading(false);
        }
    }, [isAuthenticated]);

    const checkOperatingStatus = useCallback(async (widgetId: number, timezone = 'UTC') => {
        if (!isAuthenticated) return;

        try {
            // This would be a new endpoint we'd need to add
            const response = await apiClient.widgetBehavior.getBehaviorSettings(widgetId);
            if (response.data) {
                setIsCurrentlyOperating(response.data.isCurrentlyOperating || false);
                setNextOperatingTime(response.data.nextOperatingTime || null);
            }
        } catch (err) {
            console.error("Failed to check operating status:", err);
        }
    }, [isAuthenticated]);

    return {
        behaviorConfig,
        operatingHours,
        isCurrentlyOperating,
        nextOperatingTime,
        isLoading,
        error,
        loadBehaviorSettings,
        updateBehaviorSettings,
        loadOperatingHours,
        updateOperatingHours,
        checkOperatingStatus,
        clearError,
    };
}; 