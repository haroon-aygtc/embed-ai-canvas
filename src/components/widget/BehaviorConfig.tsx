
import React from 'react';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { WidgetConfig } from './WidgetConfiguration';

interface BehaviorConfigProps {
  config: WidgetConfig;
  onConfigChange: (updates: Partial<WidgetConfig>) => void;
}

export const BehaviorConfig = ({ config, onConfigChange }: BehaviorConfigProps) => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Widget Behavior</CardTitle>
          <CardDescription>Configure how the widget behaves on your website</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base">Enable Widget</Label>
              <p className="text-sm text-muted-foreground">
                Show the chat widget on your website
              </p>
            </div>
            <Switch
              checked={config.enabled}
              onCheckedChange={(enabled) => onConfigChange({ enabled })}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base">Show Branding</Label>
              <p className="text-sm text-muted-foreground">
                Display "Powered by ChatWidget Pro" in the widget
              </p>
            </div>
            <Switch
              checked={config.showBranding}
              onCheckedChange={(showBranding) => onConfigChange({ showBranding })}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Advanced Settings</CardTitle>
          <CardDescription>Additional behavioral configurations</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base">Auto-open on Load</Label>
              <p className="text-sm text-muted-foreground">
                Automatically open the widget when the page loads
              </p>
            </div>
            <Switch defaultChecked={false} />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base">Sound Notifications</Label>
              <p className="text-sm text-muted-foreground">
                Play sound when new messages arrive
              </p>
            </div>
            <Switch defaultChecked={true} />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base">Typing Indicators</Label>
              <p className="text-sm text-muted-foreground">
                Show when the AI is typing a response
              </p>
            </div>
            <Switch defaultChecked={true} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
