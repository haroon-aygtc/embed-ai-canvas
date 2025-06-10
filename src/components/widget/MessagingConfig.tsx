import React, { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input, InputCompact } from "@/components/ui/input";
import { SearchableSelect } from "@/components/ui/combobox";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import {
  MessageSquare,
  Globe,
  Zap,
  Image,
  Plus,
  X,
  Edit,
  Copy,
  Clock,
  Loader2,
} from "lucide-react";
import { WidgetConfig } from "./WidgetConfiguration";
import { useWidgetContent } from "@/hooks/useWidgetContent";
import { useWidgetBehavior } from "@/hooks/useWidgetBehavior";
import { useWidget } from "@/hooks/useWidget";
import { TRIGGER_TYPES } from "@/lib/constants/widget-constants";

interface MessagingConfigProps {
  config: WidgetConfig;
  onConfigChange: (updates: Partial<WidgetConfig>) => void;
}

export const MessagingConfig = ({
  config,
  onConfigChange,
}: MessagingConfigProps) => {
  const { currentWidget } = useWidget();
  const widgetId = currentWidget?.id;

  // Use real API data instead of hardcoded arrays
  const {
    quickResponses,
    conversationStarters,
    isLoading: contentLoading,
    error: contentError,
    loadQuickResponses,
    createQuickResponse,
    updateQuickResponse,
    deleteQuickResponse,
    loadConversationStarters,
    createConversationStarter,
    updateConversationStarter,
    deleteConversationStarter,
  } = useWidgetContent();

  const {
    behaviorConfig,
    isLoading: behaviorLoading,
    error: behaviorError,
    loadBehaviorSettings,
    updateBehaviorSettings,
  } = useWidgetBehavior();

  // Language configuration - this will be replaced with API data in the future
  // For now, using a state that can be managed through the widget configuration
  const [languages, setLanguages] = useState([
    { code: "en", name: "English", enabled: true, primary: true },
    { code: "es", name: "Spanish", enabled: true, primary: false },
    { code: "fr", name: "French", enabled: false, primary: false },
    { code: "de", name: "German", enabled: false, primary: false },
    { code: "it", name: "Italian", enabled: false, primary: false },
    { code: "pt", name: "Portuguese", enabled: false, primary: false },
  ]);

  // Load data when widget ID is available
  useEffect(() => {
    if (widgetId) {
      loadQuickResponses(widgetId);
      loadConversationStarters(widgetId);
      loadBehaviorSettings(widgetId);
    }
  }, [widgetId, loadQuickResponses, loadConversationStarters, loadBehaviorSettings]);

  // Get unique categories from quick responses
  const categories = Array.from(new Set(quickResponses.map(qr => qr.category))).filter(Boolean);

  // Use trigger types from constants
  const triggers = TRIGGER_TYPES;

  // Language management functions
  const handleLanguageToggle = async (languageCode: string) => {
    const updatedLanguages = languages.map(lang =>
      lang.code === languageCode ? { ...lang, enabled: !lang.enabled } : lang
    );
    setLanguages(updatedLanguages);

    // TODO: Save to API when language management endpoint is available
    // await updateWidgetLanguages(widgetId, updatedLanguages);
  };

  const handlePrimaryLanguageChange = async (languageCode: string) => {
    const updatedLanguages = languages.map(lang => ({
      ...lang,
      primary: lang.code === languageCode,
    }));
    setLanguages(updatedLanguages);

    // TODO: Save to API when language management endpoint is available
    // await updateWidgetLanguages(widgetId, updatedLanguages);
  };

  const handleCreateQuickResponse = async (text: string, category: string) => {
    if (!widgetId) return;

    await createQuickResponse(widgetId, {
      text,
      category,
      enabled: true,
      sort_order: quickResponses.length + 1,
    });
  };

  const handleUpdateQuickResponse = async (id: number, updates: any) => {
    if (!widgetId) return;

    await updateQuickResponse(widgetId, id, updates);
  };

  const handleDeleteQuickResponse = async (id: number) => {
    if (!widgetId) return;

    await deleteQuickResponse(widgetId, id);
  };

  const handleCreateConversationStarter = async (message: string, triggerType: string, delaySeconds: number) => {
    if (!widgetId) return;

    await createConversationStarter(widgetId, {
      message,
      trigger_type: triggerType as any,
      delay_seconds: delaySeconds,
      enabled: true,
      sort_order: conversationStarters.length + 1,
    });
  };

  const handleUpdateConversationStarter = async (id: number, updates: any) => {
    if (!widgetId) return;

    await updateConversationStarter(widgetId, id, updates);
  };

  const handleDeleteConversationStarter = async (id: number) => {
    if (!widgetId) return;

    await deleteConversationStarter(widgetId, id);
  };

  const handleUpdateRichMediaSettings = async (settings: any) => {
    if (!widgetId) return;

    const updatedConfig = {
      ...behaviorConfig,
      richMedia: {
        ...behaviorConfig?.richMedia,
        ...settings,
      },
    };

    await updateBehaviorSettings(widgetId, updatedConfig);
  };

  const isLoading = contentLoading || behaviorLoading;
  const error = contentError || behaviorError;

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="text-center py-12">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <h3 className="text-lg font-semibold mb-2">Loading Messaging Configuration</h3>
          <p className="text-muted-foreground">
            Loading content and behavior settings from the API...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-8">
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center mx-auto mb-4">
            <MessageSquare className="h-8 w-8 text-red-600" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Configuration Error</h3>
          <p className="text-muted-foreground mb-4">{error}</p>
          <Button variant="outline" onClick={() => {
            if (widgetId) {
              loadQuickResponses(widgetId);
              loadConversationStarters(widgetId);
              loadBehaviorSettings(widgetId);
            }
          }}>
            <Loader2 className="h-4 w-4 mr-2" />
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h3 className="text-lg font-semibold mb-2">
          Messaging & Communication
        </h3>
        <p className="text-sm text-muted-foreground">
          Configure rich media, quick responses, and conversation features
        </p>
      </div>

      <Tabs defaultValue="content" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="content" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            Content
          </TabsTrigger>
          <TabsTrigger
            value="quick-responses"
            className="flex items-center gap-2"
          >
            <Zap className="h-4 w-4" />
            Quick Responses
          </TabsTrigger>
          <TabsTrigger value="starters" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            Starters
          </TabsTrigger>
          <TabsTrigger value="languages" className="flex items-center gap-2">
            <Globe className="h-4 w-4" />
            Languages
          </TabsTrigger>
        </TabsList>

        <TabsContent value="content" className="space-y-6 mt-6">
          {/* Dual Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - Basic Settings Notice */}
            <div className="space-y-6">
              <div>
                <h4 className="text-base font-medium mb-4 text-muted-foreground uppercase tracking-wide text-xs">
                  Content Settings
                </h4>
                <div className="p-4 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg">
                  <div className="flex items-start space-x-2">
                    <MessageSquare className="h-4 w-4 text-blue-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-blue-800 dark:text-blue-200">
                        Basic Widget Text Settings
                      </p>
                      <p className="text-xs text-blue-700 dark:text-blue-300">
                        Widget title, subtitle, welcome message, and input
                        placeholder are now configured in the{" "}
                        <strong>Settings</strong> tab for better organization.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Rich Media Support */}
            <div className="space-y-6">
              <div>
                <h4 className="text-base font-medium mb-4 text-muted-foreground uppercase tracking-wide text-xs">
                  Rich Media Support
                </h4>
                <p className="text-sm text-muted-foreground mb-4">
                  Enable rich content in conversations
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg border">
                  <div className="space-y-1">
                    <Label className="text-base font-medium">
                      File Uploads
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Allow users to upload files and images
                    </p>
                  </div>
                  <Switch
                    checked={behaviorConfig?.richMedia?.fileUploads ?? true}
                    onCheckedChange={(checked) => handleUpdateRichMediaSettings({ fileUploads: checked })}
                  />
                </div>

                <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg border">
                  <div className="space-y-1">
                    <Label className="text-base font-medium">
                      Emoji Support
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Enable emoji picker in chat
                    </p>
                  </div>
                  <Switch
                    checked={behaviorConfig?.richMedia?.emojiSupport ?? true}
                    onCheckedChange={(checked) => handleUpdateRichMediaSettings({ emojiSupport: checked })}
                  />
                </div>

                <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg border">
                  <div className="space-y-1">
                    <Label className="text-base font-medium">
                      Link Previews
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Show previews for shared links
                    </p>
                  </div>
                  <Switch
                    checked={behaviorConfig?.richMedia?.linkPreviews ?? false}
                    onCheckedChange={(checked) => handleUpdateRichMediaSettings({ linkPreviews: checked })}
                  />
                </div>

                <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg border">
                  <div className="space-y-1">
                    <Label className="text-base font-medium">
                      Voice Messages
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Allow voice message recording
                    </p>
                  </div>
                  <Switch
                    checked={behaviorConfig?.richMedia?.voiceMessages ?? false}
                    onCheckedChange={(checked) => handleUpdateRichMediaSettings({ voiceMessages: checked })}
                  />
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="quick-responses" className="space-y-6 mt-6">
          {/* Quick Responses Management */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-base font-medium mb-2">Quick Responses</h4>
                <p className="text-sm text-muted-foreground">
                  Pre-written responses for common questions ({quickResponses.length} responses)
                </p>
              </div>
              <Button
                onClick={() => {
                  const text = prompt("Enter quick response text:");
                  const category = prompt("Enter category (optional):") || "General";
                  if (text) handleCreateQuickResponse(text, category);
                }}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Response
              </Button>
            </div>

            {/* Categories Filter */}
            {categories.length > 0 && (
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline">All ({quickResponses.length})</Badge>
                {categories.map((category) => (
                  <Badge key={category} variant="secondary">
                    {category} ({quickResponses.filter(qr => qr.category === category).length})
                  </Badge>
                ))}
              </div>
            )}

            {/* Quick Responses List */}
            <div className="space-y-3">
              {quickResponses.map((response) => (
                <div
                  key={response.id}
                  className="p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="text-sm font-medium">{response.text}</p>
                      {response.category && (
                        <Badge variant="outline" className="mt-2 text-xs">
                          {response.category}
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center space-x-2 ml-4">
                      <Switch
                        checked={response.enabled}
                        onCheckedChange={(checked) =>
                          handleUpdateQuickResponse(response.id, { enabled: checked })
                        }
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          const newText = prompt("Edit response:", response.text);
                          if (newText) handleUpdateQuickResponse(response.id, { text: newText });
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          if (confirm("Delete this quick response?")) {
                            handleDeleteQuickResponse(response.id);
                          }
                        }}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}

              {quickResponses.length === 0 && (
                <div className="text-center py-12">
                  <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h5 className="font-medium text-muted-foreground mb-2">
                    No Quick Responses
                  </h5>
                  <p className="text-sm text-muted-foreground">
                    Add quick responses to help your team respond faster
                  </p>
                </div>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="starters" className="space-y-6 mt-6">
          {/* Conversation Starters Management */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-base font-medium mb-2">Conversation Starters</h4>
                <p className="text-sm text-muted-foreground">
                  Automated messages to engage visitors ({conversationStarters.length} starters)
                </p>
              </div>
              <Button
                onClick={() => {
                  const message = prompt("Enter conversation starter message:");
                  if (message) {
                    const triggerType = prompt("Enter trigger type (immediate, time_delay, scroll, exit_intent):") || "immediate";
                    const delaySeconds = triggerType === "time_delay" ? parseInt(prompt("Enter delay in seconds:") || "5") : 0;
                    handleCreateConversationStarter(message, triggerType, delaySeconds);
                  }
                }}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Starter
              </Button>
            </div>

            {/* Conversation Starters List */}
            <div className="space-y-3">
              {conversationStarters.map((starter) => (
                <div
                  key={starter.id}
                  className="p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="text-sm font-medium">{starter.message}</p>
                      <div className="flex items-center space-x-2 mt-2">
                        <Badge variant="outline" className="text-xs">
                          {triggers.find(t => t.id === starter.trigger_type)?.label || starter.trigger_type}
                        </Badge>
                        {starter.delay_seconds > 0 && (
                          <Badge variant="secondary" className="text-xs">
                            <Clock className="h-3 w-3 mr-1" />
                            {starter.delay_seconds}s
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 ml-4">
                      <Switch
                        checked={starter.enabled}
                        onCheckedChange={(checked) =>
                          handleUpdateConversationStarter(starter.id, { enabled: checked })
                        }
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          const newMessage = prompt("Edit message:", starter.message);
                          if (newMessage) handleUpdateConversationStarter(starter.id, { message: newMessage });
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          if (confirm("Delete this conversation starter?")) {
                            handleDeleteConversationStarter(starter.id);
                          }
                        }}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}

              {conversationStarters.length === 0 && (
                <div className="text-center py-12">
                  <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h5 className="font-medium text-muted-foreground mb-2">
                    No Conversation Starters
                  </h5>
                  <p className="text-sm text-muted-foreground">
                    Add conversation starters to proactively engage visitors
                  </p>
                </div>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="languages" className="space-y-6 mt-6">
          {/* Language Configuration */}
          <div className="space-y-6">
            <div>
              <h4 className="text-base font-medium mb-2">Language Support</h4>
              <p className="text-sm text-muted-foreground">
                Configure multi-language support for your widget
              </p>
            </div>

            <div className="p-4 bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-800 rounded-lg">
              <div className="flex items-start space-x-2">
                <Globe className="h-4 w-4 text-yellow-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                    Language Management Coming Soon
                  </p>
                  <p className="text-xs text-yellow-700 dark:text-yellow-300 mt-1">
                    Full language management with translation services will be available in the dedicated Languages module.
                    Current settings are temporary and will be migrated automatically.
                  </p>
                </div>
              </div>
            </div>

            {/* Language List */}
            <div className="space-y-3">
              {languages.map((language) => (
                <div
                  key={language.code}
                  className="p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                        <span className="text-xs font-medium uppercase">
                          {language.code}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-medium">{language.name}</p>
                        {language.primary && (
                          <Badge variant="default" className="text-xs mt-1">
                            Primary
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {!language.primary && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handlePrimaryLanguageChange(language.code)}
                        >
                          Set Primary
                        </Button>
                      )}
                      <Switch
                        checked={language.enabled}
                        onCheckedChange={() => handleLanguageToggle(language.code)}
                        disabled={language.primary} // Can't disable primary language
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
