import { useState, useCallback } from 'react';
import { apiClient } from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';

export interface KnowledgeBase {
    id: string;
    name: string;
    description: string;
    type: 'documents' | 'website' | 'api' | 'database' | 'files';
    status: 'active' | 'inactive' | 'processing' | 'error';
    sources: number;
    documents: number;
    accuracy: number;
    usage: number;
    lastUpdated: Date;
    version: string;
    tags: string[];
    isStarred: boolean;
    processingProgress?: number;
    size: string;
    owner: string;
    collaborators: number;
}

interface UseKnowledgeBasesReturn {
    knowledgeBases: KnowledgeBase[];
    isLoading: boolean;
    error: string | null;
    loadKnowledgeBases: (params?: {
        search?: string;
        type?: string;
        status?: string;
    }) => Promise<void>;
    createKnowledgeBase: (data: Partial<KnowledgeBase>) => Promise<KnowledgeBase | null>;
    updateKnowledgeBase: (id: string, data: Partial<KnowledgeBase>) => Promise<KnowledgeBase | null>;
    deleteKnowledgeBase: (id: string) => Promise<boolean>;
    uploadDocuments: (id: string, files: FormData) => Promise<boolean>;
    processKnowledgeBase: (id: string) => Promise<boolean>;
    searchKnowledgeBase: (id: string, query: string) => Promise<any>;
    clearError: () => void;
}

export const useKnowledgeBases = (): UseKnowledgeBasesReturn => {
    const { isAuthenticated } = useAuth();
    const [knowledgeBases, setKnowledgeBases] = useState<KnowledgeBase[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const clearError = useCallback(() => {
        setError(null);
    }, []);

    const loadKnowledgeBases = useCallback(async (params?: {
        search?: string;
        type?: string;
        status?: string;
    }): Promise<void> => {
        if (!isAuthenticated) {
            setError('Authentication required');
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const response = await apiClient.knowledgeBases.getKnowledgeBases(params);
            if (response.data?.success) {
                const transformedData = response.data.data.map((kb: any) => ({
                    ...kb,
                    lastUpdated: new Date(kb.last_updated),
                }));
                setKnowledgeBases(transformedData);
            } else {
                setError('Failed to load knowledge bases');
            }
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to load knowledge bases';
            setError(errorMessage);
            console.error('Failed to load knowledge bases:', err);
        } finally {
            setIsLoading(false);
        }
    }, [isAuthenticated]);

    const createKnowledgeBase = useCallback(async (data: Partial<KnowledgeBase>): Promise<KnowledgeBase | null> => {
        if (!isAuthenticated) {
            setError('Authentication required');
            return null;
        }

        setIsLoading(true);
        setError(null);

        try {
            const response = await apiClient.knowledgeBases.createKnowledgeBase(data);
            if (response.data?.success) {
                const newKb = {
                    ...response.data.data,
                    lastUpdated: new Date(response.data.data.last_updated),
                };
                setKnowledgeBases(prev => [newKb, ...prev]);
                return newKb;
            } else {
                setError('Failed to create knowledge base');
                return null;
            }
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to create knowledge base';
            setError(errorMessage);
            console.error('Failed to create knowledge base:', err);
            return null;
        } finally {
            setIsLoading(false);
        }
    }, [isAuthenticated]);

    const updateKnowledgeBase = useCallback(async (id: string, data: Partial<KnowledgeBase>): Promise<KnowledgeBase | null> => {
        if (!isAuthenticated) {
            setError('Authentication required');
            return null;
        }

        setIsLoading(true);
        setError(null);

        try {
            const response = await apiClient.knowledgeBases.updateKnowledgeBase(id, data);
            if (response.data?.success) {
                const updatedKb = {
                    ...response.data.data,
                    lastUpdated: new Date(response.data.data.last_updated),
                };
                setKnowledgeBases(prev => prev.map(kb => kb.id === id ? updatedKb : kb));
                return updatedKb;
            } else {
                setError('Failed to update knowledge base');
                return null;
            }
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to update knowledge base';
            setError(errorMessage);
            console.error('Failed to update knowledge base:', err);
            return null;
        } finally {
            setIsLoading(false);
        }
    }, [isAuthenticated]);

    const deleteKnowledgeBase = useCallback(async (id: string): Promise<boolean> => {
        if (!isAuthenticated) {
            setError('Authentication required');
            return false;
        }

        setIsLoading(true);
        setError(null);

        try {
            const response = await apiClient.knowledgeBases.deleteKnowledgeBase(id);
            if (response.data?.success) {
                setKnowledgeBases(prev => prev.filter(kb => kb.id !== id));
                return true;
            } else {
                setError('Failed to delete knowledge base');
                return false;
            }
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to delete knowledge base';
            setError(errorMessage);
            console.error('Failed to delete knowledge base:', err);
            return false;
        } finally {
            setIsLoading(false);
        }
    }, [isAuthenticated]);

    const uploadDocuments = useCallback(async (id: string, files: FormData): Promise<boolean> => {
        if (!isAuthenticated) {
            setError('Authentication required');
            return false;
        }

        setIsLoading(true);
        setError(null);

        try {
            const response = await apiClient.knowledgeBases.uploadDocuments(id, files);
            if (response.data?.success) {
                // Refresh the knowledge base data
                await loadKnowledgeBases();
                return true;
            } else {
                setError('Failed to upload documents');
                return false;
            }
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to upload documents';
            setError(errorMessage);
            console.error('Failed to upload documents:', err);
            return false;
        } finally {
            setIsLoading(false);
        }
    }, [isAuthenticated, loadKnowledgeBases]);

    const processKnowledgeBase = useCallback(async (id: string): Promise<boolean> => {
        if (!isAuthenticated) {
            setError('Authentication required');
            return false;
        }

        setIsLoading(true);
        setError(null);

        try {
            const response = await apiClient.knowledgeBases.processKnowledgeBase(id);
            if (response.data?.success) {
                // Update the knowledge base status to processing
                setKnowledgeBases(prev => prev.map(kb =>
                    kb.id === id ? { ...kb, status: 'processing' as const } : kb
                ));
                return true;
            } else {
                setError('Failed to start processing');
                return false;
            }
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to start processing';
            setError(errorMessage);
            console.error('Failed to start processing:', err);
            return false;
        } finally {
            setIsLoading(false);
        }
    }, [isAuthenticated]);

    const searchKnowledgeBase = useCallback(async (id: string, query: string): Promise<any> => {
        if (!isAuthenticated) {
            setError('Authentication required');
            return null;
        }

        setIsLoading(true);
        setError(null);

        try {
            const response = await apiClient.knowledgeBases.searchKnowledgeBase(id, query);
            if (response.data?.success) {
                return response.data.data;
            } else {
                setError('Failed to search knowledge base');
                return null;
            }
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to search knowledge base';
            setError(errorMessage);
            console.error('Failed to search knowledge base:', err);
            return null;
        } finally {
            setIsLoading(false);
        }
    }, [isAuthenticated]);

    return {
        knowledgeBases,
        isLoading,
        error,
        loadKnowledgeBases,
        createKnowledgeBase,
        updateKnowledgeBase,
        deleteKnowledgeBase,
        uploadDocuments,
        processKnowledgeBase,
        searchKnowledgeBase,
        clearError,
    };
}; 