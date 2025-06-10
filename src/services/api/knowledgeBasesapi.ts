import { BaseApiClient } from './base';

export class KnowledgeBasesApiClient extends BaseApiClient {
    /**
     * Get all knowledge bases
     */
    async getKnowledgeBases(params?: {
        search?: string;
        type?: string;
        status?: string;
        page?: number;
        per_page?: number;
    }): Promise<{ data: any }> {
        const queryParams = new URLSearchParams();
        if (params?.search) queryParams.append('search', params.search);
        if (params?.type) queryParams.append('type', params.type);
        if (params?.status) queryParams.append('status', params.status);
        if (params?.page) queryParams.append('page', params.page.toString());
        if (params?.per_page) queryParams.append('per_page', params.per_page.toString());

        const endpoint = `/knowledge-bases${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
        return this.get<any>(endpoint);
    }

    /**
     * Get a specific knowledge base
     */
    async getKnowledgeBase(id: string): Promise<{ data: any }> {
        return this.get<any>(`/knowledge-bases/${id}`);
    }

    /**
     * Create a new knowledge base
     */
    async createKnowledgeBase(data: any): Promise<{ data: any }> {
        return this.post<any>('/knowledge-bases', data);
    }

    /**
     * Update a knowledge base
     */
    async updateKnowledgeBase(id: string, data: any): Promise<{ data: any }> {
        return this.put<any>(`/knowledge-bases/${id}`, data);
    }

    /**
     * Delete a knowledge base
     */
    async deleteKnowledgeBase(id: string): Promise<{ data: any }> {
        return this.delete<any>(`/knowledge-bases/${id}`);
    }

    /**
     * Upload documents to a knowledge base
     */
    async uploadDocuments(id: string, files: FormData): Promise<{ data: any }> {
        return this.post<any>(`/knowledge-bases/${id}/documents`, files);
    }

    /**
     * Get documents in a knowledge base
     */
    async getDocuments(id: string, params?: {
        page?: number;
        per_page?: number;
    }): Promise<{ data: any }> {
        const queryParams = new URLSearchParams();
        if (params?.page) queryParams.append('page', params.page.toString());
        if (params?.per_page) queryParams.append('per_page', params.per_page.toString());

        const endpoint = `/knowledge-bases/${id}/documents${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
        return this.get<any>(endpoint);
    }

    /**
     * Delete a document from a knowledge base
     */
    async deleteDocument(knowledgeBaseId: string, documentId: string): Promise<{ data: any }> {
        return this.delete<any>(`/knowledge-bases/${knowledgeBaseId}/documents/${documentId}`);
    }

    /**
     * Process/reindex a knowledge base
     */
    async processKnowledgeBase(id: string): Promise<{ data: any }> {
        return this.post<any>(`/knowledge-bases/${id}/process`);
    }

    /**
     * Get processing status
     */
    async getProcessingStatus(id: string): Promise<{ data: any }> {
        return this.get<any>(`/knowledge-bases/${id}/status`);
    }

    /**
     * Search within a knowledge base
     */
    async searchKnowledgeBase(id: string, query: string, params?: {
        limit?: number;
        threshold?: number;
    }): Promise<{ data: any }> {
        const queryParams = new URLSearchParams();
        queryParams.append('query', query);
        if (params?.limit) queryParams.append('limit', params.limit.toString());
        if (params?.threshold) queryParams.append('threshold', params.threshold.toString());

        const endpoint = `/knowledge-bases/${id}/search?${queryParams.toString()}`;
        return this.get<any>(endpoint);
    }

    /**
     * Get knowledge base analytics
     */
    async getAnalytics(id: string, params?: {
        start_date?: string;
        end_date?: string;
    }): Promise<{ data: any }> {
        const queryParams = new URLSearchParams();
        if (params?.start_date) queryParams.append('start_date', params.start_date);
        if (params?.end_date) queryParams.append('end_date', params.end_date);

        const endpoint = `/knowledge-bases/${id}/analytics${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
        return this.get<any>(endpoint);
    }

    /**
     * Export knowledge base
     */
    async exportKnowledgeBase(id: string, format: 'json' | 'csv'): Promise<{ data: any }> {
        return this.get<any>(`/knowledge-bases/${id}/export?format=${format}`);
    }

    /**
     * Import knowledge base
     */
    async importKnowledgeBase(data: FormData): Promise<{ data: any }> {
        return this.post<any>('/knowledge-bases/import', data);
    }
}

export const knowledgeBasesApi = new KnowledgeBasesApiClient(); 