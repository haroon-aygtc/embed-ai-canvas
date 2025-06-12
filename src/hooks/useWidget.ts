import { useState, useEffect } from "react";
import { widgetApi } from "@/services/api";
import { WidgetConfig as APIWidgetConfig } from "@/types/widget";
import { WidgetConfig } from "@/components/widget/WidgetConfiguration";

// Transform API data to frontend format
const transformApiToFrontend = (apiWidget: APIWidgetConfig): WidgetConfig => {
  return {
    id: apiWidget.id,
    name: apiWidget.name,
    theme: apiWidget.theme,
    primaryColor: apiWidget.primary_color,
    position: apiWidget.position,
    size: apiWidget.size,
    welcomeMessage: apiWidget.welcome_message,
    placeholder: apiWidget.placeholder_text,
    title: apiWidget.title,
    subtitle: apiWidget.subtitle,
    enabled: apiWidget.enabled,
    showBranding: apiWidget.show_branding,
    selectedModelId: apiWidget.ai_model,
    ai_provider: apiWidget.ai_provider,
    ai_model: apiWidget.ai_model,
    sound_notifications: apiWidget.sound_notifications,
    typing_indicators: apiWidget.typing_indicators,
    message_persistence: apiWidget.message_persistence,
    auto_minimize: apiWidget.auto_minimize,
    auto_open_enabled: apiWidget.auto_open_enabled,
    auto_open_delay: apiWidget.auto_open_delay,
    scroll_trigger_enabled: apiWidget.scroll_trigger_enabled,
    scroll_trigger_percentage: apiWidget.scroll_trigger_percentage,
    exit_intent_enabled: apiWidget.exit_intent_enabled,
    proactive_messages_enabled: apiWidget.proactive_messages_enabled,
    operating_hours_enabled: apiWidget.operating_hours_enabled,
    timezone: apiWidget.timezone,
    offline_message: apiWidget.offline_message,
    collect_offline_messages: apiWidget.collect_offline_messages,
    new_visitors_only: apiWidget.new_visitors_only,
    returning_visitors_behavior: apiWidget.returning_visitors_behavior,
    geographic_targeting: apiWidget.geographic_targeting,
    page_targeting_rules: apiWidget.page_targeting_rules,
    file_uploads_enabled: apiWidget.file_uploads_enabled,
    emoji_support_enabled: apiWidget.emoji_support_enabled,
    link_previews_enabled: apiWidget.link_previews_enabled,
    voice_messages_enabled: apiWidget.voice_messages_enabled,
    auto_detect_language: apiWidget.auto_detect_language,
    real_time_translation: apiWidget.real_time_translation,
    translation_service: apiWidget.translation_service,
    knowledge_base_enabled: apiWidget.knowledge_base_enabled,
    smart_responses_enabled: apiWidget.smart_responses_enabled,
    fallback_to_human: apiWidget.fallback_to_human,
    show_sources: apiWidget.show_sources,
    confidence_threshold_enabled: apiWidget.confidence_threshold_enabled,
    created_at: apiWidget.created_at,
    updated_at: apiWidget.updated_at,
    knowledgeBase: {
      selectedKnowledgeBases: [],
      sources: [],
      settings: {
        autoLearning: apiWidget.smart_responses_enabled || false,
        contextAwareness: apiWidget.knowledge_base_enabled || false,
        realTimeUpdates: apiWidget.real_time_translation || false,
        confidenceThreshold: apiWidget.confidence_threshold_enabled || false,
      },
    },
  };
};

// Transform frontend data to API format
const transformFrontendToApi = (
  frontendWidget: WidgetConfig,
): Partial<APIWidgetConfig> => {
  return {
    id: frontendWidget.id,
    name: frontendWidget.name || frontendWidget.title,
    enabled: frontendWidget.enabled,
    theme: frontendWidget.theme,
    primary_color: frontendWidget.primaryColor,
    position: frontendWidget.position,
    size: frontendWidget.size,
    title: frontendWidget.title,
    subtitle: frontendWidget.subtitle,
    welcome_message: frontendWidget.welcomeMessage,
    placeholder_text: frontendWidget.placeholder,
    show_branding: frontendWidget.showBranding,
    ai_provider: frontendWidget.ai_provider,
    ai_model: frontendWidget.selectedModelId || frontendWidget.ai_model,
    sound_notifications: frontendWidget.sound_notifications,
    typing_indicators: frontendWidget.typing_indicators,
    message_persistence: frontendWidget.message_persistence,
    auto_minimize: frontendWidget.auto_minimize,
    auto_open_enabled: frontendWidget.auto_open_enabled,
    auto_open_delay: frontendWidget.auto_open_delay,
    scroll_trigger_enabled: frontendWidget.scroll_trigger_enabled,
    scroll_trigger_percentage: frontendWidget.scroll_trigger_percentage,
    exit_intent_enabled: frontendWidget.exit_intent_enabled,
    proactive_messages_enabled: frontendWidget.proactive_messages_enabled,
    operating_hours_enabled: frontendWidget.operating_hours_enabled,
    timezone: frontendWidget.timezone,
    offline_message: frontendWidget.offline_message,
    collect_offline_messages: frontendWidget.collect_offline_messages,
    new_visitors_only: frontendWidget.new_visitors_only,
    returning_visitors_behavior: frontendWidget.returning_visitors_behavior,
    geographic_targeting: frontendWidget.geographic_targeting,
    page_targeting_rules: frontendWidget.page_targeting_rules,
    file_uploads_enabled: frontendWidget.file_uploads_enabled,
    emoji_support_enabled: frontendWidget.emoji_support_enabled,
    link_previews_enabled: frontendWidget.link_previews_enabled,
    voice_messages_enabled: frontendWidget.voice_messages_enabled,
    auto_detect_language: frontendWidget.auto_detect_language,
    real_time_translation: frontendWidget.real_time_translation,
    translation_service: frontendWidget.translation_service,
    knowledge_base_enabled: frontendWidget.knowledge_base_enabled,
    smart_responses_enabled: frontendWidget.smart_responses_enabled,
    fallback_to_human: frontendWidget.fallback_to_human,
    show_sources: frontendWidget.show_sources,
    confidence_threshold_enabled: frontendWidget.confidence_threshold_enabled,
  };
};

export const useWidget = (widgetId?: string) => {
  const [widget, setWidget] = useState<WidgetConfig | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchWidget = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const apiWidget = await widgetApi.getWidget(id);
      const frontendWidget = transformApiToFrontend(apiWidget);
      setWidget(frontendWidget);
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
      const apiData = transformFrontendToApi(data as WidgetConfig);
      const newApiWidget = await widgetApi.createWidget(apiData);
      const newFrontendWidget = transformApiToFrontend(newApiWidget);
      setWidget(newFrontendWidget);
      return newFrontendWidget;
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
      const apiData = transformFrontendToApi(data as WidgetConfig);
      const updatedApiWidget = await widgetApi.updateWidget(id, apiData);
      const updatedFrontendWidget = transformApiToFrontend(updatedApiWidget);
      setWidget(updatedFrontendWidget);
      return updatedFrontendWidget;
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
