import { BaseApiClient } from './base';
import {
    User,
    LoginRequest,
    RegisterRequest,
    AuthResponse,
    ApiResponse
} from './types';

export class AuthApiClient extends BaseApiClient {
    /**
     * Register a new user
     */
    async register(data: RegisterRequest): Promise<{ data: AuthResponse }> {
        return this.post<AuthResponse>('/auth/register', data);
    }

    /**
     * Login user
     */
    async login(data: LoginRequest): Promise<{ data: AuthResponse }> {
        return this.post<AuthResponse>('/auth/login', data);
    }

    /**
     * Logout user
     */
    async logout(): Promise<{ success: boolean; message: string }> {
        const response = await this.request<ApiResponse>('/auth/logout', {
            method: 'POST',
        });
        return {
            success: response.success,
            message: response.message || 'Logged out successfully'
        };
    }

    /**
     * Get current authenticated user
     */
    async getUser(): Promise<{ data: User }> {
        return this.get<User>('/auth/user');
    }

    /**
     * Refresh authentication token (if supported)
     */
    async refreshToken(): Promise<{ data: AuthResponse }> {
        return this.post<AuthResponse>('/auth/refresh');
    }

    /**
     * Request password reset
     */
    async requestPasswordReset(email: string): Promise<{ success: boolean; message: string }> {
        const response = await this.request<ApiResponse>('/auth/password/reset', {
            method: 'POST',
            body: JSON.stringify({ email }),
        });
        return {
            success: response.success,
            message: response.message || 'Password reset email sent'
        };
    }

    /**
     * Reset password with token
     */
    async resetPassword(data: {
        token: string;
        email: string;
        password: string;
        password_confirmation: string;
    }): Promise<{ success: boolean; message: string }> {
        const response = await this.request<ApiResponse>('/auth/password/reset/confirm', {
            method: 'POST',
            body: JSON.stringify(data),
        });
        return {
            success: response.success,
            message: response.message || 'Password reset successfully'
        };
    }

    /**
     * Verify email address
     */
    async verifyEmail(token: string): Promise<{ success: boolean; message: string }> {
        const response = await this.request<ApiResponse>(`/auth/email/verify/${token}`, {
            method: 'POST',
        });
        return {
            success: response.success,
            message: response.message || 'Email verified successfully'
        };
    }

    /**
     * Resend email verification
     */
    async resendEmailVerification(): Promise<{ success: boolean; message: string }> {
        const response = await this.request<ApiResponse>('/auth/email/resend', {
            method: 'POST',
        });
        return {
            success: response.success,
            message: response.message || 'Verification email sent'
        };
    }
}

// Export singleton instance
export const authApi = new AuthApiClient(); 