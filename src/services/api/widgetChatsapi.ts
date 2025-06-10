import { BaseApiClient } from './base';

export class WidgetChatsApiClient extends BaseApiClient {
    async getConversations(widgetId: number): Promise<{ data: any }> {
        return this.get<any>(`/widgets/${widgetId}/conversations`);
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

    async endConversation(widgetId: number, conversationId: string, data: any): Promise<{ data: any }> {
        return this.post<any>(`/widgets/${widgetId}/conversations/${conversationId}/end`, data);
    }
}

export const widgetChatsApi = new WidgetChatsApiClient();   