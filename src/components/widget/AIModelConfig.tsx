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
import { apiClient } from "@/services/api";

interface AIModelConfigProps {
  config: WidgetConfig;
  onConfigChange: (updates: Partial<WidgetConfig>) => void;
}

export const AIModelConfig = ({
  config,
  onConfigChange,
}: AIModelConfigProps) => {
  const [selectedProvider, setSelectedProvider] = useState("");
  const [selectedModel, setSelectedModel] = useState(
    config.selectedModelId || "",
  );

  // API data state
  const [providers, setProviders] = useState<any[]>([]);
  const [models, setModels] = useState<any[]>([]);
  const [isLoadingProviders, setIsLoadingProviders] = useState(true);
  const [isLoadingModels, setIsLoadingModels] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load providers and models from API
  useEffect(() => {
    loadProviders();
  }, []);

  const loadProviders = async () => {
    setIsLoadingProviders(true);
    setError(null);

    try {
      const response = await apiClient.providers.getProviders();
      const transformedProviders = response.data.map((apiProvider: any) => ({
        id: apiProvider.slug,
        name: apiProvider.name,
        description: apiProvider.description || getProviderDescription(apiProvider.slug),
        icon: getProviderIcon(apiProvider.slug),
        iconColor: getProviderIconColor(apiProvider.slug),
        bgColor: getProviderBgColor(apiProvider.slug),
        borderColor: getProviderBorderColor(apiProvider.slug),
        status: apiProvider.is_active ? "active" : "inactive",
        website: getProviderWebsite(apiProvider.slug),
        models: [], // Will be loaded separately
      }));
      setProviders(transformedProviders);

      // Load models for all active providers
      await loadAllModels(response.data.filter((p: any) => p.is_active));
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to load providers";
      setError(errorMessage);
      console.error("Failed to load providers:", error);
    } finally {
      setIsLoadingProviders(false);
    }
  };

  const loadAllModels = async (apiProviders: any[]) => {
    setIsLoadingModels(true);
    const allModels: any[] = [];

    try {
      for (const apiProvider of apiProviders) {
        const response = await apiClient.providers.getProviderModels(apiProvider.id);
        const providerModels = response.data.map((apiModel: any) => ({
          id: apiModel.model_id,
          name: apiModel.name,
          description: apiModel.description || `${apiModel.name} model`,
          cost: `$${apiModel.input_cost}/1k`,
          recommended: apiModel.is_default,
          contextWindow: `${Math.round(apiModel.context_window / 1000)}K`,
          capabilities: apiModel.capabilities || [],
          performance: {
            speed: Math.floor(Math.random() * 30) + 70, // Mock performance data
            accuracy: Math.floor(Math.random() * 20) + 80,
            cost: Math.floor(Math.random() * 40) + 60,
          },
          providerId: apiProvider.slug,
          isActive: apiModel.is_active,
          status: apiModel.is_active ? "active" : "inactive",
        }));
        allModels.push(...providerModels);
      }

      setModels(allModels);

      // Update providers with their models
      setProviders((prev) =>
        prev.map((provider) => ({
          ...provider,
          models: allModels.filter((model) => model.providerId === provider.id),
        })),
      );
    } catch (error) {
      console.error("Failed to load models:", error);
    } finally {
      setIsLoadingModels(false);
    }
  };

  const getProviderIcon = (slug: string) => {
    const icons: Record<string, any> = {
      openai: Brain,
      anthropic: Sparkles,
      groq: Zap,
      google: Brain,
      mistral: Sparkles,
      meta: Brain,
      cohere: Brain,
      huggingface: Brain,
      perplexity: Brain,
      openrouter: Brain,
      xai: Brain,
      codestral: Brain,
    };
    return icons[slug] || Brain;
  };

  const getProviderIconColor = (slug: string) => {
    const colors: Record<string, string> = {
      openai: "text-blue-600",
      anthropic: "text-purple-600",
      groq: "text-yellow-600",
      google: "text-green-600",
      mistral: "text-orange-600",
      meta: "text-blue-500",
      cohere: "text-teal-600",
      huggingface: "text-yellow-500",
      perplexity: "text-indigo-600",
      openrouter: "text-gray-600",
      xai: "text-red-600",
      codestral: "text-purple-500",
    };
    return colors[slug] || "text-gray-600";
  };

  const getProviderBgColor = (slug: string) => {
    const colors: Record<string, string> = {
      openai: "bg-blue-50 dark:bg-blue-950",
      anthropic: "bg-purple-50 dark:bg-purple-950",
      groq: "bg-yellow-50 dark:bg-yellow-950",
      google: "bg-green-50 dark:bg-green-950",
      mistral: "bg-orange-50 dark:bg-orange-950",
      meta: "bg-blue-50 dark:bg-blue-950",
      cohere: "bg-teal-50 dark:bg-teal-950",
      huggingface: "bg-yellow-50 dark:bg-yellow-950",
      perplexity: "bg-indigo-50 dark:bg-indigo-950",
      openrouter: "bg-gray-50 dark:bg-gray-950",
      xai: "bg-red-50 dark:bg-red-950",
      codestral: "bg-purple-50 dark:bg-purple-950",
    };
    return colors[slug] || "bg-gray-50 dark:bg-gray-950";
  };

  const getProviderBorderColor = (slug: string) => {
    const colors: Record<string, string> = {
      openai: "border-blue-200 dark:border-blue-800",
      anthropic: "border-purple-200 dark:border-purple-800",
      groq: "border-yellow-200 dark:border-yellow-800",
      google: "border-green-200 dark:border-green-800",
      mistral: "border-orange-200 dark:border-orange-800",
      meta: "border-blue-200 dark:border-blue-800",
      cohere: "border-teal-200 dark:border-teal-800",
      huggingface: "border-yellow-200 dark:border-yellow-800",
      perplexity: "border-indigo-200 dark:border-indigo-800",
      openrouter: "border-gray-200 dark:border-gray-800",
      xai: "border-red-200 dark:border-red-800",
      codestral: "border-purple-200 dark:border-purple-800",
    };
    return colors[slug] || "border-gray-200 dark:border-gray-800";
  };

  const getProviderDescription = (slug: string) => {
    const descriptions: Record<string, string> = {
      openai: "Industry-leading AI models with exceptional performance and reliability",
      anthropic: "Constitutional AI with strong safety features and advanced reasoning",
      groq: "Ultra-fast inference with optimized hardware acceleration",
      google: "Multimodal AI with advanced reasoning capabilities",
      mistral: "Open-source models with excellent performance and transparency",
      meta: "Open-source models with excellent performance and transparency",
      cohere: "Enterprise-focused AI with strong language understanding",
      huggingface: "Open-source community models with diverse capabilities",
      perplexity: "Search-augmented AI with real-time information access",
      openrouter: "Access to multiple AI providers through a unified API",
      xai: "Advanced AI models with enhanced reasoning capabilities",
      codestral: "Specialized models for code generation and analysis",
    };
    return descriptions[slug] || "AI provider with advanced language models";
  };

  const getProviderWebsite = (slug: string) => {
    const websites: Record<string, string> = {
      openai: "openai.com",
      anthropic: "anthropic.com",
      groq: "groq.com",
      google: "ai.google.dev",
      mistral: "mistral.ai",
      meta: "llama.meta.com",
      cohere: "cohere.ai",
      huggingface: "huggingface.co",
      perplexity: "perplexity.ai",
      openrouter: "openrouter.ai",
      xai: "x.ai",
      codestral: "mistral.ai",
    };
    return websites[slug] || "provider.com";
  };

  const activeProviders = providers.filter(
    (provider) => provider.status === "active",
  );
  const selectedProviderData = providers.find(
    (provider) => provider.id === selectedProvider,
  );
  const availableModels =
    selectedProviderData?.models.filter((model: any) => model.status === "active") ||
    [];
  const selectedModelData = selectedProviderData?.models.find(
    (model: any) => model.id === selectedModel,
  );

  // Initialize provider selection based on current model
  useEffect(() => {
    if (selectedModel && !selectedProvider) {
      const providerWithModel = providers.find((provider) =>
        provider.models.some((model: any) => model.id === selectedModel),
      );
      if (providerWithModel) {
        setSelectedProvider(providerWithModel.id);
      }
    }
  }, [selectedModel, selectedProvider, providers]);

  const handleProviderChange = (providerId: string) => {
    setSelectedProvider(providerId);
    setSelectedModel(""); // Reset model selection when provider changes
    onConfigChange({ selectedModelId: undefined });
  };

  const handleModelChange = (modelId: string) => {
    setSelectedModel(modelId);
    onConfigChange({ selectedModelId: modelId });
  };

  // Prepare options for SearchableSelect
  const providerOptions = activeProviders.map((provider) => ({
    value: provider.id,
    label: provider.name,
    description: `${provider.description} • ${provider.models.filter((m: any) => m.status === "active").length} models`,
  }));

  const modelOptions = availableModels.map((model: any) => ({
    value: model.id,
    label: model.name,
    description: `${model.description} • ${model.cost}${model.recommended ? " • Recommended" : ""}`,
  }));

  if (isLoadingProviders) {
    return (
      <div className="space-y-8">
        <div className="text-center py-12">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <h3 className="text-lg font-semibold mb-2">Loading AI Configuration</h3>
          <p className="text-muted-foreground">
            Loading providers and models from the API...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-8">
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center mx-auto mb-4">
            <ExternalLink className="h-8 w-8 text-red-600" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Configuration Error</h3>
          <p className="text-muted-foreground mb-4">{error}</p>
          <Button variant="outline" onClick={loadProviders}>
            <Loader2 className="h-4 w-4 mr-2" />
            Retry
          </Button>
        </div>
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
                    <selectedProviderData.icon
                      className={`h-6 w-6 ${selectedProviderData.iconColor} mt-0.5`}
                    />
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h6 className="font-semibold">
                          {selectedProviderData.name}
                        </h6>
                        <Badge variant="outline" className="text-xs">
                          {selectedProviderData.website}
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
                            {selectedModelData.contextWindow}
                          </span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-background rounded border">
                          <span className="text-sm font-medium text-muted-foreground">
                            Pricing
                          </span>
                          <span className="text-sm font-semibold">
                            {selectedModelData.cost}
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
                                  width: `${selectedModelData.performance.speed}%`,
                                }}
                              ></div>
                            </div>
                            <span className="text-sm font-semibold">
                              {selectedModelData.performance.speed}%
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
                    Some providers are currently inactive. Visit the AI Models
                    module to activate additional providers like Google Gemini.
                  </p>
                  <Button variant="outline" size="sm">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Activate Providers
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
