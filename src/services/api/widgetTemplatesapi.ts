import { BaseApiClient } from './base';

export class WidgetTemplatesApiClient extends BaseApiClient {
    async getTemplates(): Promise<{ data: any }> {
        return this.get<any>('/widget-templates');
    }

    async getPopularTemplates(): Promise<{ data: any }> {
        return this.get<any>('/widget-templates?popular=true');
    }

    async getTemplatesByCategory(category: string): Promise<{ data: any }> {
        return this.get<any>(`/widget-templates?category=${category}`);
    }
}

export const widgetTemplatesApi = new WidgetTemplatesApiClient();