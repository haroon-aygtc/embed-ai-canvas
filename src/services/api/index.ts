// Main API exports
export * from './types';
export * from './base';
export * from './auth';
export * from './widgets';
export * from './providers';

// Import all API clients
import { authApi } from './auth';
import { widgetApi } from './widgets';
import { providersApi } from './providers';

// Unified API client class
export class ApiClient {
    public auth = authApi;
    public widgets = widgetApi;
    public providers = providersApi;

    /**
     * Set authentication token for all API clients
     */
    setAuthToken(token: string | null) {
        this.auth.setAuthToken(token);
        this.widgets.setAuthToken(token);
        this.providers.setAuthToken(token);
    }

    /**
     * Get current authentication token
     */
    getAuthToken(): string | null {
        return this.auth.getAuthToken();
    }

    /**
     * Clear authentication for all clients
     */
    clearAuth() {
        this.setAuthToken(null);
    }
}

// Export singleton instance
export const apiClient = new ApiClient();

// Legacy exports for backward compatibility
export const {
    // Auth methods
    register: registerUser,
    login: loginUser,
    logout: logoutUser,
    getUser: getCurrentUser,
} = apiClient.auth;

export const {
    // Widget methods
    getWidgets,
    getWidget,
    createWidget,
    updateWidget,
    deleteWidget,
    toggleWidgetStatus,
    duplicateWidget,
    publishWidget,
    getWidgetStatistics,
} = apiClient.widgets;

export const {
    // Provider methods
    getProviders,
    getProvider,
    testProviderConnection,
    saveProvider,
    toggleProviderStatus,
    getProviderModels,
    getAllModels,
    getActiveModels,
    updateModel,
    bulkUpdateModels,
    sendChatCompletion,
} = apiClient.providers;

// Utility functions for data transformation (moved from original api.ts)
export const transformApiProviderToFrontend = (apiProvider: any) => {
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

export const transformApiModelToFrontend = (apiModel: any) => {
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