import { ApiResponse, ApiErrorResponse } from './types';

// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

export class BaseApiClient {
    protected baseURL: string;
    protected headers: Record<string, string>;

    constructor() {
        this.baseURL = API_BASE_URL;
        this.headers = {
            "Content-Type": "application/json",
            Accept: "application/json",
        };
    }

    /**
     * Set authentication token
     */
    setAuthToken(token: string | null) {
        if (token) {
            this.headers.Authorization = `Bearer ${token}`;
        } else {
            delete this.headers.Authorization;
        }
    }

    /**
     * Get current auth token
     */
    getAuthToken(): string | null {
        return this.headers.Authorization?.replace('Bearer ', '') || null;
    }

    /**
     * Make HTTP request
     */
    protected async request<T>(
        endpoint: string,
        options: RequestInit = {},
    ): Promise<T> {
        const url = `${this.baseURL}${endpoint}`;
        const config: RequestInit = {
            headers: this.headers,
            ...options,
        };

        try {
            const response = await fetch(url, config);
            const data = await response.json();

            if (!response.ok) {
                // Handle API error responses
                const errorData = data as ApiErrorResponse;
                throw new Error(
                    errorData.message ||
                    errorData.error ||
                    `HTTP ${response.status}: ${response.statusText}`,
                );
            }

            return data;
        } catch (error) {
            console.error(`API request failed: ${endpoint}`, error);
            throw error;
        }
    }

    /**
     * Handle API responses with success/error format
     */
    protected async handleApiResponse<T>(
        endpoint: string,
        options: RequestInit = {},
    ): Promise<{ data: T }> {
        const response = await this.request<ApiResponse<T>>(endpoint, options);

        if (!response.success) {
            throw new Error(response.message || 'API request failed');
        }

        return { data: response.data! };
    }

    /**
     * GET request
     */
    protected async get<T>(endpoint: string): Promise<{ data: T }> {
        return this.handleApiResponse<T>(endpoint, { method: 'GET' });
    }

    /**
     * POST request
     */
    protected async post<T>(endpoint: string, data?: any): Promise<{ data: T }> {
        return this.handleApiResponse<T>(endpoint, {
            method: 'POST',
            body: data ? JSON.stringify(data) : undefined,
        });
    }

    /**
     * PUT request
     */
    protected async put<T>(endpoint: string, data?: any): Promise<{ data: T }> {
        return this.handleApiResponse<T>(endpoint, {
            method: 'PUT',
            body: data ? JSON.stringify(data) : undefined,
        });
    }

    /**
     * PATCH request
     */
    protected async patch<T>(endpoint: string, data?: any): Promise<{ data: T }> {
        return this.handleApiResponse<T>(endpoint, {
            method: 'PATCH',
            body: data ? JSON.stringify(data) : undefined,
        });
    }

    /**
     * DELETE request
     */
    protected async delete<T>(endpoint: string): Promise<T> {
        return this.request<T>(endpoint, { method: 'DELETE' });
    }
} 