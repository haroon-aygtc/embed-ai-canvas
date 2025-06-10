// Shared API Types

// Provider Types
export interface ApiProvider {
    id: number;
    name: string;
    slug: string;
    base_url: string;
    api_key?: string;
    region?: string;
    is_active: boolean;
    status:
    | "unconfigured"
    | "configuring"
    | "testing"
    | "test-failed"
    | "test-passed"
    | "saving"
    | "configured"
    | "fetching-models"
    | "ready"
    | "error";
    last_tested_at?: string;
    last_saved_at?: string;
    test_result?: {
        success: boolean;
        message: string;
        latency?: number;
        timestamp: string;
    };
    created_at: string;
    updated_at: string;
}

export interface ApiModel {
    id: number;
    provider_id: number;
    name: string;
    model_id: string;
    description?: string;
    family: string;
    context_window: number;
    max_tokens: number;
    input_cost: number;
    output_cost: number;
    capabilities: string[];
    is_deprecated: boolean;
    is_saved: boolean;
    is_active: boolean;
    is_default: boolean;
    release_date?: string;
    created_at: string;
    updated_at: string;
}

export interface TestConnectionRequest {
    api_key: string;
    base_url?: string;
    region?: string;
}

export interface TestConnectionResponse {
    success: boolean;
    message: string;
    latency?: number;
    timestamp: string;
}

export interface SaveProviderRequest {
    api_key: string;
    base_url?: string;
    region?: string;
}

export interface ChatCompletionRequest {
    provider_id: number;
    model_id: string;
    messages: Array<{
        role: "user" | "assistant" | "system";
        content: string;
    }>;
    temperature?: number;
    max_tokens?: number;
}

export interface ChatCompletionResponse {
    id: string;
    object: string;
    created: number;
    model: string;
    choices: Array<{
        index: number;
        message: {
            role: string;
            content: string;
        };
        finish_reason: string;
    }>;
    usage: {
        prompt_tokens: number;
        completion_tokens: number;
        total_tokens: number;
    };
    response_time: number;
}

// Widget Types
export interface Widget {
    id: number;
    user_id: number;
    name: string;
    description?: string;
    enabled: boolean;
    status: string;
    domain?: string;
    configuration: Record<string, any>;
    last_updated_at?: string;
    published_at?: string;
    version: number;
    created_at: string;
    updated_at: string;
}

export interface WidgetConfiguration {
    title: string;
    subtitle: string;
    enabled: boolean;
    showBranding: boolean;
    selectedModelId: string | null;
}

export interface CreateWidgetRequest {
    name: string;
    description?: string;
    enabled?: boolean;
    status?: string;
    domain?: string;
    configuration?: Record<string, any>;
}

export interface UpdateWidgetRequest {
    name?: string;
    description?: string;
    enabled?: boolean;
    status?: string;
    domain?: string;
    configuration?: Record<string, any>;
}

export interface DuplicateWidgetRequest {
    name: string;
    description?: string;
    enabled?: boolean;
    copy_configuration?: boolean;
    copy_behavior_settings?: boolean;
    copy_content?: boolean;
}

export interface ToggleWidgetStatusRequest {
    enabled: boolean;
}

export interface ToggleWidgetStatusResponse {
    id: number;
    enabled: boolean;
    last_updated_at: string;
}

export interface PublishWidgetResponse {
    id: number;
    status: string;
    published_at: string;
    last_updated_at: string;
}

export interface WidgetStatistics {
    total_conversations: number;
    total_messages: number;
    active_conversations: number;
    average_satisfaction: number;
    response_time_avg: number;
    last_30_days: {
        conversations: number;
        messages: number;
    };
}

// Auth Types
export interface User {
    id: number;
    name: string;
    email: string;
    email_verified_at?: string;
    created_at: string;
    updated_at: string;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface RegisterRequest {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
}

export interface AuthResponse {
    user: User;
    token: string;
}

// Generic API Response Types
export interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    message?: string;
    error?: string;
}

export interface ApiErrorResponse {
    success: false;
    message: string;
    error?: string;
    errors?: Record<string, string[]>;
} 