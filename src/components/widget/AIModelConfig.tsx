import React, { useState, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { SearchableSelect } from '@/components/ui/combobox';
import { Badge } from '@/components/ui/badge';
import {
  Brain, Sparkles, Zap, ExternalLink, CheckCircle, Settings, Info
} from 'lucide-react';
import { WidgetConfig } from './WidgetConfiguration';

interface AIModelConfigProps {
  config: WidgetConfig;
  onConfigChange: (updates: Partial<WidgetConfig>) => void;
}

export const AIModelConfig = ({ config, onConfigChange }: AIModelConfigProps) => {
  const [selectedProvider, setSelectedProvider] = useState('');
  const [selectedModel, setSelectedModel] = useState(config.selectedModelId || '');

  // Organized by providers for clean hierarchy
  const providers = [
    {
      id: 'openai',
      name: 'OpenAI',
      description: 'Industry-leading AI models with exceptional performance and reliability',
      icon: Brain,
      iconColor: 'text-blue-600',
      bgColor: 'bg-blue-50 dark:bg-blue-950',
      borderColor: 'border-blue-200 dark:border-blue-800',
      status: 'active' as const,
      website: 'openai.com',
      models: [
        {
          id: 'gpt-4',
          name: 'GPT-4',
          description: 'Most capable model for complex reasoning, analysis, and creative tasks',
          status: 'active' as const,
          recommended: true,
          contextWindow: '128K tokens',
          pricing: '$0.03/1K tokens',
          performance: { speed: 85, accuracy: 95, cost: 70 }
        },
        {
          id: 'gpt-4-turbo',
          name: 'GPT-4 Turbo',
          description: 'Faster and more cost-effective version with enhanced capabilities',
          status: 'active' as const,
          recommended: false,
          contextWindow: '128K tokens',
          pricing: '$0.01/1K tokens',
          performance: { speed: 95, accuracy: 90, cost: 85 }
        },
        {
          id: 'gpt-3.5-turbo',
          name: 'GPT-3.5 Turbo',
          description: 'Fast and efficient model for simple conversational tasks',
          status: 'active' as const,
          recommended: false,
          contextWindow: '16K tokens',
          pricing: '$0.002/1K tokens',
          performance: { speed: 98, accuracy: 80, cost: 95 }
        }
      ]
    },
    {
      id: 'anthropic',
      name: 'Anthropic',
      description: 'Constitutional AI with strong safety features and advanced reasoning',
      icon: Sparkles,
      iconColor: 'text-purple-600',
      bgColor: 'bg-purple-50 dark:bg-purple-950',
      borderColor: 'border-purple-200 dark:border-purple-800',
      status: 'active' as const,
      website: 'anthropic.com',
      models: [
        {
          id: 'claude-3-opus',
          name: 'Claude-3 Opus',
          description: 'Most intelligent model for complex reasoning and analysis',
          status: 'active' as const,
          recommended: true,
          contextWindow: '200K tokens',
          pricing: '$0.015/1K tokens',
          performance: { speed: 80, accuracy: 93, cost: 60 }
        },
        {
          id: 'claude-3-sonnet',
          name: 'Claude-3 Sonnet',
          description: 'Balanced performance and cost for most use cases',
          status: 'active' as const,
          recommended: false,
          contextWindow: '200K tokens',
          pricing: '$0.003/1K tokens',
          performance: { speed: 88, accuracy: 92, cost: 80 }
        },
        {
          id: 'claude-3-haiku',
          name: 'Claude-3 Haiku',
          description: 'Fast and affordable model for simple tasks',
          status: 'active' as const,
          recommended: false,
          contextWindow: '200K tokens',
          pricing: '$0.00025/1K tokens',
          performance: { speed: 95, accuracy: 85, cost: 90 }
        }
      ]
    },
    {
      id: 'meta',
      name: 'Meta',
      description: 'Open-source models with excellent performance and transparency',
      icon: Zap,
      iconColor: 'text-orange-600',
      bgColor: 'bg-orange-50 dark:bg-orange-950',
      borderColor: 'border-orange-200 dark:border-orange-800',
      status: 'active' as const,
      website: 'llama.meta.com',
      models: [
        {
          id: 'llama-3-70b',
          name: 'Llama-3 70B',
          description: 'Large open-source model with excellent performance',
          status: 'active' as const,
          recommended: true,
          contextWindow: '32K tokens',
          pricing: '$0.0008/1K tokens',
          performance: { speed: 90, accuracy: 88, cost: 95 }
        },
        {
          id: 'llama-3-8b',
          name: 'Llama-3 8B',
          description: 'Efficient model for fast responses and lower costs',
          status: 'active' as const,
          recommended: false,
          contextWindow: '32K tokens',
          pricing: '$0.0002/1K tokens',
          performance: { speed: 98, accuracy: 82, cost: 98 }
        }
      ]
    },
    {
      id: 'google',
      name: 'Google',
      description: 'Multimodal AI with advanced reasoning capabilities',
      icon: Brain,
      iconColor: 'text-green-600',
      bgColor: 'bg-green-50 dark:bg-green-950',
      borderColor: 'border-green-200 dark:border-green-800',
      status: 'inactive' as const,
      website: 'ai.google.dev',
      models: [
        {
          id: 'gemini-pro',
          name: 'Gemini Pro',
          description: 'Multimodal AI with strong reasoning capabilities',
          status: 'inactive' as const,
          recommended: false,
          contextWindow: '32K tokens',
          pricing: '$0.0005/1K tokens',
          performance: { speed: 88, accuracy: 90, cost: 80 }
        }
      ]
    }
  ];

  const activeProviders = providers.filter(provider => provider.status === 'active');
  const selectedProviderData = providers.find(provider => provider.id === selectedProvider);
  const availableModels = selectedProviderData?.models.filter(model => model.status === 'active') || [];
  const selectedModelData = selectedProviderData?.models.find(model => model.id === selectedModel);

  // Initialize provider selection based on current model
  useEffect(() => {
    if (selectedModel && !selectedProvider) {
      const providerWithModel = providers.find(provider =>
        provider.models.some(model => model.id === selectedModel)
      );
      if (providerWithModel) {
        setSelectedProvider(providerWithModel.id);
      }
    }
  }, [selectedModel, selectedProvider, providers]);

  const handleProviderChange = (providerId: string) => {
    setSelectedProvider(providerId);
    setSelectedModel(''); // Reset model selection when provider changes
    onConfigChange({ selectedModelId: undefined });
  };

  const handleModelChange = (modelId: string) => {
    setSelectedModel(modelId);
    onConfigChange({ selectedModelId: modelId });
  };

  // Prepare options for SearchableSelect
  const providerOptions = activeProviders.map(provider => ({
    value: provider.id,
    label: provider.name,
    description: `${provider.description} • ${provider.models.filter(m => m.status === 'active').length} models`
  }));

  const modelOptions = availableModels.map(model => ({
    value: model.id,
    label: model.name,
    description: `${model.description} • ${model.pricing}${model.recommended ? ' • Recommended' : ''}`
  }));

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
            <h4 className="text-base font-medium mb-4 text-muted-foreground uppercase tracking-wide text-xs">Provider Selection</h4>
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
                <p className="text-sm font-medium text-blue-900 dark:text-blue-100">Model Configuration</p>
                <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
                  Model parameters, safety filters, and advanced settings are managed in the dedicated AI Models module.
                  This ensures consistent configuration across all widgets using the same model.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Selection Details */}
        <div className="space-y-6">
          {selectedProviderData && selectedModelData ? (
            <div>
              <h4 className="text-base font-medium mb-4 text-muted-foreground uppercase tracking-wide text-xs">Selected Configuration</h4>

              <div className="space-y-6 p-6 bg-muted/30 rounded-lg border">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <h5 className="text-lg font-semibold">Configuration Active</h5>
                </div>

                {/* Provider Details */}
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <selectedProviderData.icon className={`h-6 w-6 ${selectedProviderData.iconColor} mt-0.5`} />
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h6 className="font-semibold">{selectedProviderData.name}</h6>
                        <Badge variant="outline" className="text-xs">{selectedProviderData.website}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{selectedProviderData.description}</p>
                    </div>
                  </div>

                  {/* Model Details */}
                  <div className="ml-9 pl-3 border-l-2 border-muted-foreground/20">
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <h6 className="font-medium">{selectedModelData.name}</h6>
                        {selectedModelData.recommended && (
                          <Badge variant="default" className="text-xs">Recommended</Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">{selectedModelData.description}</p>

                      {/* Model Specifications */}
                      <div className="grid grid-cols-1 gap-4">
                        <div className="flex justify-between items-center p-3 bg-background rounded border">
                          <span className="text-sm font-medium text-muted-foreground">Context Window</span>
                          <span className="text-sm font-semibold">{selectedModelData.contextWindow}</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-background rounded border">
                          <span className="text-sm font-medium text-muted-foreground">Pricing</span>
                          <span className="text-sm font-semibold">{selectedModelData.pricing}</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-background rounded border">
                          <span className="text-sm font-medium text-muted-foreground">Speed Score</span>
                          <div className="flex items-center space-x-2">
                            <div className="w-16 bg-muted rounded-full h-2">
                              <div
                                className="bg-blue-600 h-2 rounded-full"
                                style={{ width: `${selectedModelData.performance.speed}%` }}
                              ></div>
                            </div>
                            <span className="text-sm font-semibold">{selectedModelData.performance.speed}%</span>
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
              <h5 className="font-medium text-muted-foreground mb-2">No Model Selected</h5>
              <p className="text-sm text-muted-foreground">
                Choose a provider and model to see configuration details
              </p>
            </div>
          )}

          {/* Inactive Providers Notice */}
          {providers.some(provider => provider.status === 'inactive') && (
            <div className="p-4 bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-800 rounded-lg">
              <div className="flex items-start space-x-3">
                <Info className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-yellow-900 dark:text-yellow-100">Additional Providers Available</p>
                  <p className="text-xs text-yellow-700 dark:text-yellow-300 mt-1 mb-3">
                    Some providers are currently inactive. Visit the AI Models module to activate additional providers like Google Gemini.
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
