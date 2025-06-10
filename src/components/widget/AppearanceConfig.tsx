import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { WidgetConfig } from './WidgetConfiguration';
import { HelpTooltip } from '@/components/ui/HelpSystem';

interface AppearanceConfigProps {
  config: WidgetConfig;
  onConfigChange: (updates: Partial<WidgetConfig>) => void;
}

const colorPresets = [
  { name: 'Professional Blue', value: '#3b82f6', description: 'Trustworthy and professional' },
  { name: 'Success Green', value: '#10b981', description: 'Growth and success focused' },
  { name: 'Creative Purple', value: '#8b5cf6', description: 'Creative and innovative' },
  { name: 'Energetic Orange', value: '#f59e0b', description: 'Energetic and friendly' },
  { name: 'Bold Red', value: '#ef4444', description: 'Urgent and attention-grabbing' },
  { name: 'Elegant Pink', value: '#ec4899', description: 'Modern and approachable' },
];

export const AppearanceConfig = ({ config, onConfigChange }: AppearanceConfigProps) => {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h3 className="text-lg font-semibold mb-2">Theme & Visual Settings</h3>
        <p className="text-sm text-muted-foreground">Configure the visual appearance and positioning of your widget</p>
      </div>

      {/* Dual Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

        {/* Left Column - Theme & Layout */}
        <div className="space-y-6">
          <div>
            <h4 className="text-base font-medium mb-4 text-muted-foreground uppercase tracking-wide text-xs">Display Settings</h4>
            <div className="space-y-4">
              <div className="space-y-2">
                <HelpTooltip
                  content="Choose how your widget adapts to your website's theme. Auto will match your visitor's system preference."
                  title="Theme Selection"
                >
                  <Label htmlFor="theme">Theme</Label>
                </HelpTooltip>
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
                    <SelectItem value="light">☀️ Light Theme</SelectItem>
                    <SelectItem value="dark">🌙 Dark Theme</SelectItem>
                    <SelectItem value="auto">🔄 Auto (System)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <HelpTooltip
                  content="Choose the size that works best for your website layout. Larger sizes show more conversation history."
                  title="Widget Size"
                >
                  <Label htmlFor="size">Widget Size</Label>
                </HelpTooltip>
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
                    <SelectItem value="small">📱 Compact (320×380)</SelectItem>
                    <SelectItem value="medium">💻 Standard (350×450)</SelectItem>
                    <SelectItem value="large">🖥️ Spacious (400×520)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-base font-medium mb-4 text-muted-foreground uppercase tracking-wide text-xs">Position & Custom Color</h4>
            <div className="space-y-4">
              <div className="space-y-2">
                <HelpTooltip
                  content="Choose where the chat widget appears on your website. Changes are reflected in the live preview."
                  title="Widget Position"
                >
                  <Label htmlFor="position">Widget Position</Label>
                </HelpTooltip>
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

              {/* Custom Color Picker - Moved inline */}
              <div className="space-y-2">
                <HelpTooltip
                  content="Enter a custom hex color code or use the color picker for precise brand matching."
                  title="Custom Brand Color"
                >
                  <Label>Custom Brand Color</Label>
                </HelpTooltip>
                <div className="flex gap-2">
                  <Input
                    type="color"
                    value={config.primaryColor}
                    onChange={(e) => onConfigChange({ primaryColor: e.target.value })}
                    className="w-16 h-10 p-1 border rounded cursor-pointer"
                    title="Pick custom color"
                  />
                  <Input
                    value={config.primaryColor}
                    onChange={(e) => onConfigChange({ primaryColor: e.target.value })}
                    placeholder="#3b82f6"
                    className="flex-1"
                    title="Enter hex color code"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Brand Colors */}
        <div className="space-y-6">
          <div>
            <h4 className="text-base font-medium mb-4 text-muted-foreground uppercase tracking-wide text-xs">Brand Color Presets</h4>
            <HelpTooltip
              content="Your brand color will be used for buttons, highlights, and the chat bubble. Choose a color that matches your brand identity."
              title="Brand Color Selection"
            >
              <Label className="mb-4 block">Quick Color Selection</Label>
            </HelpTooltip>

            {/* Color Presets Grid */}
            <div className="grid grid-cols-1 gap-3">
              {colorPresets.map((preset) => (
                <button
                  key={preset.value}
                  className={`p-4 rounded-lg border-2 transition-all hover:scale-[1.02] text-left group ${config.primaryColor === preset.value
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-950 shadow-md'
                    : 'border-border hover:border-blue-300 hover:shadow-sm'
                    }`}
                  onClick={() => onConfigChange({ primaryColor: preset.value })}
                  title={preset.description}
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className="w-6 h-6 rounded-full border-2 border-white shadow-sm group-hover:scale-110 transition-transform"
                      style={{ backgroundColor: preset.value }}
                    />
                    <div className="flex-1">
                      <span className="font-medium text-sm block">{preset.name}</span>
                      <p className="text-xs text-muted-foreground">{preset.description}</p>
                    </div>
                    {config.primaryColor === preset.value && (
                      <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center">
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
