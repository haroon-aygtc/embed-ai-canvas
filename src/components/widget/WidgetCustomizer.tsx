import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { WidgetConfig } from './WidgetConfiguration';

interface WidgetCustomizerProps {
  config: WidgetConfig;
  onConfigChange: (updates: Partial<WidgetConfig>) => void;
}

export const WidgetCustomizer = ({ config, onConfigChange }: WidgetCustomizerProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Appearance</CardTitle>
        <CardDescription>Customize the visual appearance of your chat widget</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="theme">Theme</Label>
            <Select
              value={config.theme}
              onValueChange={(value: 'light' | 'dark' | 'auto') =>
                onConfigChange({ theme: value })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">Light</SelectItem>
                <SelectItem value="dark">Dark</SelectItem>
                <SelectItem value="auto">Auto</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="size">Size</Label>
            <Select
              value={config.size}
              onValueChange={(value: 'small' | 'medium' | 'large') =>
                onConfigChange({ size: value })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="small">Small</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="large">Large</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="primaryColor">Primary Color</Label>
            <div className="flex space-x-2">
              <Input
                id="primaryColor"
                type="color"
                value={config.primaryColor}
                onChange={(e) => onConfigChange({ primaryColor: e.target.value })}
                className="w-12 h-10 p-1 border rounded"
              />
              <Input
                value={config.primaryColor}
                onChange={(e) => onConfigChange({ primaryColor: e.target.value })}
                placeholder="#3b82f6"
                className="flex-1"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="position">Position</Label>
            <Select
              value={config.position}
              onValueChange={(value: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left') =>
                onConfigChange({ position: value })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="bottom-right">↘️ Bottom Right</SelectItem>
                <SelectItem value="bottom-left">↙️ Bottom Left</SelectItem>
                <SelectItem value="top-right">↗️ Top Right</SelectItem>
                <SelectItem value="top-left">↖️ Top Left</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
