import { BaseApiClient } from './base';
import {
    ApiProvider,
    ApiModel,
    TestConnectionRequest,
    TestConnectionResponse,
    SaveProviderRequest,
    ChatCompletionRequest,
    ChatCompletionResponse
} from './types';

export class ProvidersApiClient extends BaseApiClient {
    /**
     * Get all AI providers
     */
    async getProviders(): Promise<{ data: ApiProvider[] }> {
        return this.get<ApiProvider[]>('/ai-providers');
    }

    /**
     * Get a specific provider by ID
     */
    async getProvider(id: number): Promise<{ data: ApiProvider }> {
        return this.get<ApiProvider>(`/ai-providers/${id}`);
    }

    /**
     * Create a new provider
     */
    async createProvider(data: Partial<ApiProvider>): Promise<{ data: ApiProvider }> {
        return this.post<ApiProvider>('/ai-providers', data);
    }

    /**
     * Update an existing provider
     */
    async updateProvider(id: number, data: Partial<ApiProvider>): Promise<{ data: ApiProvider }> {
        return this.put<ApiProvider>(`/ai-providers/${id}`, data);
    }

    /**
     * Delete a provider
     */
    async deleteProvider(id: number): Promise<{ success: boolean; message: string }> {
        return this.delete(`/ai-providers/${id}`);
    }

    /**
     * Test provider connection
     */
    async testProviderConnection(id: number, data: TestConnectionRequest): Promise<{ data: TestConnectionResponse }> {
        return this.post<TestConnectionResponse>(`/ai-providers/${id}/test`, data);
    }

    /**
     * Save provider configuration
     */
    async saveProvider(id: number, data: SaveProviderRequest): Promise<{ data: ApiProvider }> {
        return this.put<ApiProvider>(`/ai-providers/${id}`, data);
    }

    /**
     * Toggle provider status
     */
    async toggleProviderStatus(id: number, isActive: boolean): Promise<{ data: ApiProvider }> {
        return this.patch<ApiProvider>(`/ai-providers/${id}/toggle`, { is_active: isActive });
    }

    /**
     * Fetch models for a provider
     */
    async fetchProviderModels(id: number): Promise<{ data: ApiModel[] }> {
        return this.post<ApiModel[]>(`/ai-providers/${id}/fetch-models`);
    }

    /**
     * Get models for a specific provider
     */
    async getProviderModels(providerId: number): Promise<{ data: ApiModel[] }> {
        return this.get<ApiModel[]>(`/ai-providers/${providerId}/models`);
    }

    /**
     * Get all models across all providers
     */
    async getAllModels(): Promise<{ data: ApiModel[] }> {
        return this.get<ApiModel[]>('/ai-models');
    }

    /**
     * Get only active models
     */
    async getActiveModels(): Promise<{ data: ApiModel[] }> {
        return this.get<ApiModel[]>('/ai-models/active');
    }

    /**
     * Update a model
     */
    async updateModel(
        id: number,
        data: Partial<Pick<ApiModel, "is_saved" | "is_active" | "is_default">>
    ): Promise<{ data: ApiModel }> {
        return this.put<ApiModel>(`/ai-models/${id}`, data);
    }

    /**
     * Bulk update models
     */
    async bulkUpdateModels(
        modelIds: number[],
        data: Partial<Pick<ApiModel, "is_saved" | "is_active" | "is_default">>
    ): Promise<{ data: ApiModel[] }> {
        return this.put<ApiModel[]>('/ai-models/bulk-update', {
            model_ids: modelIds,
            ...data,
        });
    }

    /**
     * Send chat completion request
     */
    async sendChatCompletion(data: ChatCompletionRequest): Promise<{ data: ChatCompletionResponse }> {
        return this.post<ChatCompletionResponse>('/ai-models/chat', data);
    }

    /**
     * Test a specific model
     */
    async testModel(modelId: number, data: {
        message: string;
        temperature?: number;
        max_tokens?: number;
    }): Promise<{ data: ChatCompletionResponse }> {
        return this.post<ChatCompletionResponse>(`/ai-models/${modelId}/test`, data);
    }

    /**
     * Get model usage statistics
     */
    async getModelUsage(modelId: number, params?: {
        start_date?: string;
        end_date?: string;
    }): Promise<{ data: any }> {
        const queryParams = new URLSearchParams();
        if (params?.start_date) queryParams.append('start_date', params.start_date);
        if (params?.end_date) queryParams.append('end_date', params.end_date);

        const endpoint = `/ai-models/${modelId}/usage${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
        return this.get<any>(endpoint);
    }

    /**
     * Get provider pricing information
     */
    async getProviderPricing(providerId: number): Promise<{ data: any }> {
        return this.get<any>(`/ai-providers/${providerId}/pricing`);
    }

    /**
     * Get provider limits and quotas
     */
    async getProviderLimits(providerId: number): Promise<{ data: any }> {
        return this.get<any>(`/ai-providers/${providerId}/limits`);
    }
}

// Export singleton instance
export const providersApi = new ProvidersApiClient(); 