import { BaseApiClient } from './base';

export class WidgetBehaviorApiClient extends BaseApiClient {
    /**
     * Get behavior settings for a widget
     */
    async getBehaviorSettings(widgetId: number): Promise<{ data: any }> {
        return this.get<any>(`/widgets/${widgetId}/behavior`);
    }

    /**
     * Create behavior settings for a widget
     */
    async createBehaviorSettings(widgetId: number, data: any): Promise<{ data: any }> {
        return this.post<any>(`/widgets/${widgetId}/behavior`, data);
    }

    /**
     * Update behavior settings for a widget
     */
    async updateBehaviorSettings(widgetId: number, data: any): Promise<{ data: any }> {
        return this.put<any>(`/widgets/${widgetId}/behavior`, data);
    }

    /**
     * Get operating hours for a widget
     */
    async getOperatingHours(widgetId: number): Promise<{ data: any }> {
        return this.get<any>(`/widgets/${widgetId}/operating-hours`);
    }

    /**
     * Update operating hours for a widget
     */
    async updateOperatingHours(widgetId: number, data: any): Promise<{ data: any }> {
        return this.put<any>(`/widgets/${widgetId}/operating-hours`, data);
    }
}

export const widgetBehaviorApi = new WidgetBehaviorApiClient(); 