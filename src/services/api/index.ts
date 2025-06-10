// Main API exports
export * from './types';
export * from './base';
export * from './auth';
export * from './widgets';
export * from './providers';
export * from './widgetcontentapi';
export * from './widgetTemplatesapi';
export * from './widgetChatsapi';
export * from './widgetConfigurationsapi';
export * from './widgetBehaviorapi';
export * from './widgetAnalyticsapi';
export * from './knowledgeBasesapi';

// Import all API clients
import { authApi } from './auth';
import { widgetApi } from './widgets';
import { providersApi } from './providers';
import { widgetContentApi } from './widgetcontentapi';
import { widgetTemplatesApi } from './widgetTemplatesapi';
import { widgetChatsApi } from './widgetChatsapi';
import { widgetConfigurationsApi } from './widgetConfigurationsapi';
import { widgetBehaviorApi } from './widgetBehaviorapi';
import { widgetAnalyticsApi } from './widgetAnalyticsapi';
import { knowledgeBasesApi } from './knowledgeBasesapi';

// Unified API client class
export class ApiClient {
    public auth = authApi;
    public widgets = widgetApi;
    public providers = providersApi;
    public widgetContent = widgetContentApi;
    public widgetTemplates = widgetTemplatesApi;
    public widgetChats = widgetChatsApi;
    public widgetConfigurations = widgetConfigurationsApi;
    public widgetBehavior = widgetBehaviorApi;
    public widgetAnalytics = widgetAnalyticsApi;
    public knowledgeBases = knowledgeBasesApi;

    /**
     * Set authentication token for all API clients
     */
    setAuthToken(token: string | null) {
        this.auth.setAuthToken(token);
        this.widgets.setAuthToken(token);
        this.providers.setAuthToken(token);
        this.widgetContent.setAuthToken(token);
        this.widgetTemplates.setAuthToken(token);
        this.widgetChats.setAuthToken(token);
        this.widgetConfigurations.setAuthToken(token);
        this.widgetBehavior.setAuthToken(token);
        this.widgetAnalytics.setAuthToken(token);
        this.knowledgeBases.setAuthToken(token);
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

    // Legacy methods for backward compatibility
    async getAllModels() {
        return this.providers.getAllModels();
    }

    async chatCompletion(modelId: string, data: any) {
        return this.providers.sendChatCompletion(modelId, data);
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
    exportWidgetStatistics,
} = apiClient.widgets;

export const {
    // Widget Chat methods
    getConversations,
    createConversation,
    getConversationMessages,
    sendMessage,
    endConversation,
} = apiClient.widgetChats;

export const {
    // Widget Content methods
    getQuickResponses,
    createQuickResponse,
    updateQuickResponse,
    deleteQuickResponse,
    getConversationStarters,
    createConversationStarter,
    updateConversationStarter,
    deleteConversationStarter,
} = apiClient.widgetContent;

export const {
    // Widget Templates methods
    getTemplates,
    getPopularTemplates,
    getTemplatesByCategory,
} = apiClient.widgetTemplates;

export const {
    // Widget Configuration methods
    getConfigurations,
    getActiveConfiguration,
    createConfiguration,
    updateConfiguration,
    activateConfiguration,
    rollbackConfiguration,
    compareConfigurations,
    getConfigurationHistory,
    deleteConfiguration,
} = apiClient.widgetConfigurations;

export const {
    // Widget Behavior methods
    getBehaviorSettings,
    createBehaviorSettings,
    updateBehaviorSettings,
    getOperatingHours,
    updateOperatingHours,
} = apiClient.widgetBehavior;

export const {
    // Widget Analytics methods
    getAnalytics,
    getConversationAnalytics,
    getMessageAnalytics,
    exportAnalytics,
} = apiClient.widgetAnalytics;

export const {
    // Knowledge Base methods
    getKnowledgeBases,
    getKnowledgeBase,
    createKnowledgeBase,
    updateKnowledgeBase,
    deleteKnowledgeBase,
    uploadDocuments,
    getDocuments,
    deleteDocument,
    processKnowledgeBase,
    getProcessingStatus,
    searchKnowledgeBase,
} = apiClient.knowledgeBases;

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
    return descriptions[slug] || "Advanced AI language model";
}

function getProviderPricing(slug: string) {
    const pricing: Record<string, any> = {
        openai: {
            tier: "Premium",
            inputCost: 0.03,
            outputCost: 0.06,
            currency: "USD",
            unit: "1K tokens"
        },
        anthropic: {
            tier: "Premium",
            inputCost: 0.03,
            outputCost: 0.15,
            currency: "USD",
            unit: "1K tokens"
        },
        groq: {
            tier: "Performance",
            inputCost: 0.10,
            outputCost: 0.10,
            currency: "USD",
            unit: "1M tokens"
        },
        google: {
            tier: "Enterprise",
            inputCost: 0.125,
            outputCost: 0.375,
            currency: "USD",
            unit: "1M tokens"
        },
        // Add more providers as needed
    };
    return pricing[slug] || {
        tier: "Standard",
        inputCost: 0.01,
        outputCost: 0.02,
        currency: "USD",
        unit: "1K tokens"
    };
}

function getProviderFeatures(slug: string): string[] {
    const features: Record<string, string[]> = {
        openai: ["Function Calling", "Vision", "Code Generation", "JSON Mode"],
        anthropic: ["Constitutional AI", "Long Context", "Safety Focused", "Reasoning"],
        groq: ["Ultra Fast", "Real-time", "Low Latency", "High Throughput"],
        google: ["Multimodal", "Search Integration", "Enterprise Ready", "Scalable"],
        mistral: ["Multilingual", "European", "Code Generation", "Efficient"],
        meta: ["Open Source", "Research Focused", "Llama Models", "Community"],
        // Add more providers as needed
    };
    return features[slug] || ["Text Generation", "Chat Completion"];
}

function getProviderLimits(slug: string) {
    const limits: Record<string, any> = {
        openai: {
            requestsPerMinute: 3500,
            tokensPerMinute: 90000,
            requestsPerDay: 10000
        },
        anthropic: {
            requestsPerMinute: 1000,
            tokensPerMinute: 40000,
            requestsPerDay: 5000
        },
        groq: {
            requestsPerMinute: 30,
            tokensPerMinute: 6000,
            requestsPerDay: 14400
        },
        // Add more providers as needed
    };
    return limits[slug] || {
        requestsPerMinute: 1000,
        tokensPerMinute: 20000,
        requestsPerDay: 5000
    };
} 