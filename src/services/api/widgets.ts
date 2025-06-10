import { BaseApiClient } from './base';
import {
    Widget,
    CreateWidgetRequest,
    UpdateWidgetRequest,
    DuplicateWidgetRequest,
    ToggleWidgetStatusResponse,
    PublishWidgetResponse,
    WidgetStatistics
} from './types';

export class WidgetApiClient extends BaseApiClient {
    /**
     * Get all widgets for the authenticated user
     */
    async getWidgets(): Promise<{ data: Widget[] }> {
        return this.get<Widget[]>('/widgets');
    }

    /**
     * Get a specific widget by ID
     */
    async getWidget(id: number): Promise<{ data: Widget }> {
        return this.get<Widget>(`/widgets/${id}`);
    }

    /**
     * Create a new widget
     */
    async createWidget(data: CreateWidgetRequest): Promise<{ data: Widget }> {
        return this.post<Widget>('/widgets', data);
    }

    /**
     * Update an existing widget
     */
    async updateWidget(id: number, data: UpdateWidgetRequest): Promise<{ data: Widget }> {
        return this.put<Widget>(`/widgets/${id}`, data);
    }

    /**
     * Delete a widget
     */
    async deleteWidget(id: number): Promise<{ success: boolean; message: string }> {
        return this.delete(`/widgets/${id}`);
    }

    /**
     * Toggle widget status (enabled/disabled)
     */
    async toggleWidgetStatus(id: number): Promise<{ data: ToggleWidgetStatusResponse }> {
        return this.patch<ToggleWidgetStatusResponse>(`/widgets/${id}/toggle`);
    }

    /**
     * Duplicate a widget with options
     */
    async duplicateWidget(id: number, data: DuplicateWidgetRequest): Promise<{ data: Widget }> {
        return this.post<Widget>(`/widgets/${id}/duplicate`, data);
    }

    /**
     * Publish a widget
     */
    async publishWidget(id: number): Promise<{ data: PublishWidgetResponse }> {
        return this.patch<PublishWidgetResponse>(`/widgets/${id}/publish`);
    }

    /**
     * Unpublish a widget
     */
    async unpublishWidget(id: number): Promise<{ data: PublishWidgetResponse }> {
        return this.patch<PublishWidgetResponse>(`/widgets/${id}/unpublish`);
    }

    /**
     * Get widget statistics
     */
    async getWidgetStatistics(id: number): Promise<{ data: WidgetStatistics }> {
        return this.get<WidgetStatistics>(`/widgets/${id}/statistics`);
    }

    /**
     * Get widget analytics for a date range
     */
    async getWidgetAnalytics(id: number, params?: {
        start_date?: string;
        end_date?: string;
        granularity?: 'day' | 'week' | 'month';
    }): Promise<{ data: any }> {
        const queryParams = new URLSearchParams();
        if (params?.start_date) queryParams.append('start_date', params.start_date);
        if (params?.end_date) queryParams.append('end_date', params.end_date);
        if (params?.granularity) queryParams.append('granularity', params.granularity);

        const endpoint = `/widgets/${id}/analytics${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
        return this.get<any>(endpoint);
    }

    /**
     * Export widget configuration
     */
    async exportWidget(id: number): Promise<{ data: any }> {
        return this.get<any>(`/widgets/${id}/export`);
    }

    /**
     * Import widget configuration
     */
    async importWidget(data: any): Promise<{ data: Widget }> {
        return this.post<Widget>('/widgets/import', data);
    }

    /**
     * Get widget embed code
     */
    async getEmbedCode(id: number, options?: {
        domain?: string;
        theme?: string;
        position?: string;
    }): Promise<{ data: { embed_code: string; script_url: string } }> {
        return this.post<{ embed_code: string; script_url: string }>(`/widgets/${id}/embed`, options);
    }

    /**
     * Test widget configuration
     */
    async testWidget(id: number, testData?: {
        message?: string;
        user_agent?: string;
        referrer?: string;
    }): Promise<{ data: any }> {
        return this.post<any>(`/widgets/${id}/test`, testData);
    }

    
    /**
     * Export widget statistics
     */
    async exportWidgetStatistics(widgetId: number, format: 'csv' | 'pdf'): Promise<{ data: any }> {
        return this.get<any>(`/widgets/${widgetId}/statistics/export?format=${format}`);
    }

    /**
     * End a conversation
     */
    async endConversation(widgetId: number, conversationId: number, data?: {
        satisfaction_rating?: number;
        feedback?: string;
    }): Promise<{ data: any }> {
        return this.patch<any>(`/widgets/${widgetId}/conversations/${conversationId}/end`, data);
    }

    /**
     * Widget Templates
     */
    async getWidgetTemplates(params?: { category?: string; popular?: boolean }): Promise<{ data: any }> {
        const queryParams = new URLSearchParams();
        if (params?.category) queryParams.append('category', params.category);
        if (params?.popular) queryParams.append('popular', 'true');

        const query = queryParams.toString();
        return this.get<any>(`/widget-templates${query ? `?${query}` : ''}`);
    }

    async getWidgetTemplate(templateId: number): Promise<{ data: any }> {
        return this.get<any>(`/widget-templates/${templateId}`);
    }

    async getTemplateCategories(): Promise<{ data: any }> {
        return this.get<any>('/widget-templates/categories');
    }

    /**
     * Widget Content (Quick Responses & Conversation Starters)
     */
    async getWidgetContent(widgetId: number): Promise<{ data: any }> {
        return this.get<any>(`/widgets/${widgetId}/content`);
    }

    async getQuickResponses(widgetId: number): Promise<{ data: any }> {
        return this.get<any>(`/widgets/${widgetId}/quick-responses`);
    }

    async createQuickResponse(widgetId: number, data: any): Promise<{ data: any }> {
        return this.post<any>(`/widgets/${widgetId}/quick-responses`, data);
    }

    async updateQuickResponse(widgetId: number, responseId: number, data: any): Promise<{ data: any }> {
        return this.put<any>(`/widgets/${widgetId}/quick-responses/${responseId}`, data);
    }

    async deleteQuickResponse(widgetId: number, responseId: number): Promise<{ data: any }> {
        return this.delete<any>(`/widgets/${widgetId}/quick-responses/${responseId}`);
    }

    async getConversationStarters(widgetId: number): Promise<{ data: any }> {
        return this.get<any>(`/widgets/${widgetId}/conversation-starters`);
    }

    async createConversationStarter(widgetId: number, data: any): Promise<{ data: any }> {
        return this.post<any>(`/widgets/${widgetId}/conversation-starters`, data);
    }

    async updateConversationStarter(widgetId: number, starterId: number, data: any): Promise<{ data: any }> {
        return this.put<any>(`/widgets/${widgetId}/conversation-starters/${starterId}`, data);
    }

    async deleteConversationStarter(widgetId: number, starterId: number): Promise<{ data: any }> {
        return this.delete<any>(`/widgets/${widgetId}/conversation-starters/${starterId}`);
    }

    /**
     * Widget Chat
     */
    async getConversations(widgetId: number, params?: any): Promise<{ data: any }> {
        const queryParams = new URLSearchParams(params);
        const query = queryParams.toString();
        return this.get<any>(`/widgets/${widgetId}/conversations${query ? `?${query}` : ''}`);
    }

    async createConversation(widgetId: number, data: any): Promise<{ data: any }> {
        return this.post<any>(`/widgets/${widgetId}/conversations`, data);
    }

    async getConversationMessages(widgetId: number, conversationId: string): Promise<{ data: any }> {
        return this.get<any>(`/widgets/${widgetId}/conversations/${conversationId}/messages`);
    }

    async sendMessage(widgetId: number, conversationId: string, data: any): Promise<{ data: any }> {
        return this.post<any>(`/widgets/${widgetId}/conversations/${conversationId}/messages`, data);
    }
}

// Export singleton instance
export const widgetApi = new WidgetApiClient(); 