
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { WidgetConfig } from './WidgetConfiguration';

interface AppearanceConfigProps {
  config: WidgetConfig;
  onConfigChange: (updates: Partial<WidgetConfig>) => void;
}

const colorPresets = [
  { name: 'Blue', value: '#3b82f6' },
  { name: 'Green', value: '#10b981' },
  { name: 'Purple', value: '#8b5cf6' },
  { name: 'Orange', value: '#f59e0b' },
  { name: 'Red', value: '#ef4444' },
  { name: 'Pink', value: '#ec4899' },
];

export const AppearanceConfig = ({ config, onConfigChange }: AppearanceConfigProps) => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Theme & Colors</CardTitle>
          <CardDescription>Configure the visual theme and color scheme</CardDescription>
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
                  <SelectItem value="auto">Auto (System)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="size">Widget Size</Label>
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
                  <SelectItem value="small">Small (320×380)</SelectItem>
                  <SelectItem value="medium">Medium (350×450)</SelectItem>
                  <SelectItem value="large">Large (400×520)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Primary Color</Label>
            <div className="flex gap-2 mb-3">
              {colorPresets.map((preset) => (
                <button
                  key={preset.value}
                  className={`w-8 h-8 rounded-full border-2 transition-all ${
                    config.primaryColor === preset.value 
                      ? 'border-foreground scale-110' 
                      : 'border-border hover:scale-105'
                  }`}
                  style={{ backgroundColor: preset.value }}
                  onClick={() => onConfigChange({ primaryColor: preset.value })}
                  title={preset.name}
                />
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                type="color"
                value={config.primaryColor}
                onChange={(e) => onConfigChange({ primaryColor: e.target.value })}
                className="w-16 h-10 p-1 border rounded"
              />
              <Input
                value={config.primaryColor}
                onChange={(e) => onConfigChange({ primaryColor: e.target.value })}
                placeholder="#3b82f6"
                className="flex-1"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Positioning</CardTitle>
          <CardDescription>Choose where the widget appears on your website</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="position">Widget Position</Label>
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
                <SelectItem value="bottom-right">Bottom Right</SelectItem>
                <SelectItem value="bottom-left">Bottom Left</SelectItem>
                <SelectItem value="top-right">Top Right</SelectItem>
                <SelectItem value="top-left">Top Left</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
