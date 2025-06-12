import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { WidgetConfig } from "./WidgetConfiguration";

interface WidgetSettingsProps {
  config: WidgetConfig;
  onConfigChange: (updates: Partial<WidgetConfig>) => void;
}

export const WidgetSettings = ({
  config,
  onConfigChange,
}: WidgetSettingsProps) => {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h3 className="text-lg font-semibold mb-2">
          Widget Content & Behavior
        </h3>
        <p className="text-sm text-muted-foreground">
          Configure widget messages, functionality, and core settings
        </p>
      </div>

      {/* Dual Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column - Content Settings */}
        <div className="space-y-6">
          <div>
            <h4 className="text-base font-medium mb-4 text-muted-foreground uppercase tracking-wide text-xs">
              Content Settings
            </h4>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Widget Title</Label>
                <Input
                  id="title"
                  value={config.title}
                  onChange={(e) => onConfigChange({ title: e.target.value })}
                  placeholder="AI Assistant"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="subtitle">Subtitle</Label>
                <Input
                  id="subtitle"
                  value={config.subtitle}
                  onChange={(e) => onConfigChange({ subtitle: e.target.value })}
                  placeholder="Powered by ChatWidget Pro"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="placeholder">Input Placeholder</Label>
                <Input
                  id="placeholder"
                  value={config.placeholder}
                  onChange={(e) =>
                    onConfigChange({ placeholder: e.target.value })
                  }
                  placeholder="Type your message..."
                />
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-base font-medium mb-4 text-muted-foreground uppercase tracking-wide text-xs">
              Welcome Message
            </h4>
            <div className="space-y-2">
              <Label htmlFor="welcomeMessage">Welcome Message</Label>
              <Textarea
                id="welcomeMessage"
                value={config.welcomeMessage}
                onChange={(e) =>
                  onConfigChange({ welcomeMessage: e.target.value })
                }
                placeholder="Hello! How can I help you today?"
                rows={4}
                className="resize-none"
              />
              <p className="text-xs text-muted-foreground">
                This message will be the first thing visitors see when they open
                your chat widget.
              </p>
            </div>
          </div>
        </div>

        {/* Right Column - Behavior Settings */}
        <div className="space-y-6">
          <div>
            <h4 className="text-base font-medium mb-4 text-muted-foreground uppercase tracking-wide text-xs">
              Widget Behavior
            </h4>
            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg border">
                <div className="space-y-1">
                  <Label className="text-base font-medium">
                    Widget Enabled
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Show the widget on your website
                  </p>
                </div>
                <Switch
                  checked={config.enabled}
                  onCheckedChange={(enabled) => onConfigChange({ enabled })}
                />
              </div>

              <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg border">
                <div className="space-y-1">
                  <Label className="text-base font-medium">Show Branding</Label>
                  <p className="text-sm text-muted-foreground">
                    Display "Powered by ChatWidget Pro"
                  </p>
                </div>
                <Switch
                  checked={config.show_branding}
                  onCheckedChange={(show_branding) =>
                    onConfigChange({ show_branding })
                  }
                />
              </div>
            </div>
          </div>

          <div className="p-4 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg">
            <div className="flex items-start space-x-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
              <div>
                <p className="text-sm font-medium text-blue-800 dark:text-blue-200">
                  Quick Setup Tip
                </p>
                <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
                  Start with a friendly welcome message and clear widget title.
                  You can always customize the appearance and behavior in other
                  tabs.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
