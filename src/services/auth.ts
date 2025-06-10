// Authentication API Service
const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:8000/api";

// Types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  fullName: string;
  email: string;
  company?: string;
  password: string;
  confirmPassword: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  company_name?: string;
  role: string;
  subscription_tier: string;
  avatar_url?: string;
  created_at?: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data?: {
    user: User;
    token: string;
  };
  errors?: Record<string, string[]>;
}

export interface ApiError {
  success: false;
  message: string;
  errors?: Record<string, string[]>;
}

// Auth API Client
class AuthApiClient {
  private baseURL: string;
  private token: string | null = null;

  constructor() {
    this.baseURL = API_BASE_URL;
    this.token = localStorage.getItem("auth_token");
  }

  private getHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      Accept: "application/json",
      "X-Requested-With": "XMLHttpRequest",
      "X-XSRF-TOKEN": this.getCsrfToken(),
      credentials: "include",
    };

    if (this.token) {
      headers["Authorization"] = `Bearer ${this.token}`;
    }

    return headers;
  }

  private getCsrfToken(): string {
    return document.cookie.split("; ").find(row => row.startsWith("XSRF-TOKEN="))?.split("=")[1] || "";
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const config: RequestInit = {
      headers: this.getHeaders(),
      credentials: "include",
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();
 
      if (!response.ok) {
        throw {
          success: false,
          message:
            data.message || `HTTP ${response.status}: ${response.statusText}`,
          errors: data.errors || {},
          status: response.status,
        };
      }

      return data;
    } catch (error) {
      // Handle network errors
      if (error instanceof TypeError && error.message.includes("fetch")) {
        throw {
          success: false,
          message: "Network error. Please check your connection and try again.",
          errors: {},
        };
      }

      // Re-throw API errors
      throw error;
    }
  }

  async login(credentials: LoginRequest): Promise<AuthResponse> {    
    const response = await this.request<AuthResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    });

    if (response.success && response.data?.token) {
      this.token = response.data.token;
      localStorage.setItem("auth_token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
    }

    return response;
  }

  async register(userData: RegisterRequest): Promise<AuthResponse> {
    const response = await this.request<AuthResponse>("/auth/register", {
      method: "POST",
      body: JSON.stringify(userData),
    });

    if (response.success && response.data?.token) {
      this.token = response.data.token;
      localStorage.setItem("auth_token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
    }

    return response;
  }

  async logout(): Promise<{ success: boolean; message: string }> {
    try {
      const response = await this.request<{
        success: boolean;
        message: string;
      }>("/auth/logout", {
        method: "POST",
      });

      // Clear local storage regardless of API response
      this.token = null;
      localStorage.removeItem("auth_token");
      localStorage.removeItem("user");

      return response;
    } catch (error) {
      // Clear local storage even if logout API fails
      this.token = null;
      localStorage.removeItem("auth_token");
      localStorage.removeItem("user");

      return {
        success: true,
        message: "Logged out successfully",
      };
    }
  }

  async getUser(): Promise<{
    success: boolean;
    data?: { user: User };
    message?: string;
  }> {
    return this.request<{
      success: boolean;
      data?: { user: User };
      message?: string;
    }>("/auth/user");
  }

  isAuthenticated(): boolean {
    return !!this.token;
  }

  getStoredUser(): User | null {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch {
        return null;
      }
    }
    return null;
  }

  clearAuth(): void {
    this.token = null;
    localStorage.removeItem("auth_token");
    localStorage.removeItem("user");
  }
}

// Export singleton instance
export const authApi = new AuthApiClient();

// Utility functions
export const formatApiErrors = (
  errors: Record<string, string[]>,
): Record<string, string> => {
  const formatted: Record<string, string> = {};

  Object.keys(errors).forEach((key) => {
    if (errors[key] && errors[key].length > 0) {
      formatted[key] = errors[key][0]; // Take first error message
    }
  });

  return formatted;
};

export const isNetworkError = (error: any): boolean => {
  return (
    error?.message?.includes("Network error") ||
    error?.message?.includes("fetch") ||
    !error?.status
  );
};

export const getErrorMessage = (error: any): string => {
  if (typeof error === "string") return error;
  if (error?.message) return error.message;
  return "An unexpected error occurred. Please try again.";
};
