import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Palette, Settings, MessageSquare, Cpu, Database, FileText } from 'lucide-react';
import { WidgetConfig } from './WidgetConfiguration';
import { AppearanceConfig } from './AppearanceConfig';
import { BehaviorConfig } from './BehaviorConfig';
import { MessagingConfig } from './MessagingConfig';
import { AIModelConfig } from './AIModelConfig';
import { KnowledgeBaseConfig } from './KnowledgeBaseConfig';
import { WidgetSettings } from './WidgetSettings';

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
        <Tabs defaultValue="settings" className="w-full">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              <span className="hidden sm:inline">Settings</span>
            </TabsTrigger>
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
            <TabsTrigger value="knowledge" className="flex items-center gap-2">
              <Database className="h-4 w-4" />
              <span className="hidden sm:inline">Knowledge</span>
            </TabsTrigger>
          </TabsList>

          <div className="mt-6">
            <TabsContent value="settings" className="space-y-6 mt-0">
              <WidgetSettings config={config} onConfigChange={onConfigChange} />
            </TabsContent>

            <TabsContent value="appearance" className="space-y-6 mt-0">
              <AppearanceConfig config={config} onConfigChange={onConfigChange} />
            </TabsContent>

            <TabsContent value="behavior" className="space-y-6 mt-0">
              <BehaviorConfig config={config} onConfigChange={onConfigChange} />
            </TabsContent>

            <TabsContent value="messaging" className="space-y-6 mt-0">
              <MessagingConfig config={config} onConfigChange={onConfigChange} />
            </TabsContent>

            <TabsContent value="ai-model" className="space-y-6 mt-0">
              <AIModelConfig config={config} onConfigChange={onConfigChange} />
            </TabsContent>

            <TabsContent value="knowledge" className="space-y-6 mt-0">
              <KnowledgeBaseConfig config={config} onConfigChange={onConfigChange} />
            </TabsContent>
          </div>
        </Tabs>
      </CardContent>
    </Card>
  );
};
