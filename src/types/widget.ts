export interface WidgetConfig {
  id?: string;
  name: string;
  enabled: boolean;
  theme: "light" | "dark" | "auto";
  primary_color: string;
  position: "bottom-right" | "bottom-left" | "top-right" | "top-left";
  size: "small" | "medium" | "large";
  title: string;
  subtitle: string;
  welcome_message: string;
  placeholder_text: string;
  show_branding: boolean;

  // AI Model Configuration
  ai_provider?: string;
  ai_model?: string;

  // Behavior Settings
  sound_notifications?: boolean;
  typing_indicators?: boolean;
  message_persistence?: boolean;
  auto_minimize?: boolean;

  // Trigger Settings
  auto_open_enabled?: boolean;
  auto_open_delay?: number;
  scroll_trigger_enabled?: boolean;
  scroll_trigger_percentage?: number;
  exit_intent_enabled?: boolean;
  proactive_messages_enabled?: boolean;

  // Operating Hours
  operating_hours_enabled?: boolean;
  timezone?: string;
  offline_message?: string;
  collect_offline_messages?: boolean;

  // Targeting
  new_visitors_only?: boolean;
  returning_visitors_behavior?: boolean;
  geographic_targeting?: string;
  page_targeting_rules?: string;

  // Rich Media
  file_uploads_enabled?: boolean;
  emoji_support_enabled?: boolean;
  link_previews_enabled?: boolean;
  voice_messages_enabled?: boolean;

  // Language Settings
  auto_detect_language?: boolean;
  real_time_translation?: boolean;
  translation_service?: string;

  // Knowledge Base
  knowledge_base_enabled?: boolean;
  smart_responses_enabled?: boolean;
  fallback_to_human?: boolean;
  show_sources?: boolean;
  confidence_threshold_enabled?: boolean;

  created_at?: string;
  updated_at?: string;
}

export interface OperatingHour {
  id?: string;
  widget_id: string;
  day_of_week: number;
  enabled: boolean;
  start_time: string;
  end_time: string;
}

export interface QuickResponse {
  id?: string;
  widget_id: string;
  text: string;
  category: string;
  enabled: boolean;
  sort_order?: number;
}

export interface ConversationStarter {
  id?: string;
  widget_id: string;
  message: string;
  trigger_type: string;
  delay_seconds: number;
  enabled: boolean;
}

export interface WidgetKnowledgeBase {
  id?: string;
  widget_id: string;
  knowledge_base_id: string;
  enabled: boolean;
}

export interface UrlPattern {
  id?: string;
  widget_id: string;
  pattern: string;
  rule_type: "include" | "exclude";
  enabled: boolean;
}

export interface AIProvider {
  id: string;
  name: string;
  description: string;
  status: "active" | "inactive";
  website: string;
  icon: string;
}

export interface AIModel {
  id: string;
  provider_id: string;
  name: string;
  description: string;
  status: "active" | "inactive";
  recommended: boolean;
  context_window: string;
  pricing: string;
  performance: {
    speed: number;
    accuracy: number;
    cost: number;
  };
}

export interface KnowledgeBase {
  id: string;
  name: string;
  description: string;
  type: "document" | "website" | "faq" | "mixed";
  sources_count: number;
  last_updated: string;
  status: "ready" | "training" | "error";
}
