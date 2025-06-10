import { BaseApiClient } from './base';

export class WidgetConfigurationsApiClient extends BaseApiClient {
    /**
     * Get all configurations for a widget
     */
    async getConfigurations(widgetId: number): Promise<{ data: any }> {
        return this.get<any>(`/widgets/${widgetId}/configurations`);
    }

    /**
     * Get active configuration for a widget
     */
    async getActiveConfiguration(widgetId: number): Promise<{ data: any }> {
        return this.get<any>(`/widgets/${widgetId}/configurations/active`);
    }

    /**
     * Create a new configuration
     */
    async createConfiguration(widgetId: number, data: any): Promise<{ data: any }> {
        return this.post<any>(`/widgets/${widgetId}/configurations`, data);
    }

    /**
     * Update a configuration
     */
    async updateConfiguration(widgetId: number, data: any): Promise<{ data: any }> {
        return this.put<any>(`/widgets/${widgetId}/configurations`, data);
    }

    /**
     * Activate a configuration
     */
    async activateConfiguration(widgetId: number, configurationId: number): Promise<{ data: any }> {
        return this.post<any>(`/widgets/${widgetId}/configurations/${configurationId}/activate`);
    }

    /**
     * Rollback to previous configuration
     */
    async rollbackConfiguration(widgetId: number): Promise<{ data: any }> {
        return this.post<any>(`/widgets/${widgetId}/configurations/rollback`);
    }

    /**
     * Compare configurations
     */
    async compareConfigurations(widgetId: number, configId1: number, configId2: number): Promise<{ data: any }> {
        return this.get<any>(`/widgets/${widgetId}/configurations/compare?config1=${configId1}&config2=${configId2}`);
    }

    /**
     * Get configuration history
     */
    async getConfigurationHistory(widgetId: number): Promise<{ data: any }> {
        return this.get<any>(`/widgets/${widgetId}/configurations/history`);
    }

    /**
     * Delete a configuration
     */
    async deleteConfiguration(widgetId: number, configurationId: number): Promise<{ data: any }> {
        return this.delete<any>(`/widgets/${widgetId}/configurations/${configurationId}`);
    }
}

export const widgetConfigurationsApi = new WidgetConfigurationsApiClient(); 