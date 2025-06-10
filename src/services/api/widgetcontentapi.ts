import { BaseApiClient } from './base';

export class WidgetContentApiClient extends BaseApiClient {
    async getWidgetContent(widgetId: number): Promise<{ data: any }> {
        return this.get<any>(`/widgets/${widgetId}/content`);
    }

    async getQuickResponses(widgetId: number): Promise<{ data: any }> {
        return this.get<any>(`/widgets/${widgetId}/quick-responses`);
    }

    async getConversationStarters(widgetId: number): Promise<{ data: any }> {
        return this.get<any>(`/widgets/${widgetId}/conversation-starters`);
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

    async createConversationStarter(widgetId: number, data: any): Promise<{ data: any }> {
        return this.post<any>(`/widgets/${widgetId}/conversation-starters`, data);
    }

    async updateConversationStarter(widgetId: number, starterId: number, data: any): Promise<{ data: any }> {
        return this.put<any>(`/widgets/${widgetId}/conversation-starters/${starterId}`, data);
    }

    async deleteConversationStarter(widgetId: number, starterId: number): Promise<{ data: any }> {
        return this.delete<any>(`/widgets/${widgetId}/conversation-starters/${starterId}`);
    }   
}

export const widgetContentApi = new WidgetContentApiClient();   