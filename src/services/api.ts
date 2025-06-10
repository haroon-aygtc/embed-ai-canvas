// API Configuration
const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:8000/api";

// Types
export interface ApiProvider {
  id: number;
  name: string;
  slug: string;
  base_url: string;
  api_key?: string;
  region?: string;
  is_active: boolean;
  status:
  | "unconfigured"
  | "configuring"
  | "testing"
  | "test-failed"
  | "test-passed"
  | "saving"
  | "configured"
  | "fetching-models"
  | "ready"
  | "error";
  last_tested_at?: string;
  last_saved_at?: string;
  test_result?: {
    success: boolean;
    message: string;
    latency?: number;
    timestamp: string;
  };
  created_at: string;
  updated_at: string;
}

export interface ApiModel {
  id: number;
  provider_id: number;
  name: string;
  model_id: string;
  description?: string;
  family: string;
  context_window: number;
  max_tokens: number;
  input_cost: number;
  output_cost: number;
  capabilities: string[];
  is_deprecated: boolean;
  is_saved: boolean;
  is_active: boolean;
  is_default: boolean;
  release_date?: string;
  created_at: string;
  updated_at: string;
}

export interface TestConnectionRequest {
  api_key: string;
  base_url?: string;
  region?: string;
}

export interface TestConnectionResponse {
  success: boolean;
  message: string;
  latency?: number;
  timestamp: string;
}

export interface SaveProviderRequest {
  api_key: string;
  base_url?: string;
  region?: string;
}

export interface ChatCompletionRequest {
  provider_id: number;
  model_id: string;
  messages: Array<{
    role: "user" | "assistant" | "system";
    content: string;
  }>;
  temperature?: number;
  max_tokens?: number;
}

export interface ChatCompletionResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: Array<{
    index: number;
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
  }>;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
  response_time: number;
}

export interface Widget {
  id: number;
  user_id: number;
  name: string;
  enabled: boolean;
  configuration: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface WidgetConfiguration {
  title: string;
  subtitle: string;
  enabled: boolean;
  showBranding: boolean;
  selectedModelId: string | null;
}

export interface CreateWidgetRequest {
  name: string;
  enabled: boolean;
  configuration: Record<string, any>;
}

export interface UpdateWidgetRequest {
  name?: string;
  enabled?: boolean;
  configuration?: Record<string, any>;
}

export interface ToggleWidgetStatusRequest {
  enabled: boolean;
}


export interface ToggleWidgetStatusResponse {
  id: number;
  enabled: boolean;
  last_updated_at: string;
}




// API Client Class
class ApiClient {
  private baseURL: string;
  private headers: Record<string, string>;

  constructor() {
    this.baseURL = API_BASE_URL;
    this.headers = {
      "Content-Type": "application/json",
      Accept: "application/json",

    };
  }




  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const config: RequestInit = {
      headers: this.headers,
      ...options,
    };

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message ||
          errorData.error ||
          `HTTP ${response.status}: ${response.statusText}`,
        );
      }

      return await response.json();
    } catch (error) {
      console.error(`API request failed: ${endpoint}`, error);
      throw error;
    }
  }

  // Provider endpoints
  async getProviders(): Promise<{ data: ApiProvider[] }> {
    return this.request<{ data: ApiProvider[] }>("/providers");
  }

  async getProvider(id: number): Promise<{ data: ApiProvider }> {
    return this.request<{ data: ApiProvider }>(`/providers/${id}`);
  }

  async testProviderConnection(
    id: number,
    data: TestConnectionRequest,
  ): Promise<{ data: TestConnectionResponse }> {
    return this.request<{ data: TestConnectionResponse }>(
      `/providers/${id}/test`,
      {
        method: "POST",
        body: JSON.stringify(data),
      },
    );
  }

  async saveProvider(
    id: number,
    data: SaveProviderRequest,
  ): Promise<{ data: ApiProvider }> {
    return this.request<{ data: ApiProvider }>(`/providers/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async toggleProviderStatus(
    id: number,
    isActive: boolean,
  ): Promise<{ data: ApiProvider }> {
    return this.request<{ data: ApiProvider }>(`/providers/${id}/toggle`, {
      method: "PATCH",
      body: JSON.stringify({ is_active: isActive }),
    });
  }

  // Model endpoints
  async getProviderModels(providerId: number): Promise<{ data: ApiModel[] }> {
    return this.request<{ data: ApiModel[] }>(
      `/providers/${providerId}/models`,
    );
  }

  async getAllModels(): Promise<{ data: ApiModel[] }> {
    return this.request<{ data: ApiModel[] }>("/models");
  }

  async updateModel(
    id: number,
    data: Partial<Pick<ApiModel, "is_saved" | "is_active" | "is_default">>,
  ): Promise<{ data: ApiModel }> {
    return this.request<{ data: ApiModel }>(`/models/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async bulkUpdateModels(
    modelIds: number[],
    data: Partial<Pick<ApiModel, "is_saved" | "is_active" | "is_default">>,
  ): Promise<{ data: ApiModel[] }> {
    return this.request<{ data: ApiModel[] }>("/models/bulk-update", {
      method: "PUT",
      body: JSON.stringify({
        model_ids: modelIds,
        ...data,
      }),
    });
  }

  // Chat completion endpoint
  async sendChatCompletion(
    data: ChatCompletionRequest,
  ): Promise<{ data: ChatCompletionResponse }> {
    return this.request<{ data: ChatCompletionResponse }>("/chat/completions", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  // Widget endpoints
  async getWidgets(): Promise<{ data: Widget[] }> {
    return this.request<{ data: Widget[] }>("/widgets");
  }

  async getWidget(id: number): Promise<{ data: Widget }> {
    return this.request<{ data: Widget }>(`/widgets/${id}`);
  }

  async createWidget(data: CreateWidgetRequest): Promise<{ data: Widget }> {
    return this.request<{ data: Widget }>("/widgets", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async updateWidget(
    id: number,
    data: UpdateWidgetRequest,
  ): Promise<{ data: Widget }> {
    return this.request<{ data: Widget }>(`/widgets/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async deleteWidget(id: number): Promise<{ success: boolean; message: string }> {
    return this.request<{ success: boolean; message: string }>(`/widgets/${id}`, {
      method: "DELETE",
    });
  }

  async toggleWidgetStatus(
    id: number,
  ): Promise<{ data: { id: number; enabled: boolean; last_updated_at: string } }> {
    return this.request<{ data: { id: number; enabled: boolean; last_updated_at: string } }>(
      `/widgets/${id}/toggle`,
      {
        method: "PATCH",
      },
    );
  }
}

// Export singleton instance
export const apiClient = new ApiClient();

// Utility functions for data transformation
export const transformApiProviderToFrontend = (apiProvider: ApiProvider) => {
  return {
    id: apiProvider.slug,
    name: apiProvider.name,
    icon: getProviderIcon(apiProvider.slug),
    description: getProviderDescription(apiProvider.slug),
    status: apiProvider.status,
    apiKey: apiProvider.api_key,
    baseUrl: apiProvider.base_url,
    region: apiProvider.region,
    lastTested: apiProvider.last_tested_at,
    lastSaved: apiProvider.last_saved_at,
    testResult: apiProvider.test_result,
    pricing: getProviderPricing(apiProvider.slug),
    features: getProviderFeatures(apiProvider.slug),
    limits: getProviderLimits(apiProvider.slug),
    latency: apiProvider.test_result?.latency,
    uptime: 99.8, // This would come from monitoring service
    totalRequests: 0, // This would come from analytics
    errorRate: 0.2, // This would come from analytics
    modelCount: 0, // Will be set when models are loaded
    savedModels: [], // Will be populated from models
  };
};

export const transformApiModelToFrontend = (apiModel: ApiModel) => {
  return {
    id: apiModel.model_id,
    name: apiModel.name,
    description: apiModel.description || "",
    family: apiModel.family,
    contextWindow: apiModel.context_window,
    maxTokens: apiModel.max_tokens,
    inputCost: apiModel.input_cost,
    outputCost: apiModel.output_cost,
    capabilities: apiModel.capabilities,
    isDeprecated: apiModel.is_deprecated,
    releaseDate: apiModel.release_date,
    isSaved: apiModel.is_saved,
    isActive: apiModel.is_active,
    isDefault: apiModel.is_default,
  };
};

// Helper functions for provider metadata
function getProviderIcon(slug: string): string {
  const icons: Record<string, string> = {
    openai: "🤖",
    anthropic: "🧠",
    groq: "⚡",
    google: "🔍",
    mistral: "🌪️",
    meta: "🦙",
    cohere: "🔗",
    huggingface: "🤗",
    perplexity: "🔍",
    openrouter: "🛣️",
    xai: "❌",
    codestral: "💻",
  };
  return icons[slug] || "🤖";
}

function getProviderDescription(slug: string): string {
  const descriptions: Record<string, string> = {
    openai: "Industry-leading AI models with exceptional performance",
    anthropic: "Constitutional AI with strong safety and reasoning",
    groq: "Ultra-fast inference with specialized hardware",
    google: "Google's advanced AI models and services",
    mistral: "European AI with multilingual capabilities",
    meta: "Open-source models from Meta AI",
    cohere: "Enterprise-focused language models",
    huggingface: "Open-source AI model hub and inference",
    perplexity: "AI-powered search and reasoning",
    openrouter: "Unified API for multiple AI providers",
    xai: "Grok AI models from xAI",
    codestral: "Code-specialized AI models",
  };
  return descriptions[slug] || "AI provider";
}

function getProviderPricing(slug: string) {
  const pricing: Record<
    string,
    { inputCost: string; outputCost: string; currency: string }
  > = {
    openai: { inputCost: "$0.03", outputCost: "$0.06", currency: "USD" },
    anthropic: { inputCost: "$0.015", outputCost: "$0.075", currency: "USD" },
    groq: { inputCost: "$0.0008", outputCost: "$0.0008", currency: "USD" },
    google: { inputCost: "$0.001", outputCost: "$0.002", currency: "USD" },
    mistral: { inputCost: "$0.002", outputCost: "$0.006", currency: "USD" },
    meta: { inputCost: "$0.0005", outputCost: "$0.0015", currency: "USD" },
    cohere: { inputCost: "$0.001", outputCost: "$0.002", currency: "USD" },
    huggingface: {
      inputCost: "$0.0005",
      outputCost: "$0.0015",
      currency: "USD",
    },
    perplexity: { inputCost: "$0.001", outputCost: "$0.002", currency: "USD" },
    openrouter: { inputCost: "$0.002", outputCost: "$0.004", currency: "USD" },
    xai: { inputCost: "$0.005", outputCost: "$0.015", currency: "USD" },
    codestral: { inputCost: "$0.002", outputCost: "$0.006", currency: "USD" },
  };
  return (
    pricing[slug] || {
      inputCost: "$0.001",
      outputCost: "$0.002",
      currency: "USD",
    }
  );
}

function getProviderFeatures(slug: string): string[] {
  const features: Record<string, string[]> = {
    openai: ["Function Calling", "Vision", "Code Interpreter", "JSON Mode"],
    anthropic: [
      "Constitutional AI",
      "Long Context",
      "Safety Focused",
      "Reasoning",
    ],
    groq: ["Ultra-Fast", "Low Latency", "Open Source Models", "Cost Effective"],
    google: ["Multimodal", "Search Integration", "Large Context", "Reasoning"],
    mistral: ["Multilingual", "European AI", "Code Generation", "Reasoning"],
    meta: ["Open Source", "Code Generation", "Multilingual", "Research"],
    cohere: ["Enterprise", "Embeddings", "Classification", "Generation"],
    huggingface: ["Open Source", "Model Hub", "Custom Models", "Community"],
    perplexity: ["Search", "Real-time", "Citations", "Reasoning"],
    openrouter: ["Multi-Provider", "Unified API", "Model Selection", "Routing"],
    xai: ["Grok", "Real-time", "Twitter Integration", "Reasoning"],
    codestral: [
      "Code Generation",
      "Code Completion",
      "Debugging",
      "Refactoring",
    ],
  };
  return features[slug] || ["AI Generation", "Text Processing"];
}

function getProviderLimits(slug: string) {
  const limits: Record<
    string,
    { rateLimit: string; contextWindow: string; maxTokens: string }
  > = {
    openai: {
      rateLimit: "10,000 RPM",
      contextWindow: "128K",
      maxTokens: "4,096",
    },
    anthropic: {
      rateLimit: "5,000 RPM",
      contextWindow: "200K",
      maxTokens: "4,096",
    },
    groq: { rateLimit: "30,000 RPM", contextWindow: "32K", maxTokens: "8,192" },
    google: {
      rateLimit: "15,000 RPM",
      contextWindow: "1M",
      maxTokens: "8,192",
    },
    mistral: {
      rateLimit: "5,000 RPM",
      contextWindow: "32K",
      maxTokens: "4,096",
    },
    meta: { rateLimit: "10,000 RPM", contextWindow: "32K", maxTokens: "4,096" },
    cohere: {
      rateLimit: "10,000 RPM",
      contextWindow: "128K",
      maxTokens: "4,096",
    },
    huggingface: {
      rateLimit: "1,000 RPM",
      contextWindow: "32K",
      maxTokens: "2,048",
    },
    perplexity: {
      rateLimit: "5,000 RPM",
      contextWindow: "16K",
      maxTokens: "4,096",
    },
    openrouter: {
      rateLimit: "20,000 RPM",
      contextWindow: "128K",
      maxTokens: "4,096",
    },
    xai: { rateLimit: "5,000 RPM", contextWindow: "128K", maxTokens: "4,096" },
    codestral: {
      rateLimit: "5,000 RPM",
      contextWindow: "32K",
      maxTokens: "4,096",
    },
  };
  return (
    limits[slug] || {
      rateLimit: "5,000 RPM",
      contextWindow: "32K",
      maxTokens: "4,096",
    }
  );
}
