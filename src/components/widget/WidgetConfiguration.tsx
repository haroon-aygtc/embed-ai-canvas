
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { WidgetCustomizer } from './WidgetCustomizer';
import { WidgetPreview } from './WidgetPreview';
import { WidgetSettings } from './WidgetSettings';

export interface WidgetConfig {
  theme: 'light' | 'dark' | 'auto';
  primaryColor: string;
  position: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  size: 'small' | 'medium' | 'large';
  welcomeMessage: string;
  placeholder: string;
  title: string;
  subtitle: string;
  enabled: boolean;
  showBranding: boolean;
}

const defaultConfig: WidgetConfig = {
  theme: 'light',
  primaryColor: '#3b82f6',
  position: 'bottom-right',
  size: 'medium',
  welcomeMessage: 'Hello! How can I help you today?',
  placeholder: 'Type your message...',
  title: 'AI Assistant',
  subtitle: 'Powered by ChatWidget Pro',
  enabled: true,
  showBranding: true,
};

export const WidgetConfiguration = () => {
  const [config, setConfig] = useState<WidgetConfig>(defaultConfig);

  const updateConfig = (updates: Partial<WidgetConfig>) => {
    setConfig(prev => ({ ...prev, ...updates }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Widget Configuration</h1>
          <p className="text-muted-foreground">Customize your AI chat widget appearance and behavior</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <WidgetCustomizer config={config} onConfigChange={updateConfig} />
          <WidgetSettings config={config} onConfigChange={updateConfig} />
        </div>
        
        <div className="lg:sticky lg:top-6">
          <WidgetPreview config={config} />
        </div>
      </div>
    </div>
  );
};
