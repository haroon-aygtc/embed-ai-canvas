import React, { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { SearchableSelect } from "@/components/ui/combobox";
import { Badge } from "@/components/ui/badge";
import {
  Brain,
  Sparkles,
  Zap,
  ExternalLink,
  CheckCircle,
  Settings,
  Info,
  Loader2,
} from "lucide-react";
import { WidgetConfig } from "./WidgetConfiguration";
import { useAIModels } from "@/hooks/useAIModels";

interface AIModelConfigProps {
  config: WidgetConfig;
  onConfigChange: (updates: Partial<WidgetConfig>) => void;
}

export const AIModelConfig = ({
  config,
  onConfigChange,
}: AIModelConfigProps) => {
  const { providers, models, loading, error, fetchModels } = useAIModels();
  const [selectedProvider, setSelectedProvider] = useState(
    config.ai_provider || "",
  );
  const [selectedModel, setSelectedModel] = useState(
    config.selectedModelId || config.ai_model || "",
  );

  // Filter models by selected provider
  const availableModels = selectedProvider
    ? models.filter((model) => model.provider_id === selectedProvider)
    : models;

  const activeProviders = providers.filter(
    (provider) => provider.status === "active",
  );
  const selectedProviderData = providers.find(
    (provider) => provider.id === selectedProvider,
  );
  const selectedModelData = models.find((model) => model.id === selectedModel);

  // Initialize provider selection based on current model
  useEffect(() => {
    if (selectedModel && !selectedProvider && models.length > 0) {
      const modelData = models.find((model) => model.id === selectedModel);
      if (modelData) {
        setSelectedProvider(modelData.provider_id);
      }
    }
  }, [selectedModel, selectedProvider, models]);

  const handleProviderChange = async (providerId: string) => {
    setSelectedProvider(providerId);
    setSelectedModel(""); // Reset model selection when provider changes
    onConfigChange({
      ai_provider: providerId,
      selectedModelId: undefined,
      ai_model: undefined,
    });

    // Fetch models for the selected provider
    await fetchModels(providerId);
  };

  const handleModelChange = (modelId: string) => {
    setSelectedModel(modelId);
    onConfigChange({
      selectedModelId: modelId,
      ai_model: modelId,
    });
  };

  // Prepare options for SearchableSelect
  const providerOptions = activeProviders.map((provider) => ({
    value: provider.id,
    label: provider.name,
    description: provider.description,
  }));

  const modelOptions = availableModels
    .filter((model) => model.status === "active")
    .map((model) => ({
      value: model.id,
      label: model.name,
      description: `${model.description} • ${model.pricing}${model.recommended ? " • Recommended" : ""}`,
    }));

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin mr-2" />
        <span>Loading AI models...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600 mb-4">Error loading AI models: {error}</p>
        <Button onClick={() => window.location.reload()}>Retry</Button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold mb-2">AI Model Selection</h3>
          <p className="text-sm text-muted-foreground">
            Choose the AI provider and model that will power your chat widget
          </p>
        </div>
        <Button variant="outline" size="sm">
          <Settings className="h-4 w-4 mr-2" />
          Manage Models
        </Button>
      </div>

      {/* Dual Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column - Provider & Model Selection */}
        <div className="space-y-6">
          <div>
            <h4 className="text-base font-medium mb-4 text-muted-foreground uppercase tracking-wide text-xs">
              Provider Selection
            </h4>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-base font-medium">AI Provider</Label>
                <SearchableSelect
                  options={providerOptions}
                  value={selectedProvider}
                  onValueChange={handleProviderChange}
                  placeholder="Search and select an AI provider..."
                />
              </div>

              {selectedProvider && (
                <div className="space-y-2">
                  <Label className="text-base font-medium">AI Model</Label>
                  <SearchableSelect
                    options={modelOptions}
                    value={selectedModel}
                    onValueChange={handleModelChange}
                    placeholder="Search and select a model..."
                  />
                </div>
              )}
            </div>
          </div>

          {/* Configuration Notice */}
          <div className="p-4 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg">
            <div className="flex items-start space-x-3">
              <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                  Model Configuration
                </p>
                <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
                  Model parameters, safety filters, and advanced settings are
                  managed in the dedicated AI Models module. This ensures
                  consistent configuration across all widgets using the same
                  model.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Selection Details */}
        <div className="space-y-6">
          {selectedProviderData && selectedModelData ? (
            <div>
              <h4 className="text-base font-medium mb-4 text-muted-foreground uppercase tracking-wide text-xs">
                Selected Configuration
              </h4>

              <div className="space-y-6 p-6 bg-muted/30 rounded-lg border">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <h5 className="text-lg font-semibold">
                    Configuration Active
                  </h5>
                </div>

                {/* Provider Details */}
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <Brain className="h-6 w-6 text-blue-600 mt-0.5" />
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h6 className="font-semibold">
                          {selectedProviderData.name}
                        </h6>
                        <Badge variant="outline" className="text-xs">
                          {selectedProviderData.website || "API"}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {selectedProviderData.description}
                      </p>
                    </div>
                  </div>

                  {/* Model Details */}
                  <div className="ml-9 pl-3 border-l-2 border-muted-foreground/20">
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <h6 className="font-medium">
                          {selectedModelData.name}
                        </h6>
                        {selectedModelData.recommended && (
                          <Badge variant="default" className="text-xs">
                            Recommended
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {selectedModelData.description}
                      </p>

                      {/* Model Specifications */}
                      <div className="grid grid-cols-1 gap-4">
                        <div className="flex justify-between items-center p-3 bg-background rounded border">
                          <span className="text-sm font-medium text-muted-foreground">
                            Context Window
                          </span>
                          <span className="text-sm font-semibold">
                            {selectedModelData.context_window ||
                              selectedModelData.contextWindow}
                          </span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-background rounded border">
                          <span className="text-sm font-medium text-muted-foreground">
                            Pricing
                          </span>
                          <span className="text-sm font-semibold">
                            {selectedModelData.pricing}
                          </span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-background rounded border">
                          <span className="text-sm font-medium text-muted-foreground">
                            Speed Score
                          </span>
                          <div className="flex items-center space-x-2">
                            <div className="w-16 bg-muted rounded-full h-2">
                              <div
                                className="bg-blue-600 h-2 rounded-full"
                                style={{
                                  width: `${selectedModelData.performance?.speed || 85}%`,
                                }}
                              ></div>
                            </div>
                            <span className="text-sm font-semibold">
                              {selectedModelData.performance?.speed || 85}%
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <Brain className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h5 className="font-medium text-muted-foreground mb-2">
                No Model Selected
              </h5>
              <p className="text-sm text-muted-foreground">
                Choose a provider and model to see configuration details
              </p>
            </div>
          )}

          {/* Inactive Providers Notice */}
          {providers.some((provider) => provider.status === "inactive") && (
            <div className="p-4 bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-800 rounded-lg">
              <div className="flex items-start space-x-3">
                <Info className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-yellow-900 dark:text-yellow-100">
                    Additional Providers Available
                  </p>
                  <p className="text-xs text-yellow-700 dark:text-yellow-300 mt-1 mb-3">
                    Some providers are currently inactive. Contact support to
                    activate additional providers.
                  </p>
                  <Button variant="outline" size="sm">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Contact Support
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
