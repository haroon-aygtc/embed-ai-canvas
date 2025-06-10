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
     * Get widget conversation history
     */
    async getConversations(id: number, params?: {
        page?: number;
        per_page?: number;
        status?: 'active' | 'ended';
        date_from?: string;
        date_to?: string;
    }): Promise<{ data: any }> {
        const queryParams = new URLSearchParams();
        if (params?.page) queryParams.append('page', params.page.toString());
        if (params?.per_page) queryParams.append('per_page', params.per_page.toString());
        if (params?.status) queryParams.append('status', params.status);
        if (params?.date_from) queryParams.append('date_from', params.date_from);
        if (params?.date_to) queryParams.append('date_to', params.date_to);

        const endpoint = `/widgets/${id}/conversations${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
        return this.get<any>(endpoint);
    }

    /**
     * Get widget messages for a conversation
     */
    async getConversationMessages(widgetId: number, conversationId: number): Promise<{ data: any }> {
        return this.get<any>(`/widgets/${widgetId}/conversations/${conversationId}/messages`);
    }

    /**
     * Send a message in a conversation
     */
    async sendMessage(widgetId: number, conversationId: number, data: {
        message: string;
        is_user: boolean;
    }): Promise<{ data: any }> {
        return this.post<any>(`/widgets/${widgetId}/conversations/${conversationId}/messages`, data);
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
}

// Export singleton instance
export const widgetApi = new WidgetApiClient(); 