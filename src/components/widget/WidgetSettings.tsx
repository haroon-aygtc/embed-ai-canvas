
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { WidgetConfig } from './WidgetConfiguration';

interface WidgetSettingsProps {
  config: WidgetConfig;
  onConfigChange: (updates: Partial<WidgetConfig>) => void;
}

export const WidgetSettings = ({ config, onConfigChange }: WidgetSettingsProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Content & Behavior</CardTitle>
        <CardDescription>Configure widget messages and functionality</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
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
          <Label htmlFor="welcomeMessage">Welcome Message</Label>
          <Textarea
            id="welcomeMessage"
            value={config.welcomeMessage}
            onChange={(e) => onConfigChange({ welcomeMessage: e.target.value })}
            placeholder="Hello! How can I help you today?"
            rows={3}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="placeholder">Input Placeholder</Label>
          <Input
            id="placeholder"
            value={config.placeholder}
            onChange={(e) => onConfigChange({ placeholder: e.target.value })}
            placeholder="Type your message..."
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Widget Enabled</Label>
            <p className="text-sm text-muted-foreground">Show the widget on your website</p>
          </div>
          <Switch
            checked={config.enabled}
            onCheckedChange={(enabled) => onConfigChange({ enabled })}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Show Branding</Label>
            <p className="text-sm text-muted-foreground">Display "Powered by ChatWidget Pro"</p>
          </div>
          <Switch
            checked={config.showBranding}
            onCheckedChange={(showBranding) => onConfigChange({ showBranding })}
          />
        </div>
      </CardContent>
    </Card>
  );
};
