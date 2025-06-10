import { BaseApiClient } from './base';

export class WidgetAnalyticsApiClient extends BaseApiClient {
    /**
     * Get analytics data for a widget
     */
    async getAnalytics(widgetId: number, params?: {
        start_date?: string;
        end_date?: string;
        granularity?: 'day' | 'week' | 'month';
    }): Promise<{ data: any }> {
        const queryParams = new URLSearchParams();
        if (params?.start_date) queryParams.append('start_date', params.start_date);
        if (params?.end_date) queryParams.append('end_date', params.end_date);
        if (params?.granularity) queryParams.append('granularity', params.granularity);

        const endpoint = `/widgets/${widgetId}/analytics${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
        return this.get<any>(endpoint);
    }

    /**
     * Get conversation analytics
     */
    async getConversationAnalytics(widgetId: number, params?: {
        start_date?: string;
        end_date?: string;
    }): Promise<{ data: any }> {
        const queryParams = new URLSearchParams();
        if (params?.start_date) queryParams.append('start_date', params.start_date);
        if (params?.end_date) queryParams.append('end_date', params.end_date);

        const endpoint = `/widgets/${widgetId}/analytics/conversations${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
        return this.get<any>(endpoint);
    }

    /**
     * Get message analytics
     */
    async getMessageAnalytics(widgetId: number, params?: {
        start_date?: string;
        end_date?: string;
    }): Promise<{ data: any }> {
        const queryParams = new URLSearchParams();
        if (params?.start_date) queryParams.append('start_date', params.start_date);
        if (params?.end_date) queryParams.append('end_date', params.end_date);

        const endpoint = `/widgets/${widgetId}/analytics/messages${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
        return this.get<any>(endpoint);
    }

    /**
     * Export analytics data
     */
    async exportAnalytics(widgetId: number, format: 'csv' | 'pdf', params?: {
        start_date?: string;
        end_date?: string;
    }): Promise<{ data: any }> {
        const queryParams = new URLSearchParams();
        queryParams.append('format', format);
        if (params?.start_date) queryParams.append('start_date', params.start_date);
        if (params?.end_date) queryParams.append('end_date', params.end_date);

        const endpoint = `/widgets/${widgetId}/analytics/export?${queryParams.toString()}`;
        return this.get<any>(endpoint);
    }
}

export const widgetAnalyticsApi = new WidgetAnalyticsApiClient(); 