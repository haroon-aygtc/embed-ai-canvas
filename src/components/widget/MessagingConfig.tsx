
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { WidgetConfig } from './WidgetConfiguration';

interface MessagingConfigProps {
  config: WidgetConfig;
  onConfigChange: (updates: Partial<WidgetConfig>) => void;
}

export const MessagingConfig = ({ config, onConfigChange }: MessagingConfigProps) => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Widget Text</CardTitle>
          <CardDescription>Customize the text displayed in your widget</CardDescription>
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
              placeholder="We're here to help"
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
            <p className="text-xs text-muted-foreground">
              This message will be shown when users first open the chat widget
            </p>
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
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Quick Responses</CardTitle>
          <CardDescription>Pre-defined responses for common questions</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Suggested Questions</Label>
            <div className="space-y-2">
              <Input placeholder="How can I get started?" />
              <Input placeholder="What are your pricing plans?" />
              <Input placeholder="Do you offer support?" />
            </div>
            <p className="text-xs text-muted-foreground">
              These questions will appear as quick actions for users
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
