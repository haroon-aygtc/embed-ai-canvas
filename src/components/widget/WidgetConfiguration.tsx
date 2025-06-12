import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Palette, Code2, Eye, Sparkles } from "lucide-react";
import { WidgetPreview } from "./WidgetPreview";
import { WidgetTemplates } from "./WidgetTemplates";
import { ConfigurationTabs } from "./ConfigurationTabs";
import { EmbedCodeGenerator } from "../embed/EmbedCodeGenerator";
import { PageHeader } from "@/components/layout/PageHeader";

export interface WidgetConfig {
  theme: "light" | "dark" | "auto";
  primaryColor: string;
  position: "bottom-right" | "bottom-left" | "top-right" | "top-left";
  size: "small" | "medium" | "large";
  welcomeMessage: string;
  placeholder: string;
  title: string;
  subtitle: string;
  enabled: boolean;
  showBranding: boolean;
  selectedModelId?: string;
  knowledgeBase?: {
    selectedKnowledgeBases?: string[];
    sources: Array<{
      id: string;
      name: string;
      type: "docs" | "faq" | "tickets" | "custom";
      status: "active" | "training" | "inactive";
    }>;
    settings: {
      autoLearning: boolean;
      contextAwareness: boolean;
      realTimeUpdates: boolean;
      confidenceThreshold?: boolean;
    };
  };
}

const defaultConfig: WidgetConfig = {
  theme: "light",
  primaryColor: "#3b82f6",
  position: "bottom-right",
  size: "medium",
  welcomeMessage: "Hello! How can I help you today?",
  placeholder: "Type your message...",
  title: "AI Assistant",
  subtitle: "Powered by ChatWidget Pro",
  enabled: true,
  showBranding: true,
  selectedModelId: "gpt-4",
  knowledgeBase: {
    selectedKnowledgeBases: [],
    sources: [],
    settings: {
      autoLearning: true,
      contextAwareness: true,
      realTimeUpdates: false,
      confidenceThreshold: true,
    },
  },
};

interface WidgetConfigurationProps {
  onSetupWizard?: () => void;
}

export const WidgetConfiguration = ({
  onSetupWizard,
}: WidgetConfigurationProps) => {
  const [config, setConfig] = useState<WidgetConfig>(defaultConfig);
  const [activeTab, setActiveTab] = useState("design");

  const updateConfig = (updates: Partial<WidgetConfig>) => {
    setConfig((prev) => ({ ...prev, ...updates }));
  };

  const handleTemplateSelect = (templateConfig: WidgetConfig) => {
    setConfig(templateConfig);
    setActiveTab("design"); // Switch to design tab after selecting template
  };

  const headerActions = (
    <>
      <Button variant="outline">Save Draft</Button>
      <Button>Publish Changes</Button>
    </>
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Widget Configuration"
        description="Customize your AI chat widget with professional templates or create your own design"
        onSetupWizard={onSetupWizard}
        actions={headerActions}
      />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="templates" className="flex items-center gap-2">
            <Palette className="h-4 w-4" />
            Templates
          </TabsTrigger>
          <TabsTrigger value="design" className="flex items-center gap-2">
            <Eye className="h-4 w-4" />
            Design & Configure
          </TabsTrigger>
          <TabsTrigger value="embed" className="flex items-center gap-2">
            <Code2 className="h-4 w-4" />
            Embed Code
          </TabsTrigger>
        </TabsList>

        <TabsContent value="templates" className="mt-6">
          <Card>
            <CardContent className="p-6">
              <WidgetTemplates
                onSelectTemplate={handleTemplateSelect}
                currentConfig={widget}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="design" className="mt-6">
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            <div className="xl:col-span-2">
              <ConfigurationTabs
                config={config}
                onConfigChange={updateConfig}
              />
            </div>

            <div className="xl:sticky xl:top-6">
              <WidgetPreview config={config} onConfigChange={updateConfig} />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="embed" className="mt-6">
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            <div className="xl:col-span-2">
              <EmbedCodeGenerator config={config} />
            </div>

            <div className="xl:sticky xl:top-6">
              <WidgetPreview config={config} onConfigChange={updateConfig} />
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
