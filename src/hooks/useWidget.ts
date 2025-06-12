import { useState, useEffect } from "react";
import { widgetApi } from "@/services/api";
import { WidgetConfig } from "@/types/widget";

export const useWidget = (widgetId?: string) => {
  const [widget, setWidget] = useState<WidgetConfig | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchWidget = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await widgetApi.getWidget(id);
      setWidget(data);
    } catch (err: any) {
      setError(err.message || "Failed to fetch widget");
    } finally {
      setLoading(false);
    }
  };

  const createWidget = async (data: Partial<WidgetConfig>) => {
    setLoading(true);
    setError(null);
    try {
      const newWidget = await widgetApi.createWidget(data);
      setWidget(newWidget);
      return newWidget;
    } catch (err: any) {
      setError(err.message || "Failed to create widget");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateWidget = async (id: string, data: Partial<WidgetConfig>) => {
    setLoading(true);
    setError(null);
    try {
      const updatedWidget = await widgetApi.updateWidget(id, data);
      setWidget(updatedWidget);
      return updatedWidget;
    } catch (err: any) {
      setError(err.message || "Failed to update widget");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteWidget = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      await widgetApi.deleteWidget(id);
      setWidget(null);
    } catch (err: any) {
      setError(err.message || "Failed to delete widget");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (widgetId) {
      fetchWidget(widgetId);
    }
  }, [widgetId]);

  return {
    widget,
    loading,
    error,
    fetchWidget,
    createWidget,
    updateWidget,
    deleteWidget,
    setWidget,
  };
};
