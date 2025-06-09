
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Palette, Settings, MessageSquare, Cpu } from 'lucide-react';
import { WidgetConfig } from './WidgetConfiguration';
import { AppearanceConfig } from './AppearanceConfig';
import { BehaviorConfig } from './BehaviorConfig';
import { MessagingConfig } from './MessagingConfig';
import { AIModelConfig } from './AIModelConfig';

interface ConfigurationTabsProps {
  config: WidgetConfig;
  onConfigChange: (updates: Partial<WidgetConfig>) => void;
}

export const ConfigurationTabs = ({ config, onConfigChange }: ConfigurationTabsProps) => {
  return (
    <Card className="h-fit">
      <CardHeader>
        <CardTitle>Widget Configuration</CardTitle>
        <CardDescription>Customize every aspect of your chat widget</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="appearance" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="appearance" className="flex items-center gap-2">
              <Palette className="h-4 w-4" />
              <span className="hidden sm:inline">Appearance</span>
            </TabsTrigger>
            <TabsTrigger value="behavior" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              <span className="hidden sm:inline">Behavior</span>
            </TabsTrigger>
            <TabsTrigger value="messaging" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              <span className="hidden sm:inline">Messaging</span>
            </TabsTrigger>
            <TabsTrigger value="ai-model" className="flex items-center gap-2">
              <Cpu className="h-4 w-4" />
              <span className="hidden sm:inline">AI Model</span>
            </TabsTrigger>
          </TabsList>

          <div className="mt-6">
            <TabsContent value="appearance" className="mt-0">
              <AppearanceConfig config={config} onConfigChange={onConfigChange} />
            </TabsContent>

            <TabsContent value="behavior" className="mt-0">
              <BehaviorConfig config={config} onConfigChange={onConfigChange} />
            </TabsContent>

            <TabsContent value="messaging" className="mt-0">
              <MessagingConfig config={config} onConfigChange={onConfigChange} />
            </TabsContent>

            <TabsContent value="ai-model" className="mt-0">
              <AIModelConfig config={config} onConfigChange={onConfigChange} />
            </TabsContent>
          </div>
        </Tabs>
      </CardContent>
    </Card>
  );
};
