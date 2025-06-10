import React, { useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Loader2 } from "lucide-react";
import { WidgetConfig } from "./WidgetConfiguration";
import { useWidgetTemplates } from "@/hooks/useWidgetTemplates";

interface WidgetTemplatesProps {
  onSelectTemplate: (config: WidgetConfig) => void;
  currentConfig: WidgetConfig;
}

export const WidgetTemplates = ({
  onSelectTemplate,
  currentConfig,
}: WidgetTemplatesProps) => {
  // Use real API data instead of hardcoded templates
  const {
    templates,
    isLoading,
    error,
    loadTemplates,
  } = useWidgetTemplates();

  // Load templates on mount
  useEffect(() => {
    loadTemplates();
  }, [loadTemplates]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-6 w-6 animate-spin" />
        <span className="ml-2">Loading templates...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 mb-4">Failed to load templates: {error}</p>
        <Button onClick={loadTemplates} variant="outline">
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Quick Start Templates</h3>
        <p className="text-muted-foreground text-sm">
          Choose from pre-designed templates or start with a blank configuration
        </p>
      </div>

      {/* Grid Layout for All Templates */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {templates.map((template) => (
          <Card
            key={template.id}
            className="relative cursor-pointer hover:shadow-md transition-all hover:scale-105 group"
            onClick={() => onSelectTemplate(template.config)}
          >
            <CardContent className="p-4">
              {/* Template Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <h5 className="font-semibold text-sm">{template.name}</h5>
                  {template.popular && (
                    <Badge variant="secondary" className="text-xs">
                      Popular
                    </Badge>
                  )}
                </div>
                <div
                  className="w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0"
                  style={{ borderColor: template.config.primaryColor }}
                >
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: template.config.primaryColor }}
                  />
                </div>
              </div>

              {/* Category Badge */}
              <div className="mb-3">
                <Badge variant="outline" className="text-xs">
                  {template.category}
                </Badge>
              </div>

              {/* Description */}
              <p className="text-sm text-muted-foreground mb-4 line-clamp-3 min-h-[3rem]">
                {template.description}
              </p>

              {/* Template Details */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Theme:</span>
                  <span className="font-medium">
                    {template.config.theme === "dark" ? "Dark" : "Light"}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Size:</span>
                  <span className="font-medium capitalize">
                    {template.config.size}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Position:</span>
                  <span className="font-medium">
                    {template.config.position.replace("-", " ")}
                  </span>
                </div>
              </div>

              {/* Apply Button */}
              <Button
                size="sm"
                className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                variant="outline"
              >
                <Check className="h-3 w-3 mr-1" />
                Apply Template
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="border-t pt-6">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-medium mb-1">Need something custom?</h4>
            <p className="text-sm text-muted-foreground">
              Start with a blank template and customize everything
            </p>
          </div>
          <Button
            variant="outline"
            onClick={() =>
              onSelectTemplate({
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
              })
            }
          >
            Start Blank
          </Button>
        </div>
      </div>
    </div>
  );
};
