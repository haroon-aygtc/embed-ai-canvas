// Re-export everything from the new API structure
export * from "./api/index";

// Import the main API client for backward compatibility
import { apiClient } from "./api/index";

// Export the singleton instance as the default export
export default apiClient;

// Legacy named exports for backward compatibility
export const api = apiClient;

// Initialize auth token from localStorage on app start
if (typeof window !== "undefined") {
  const token = localStorage.getItem("auth_token");
  if (token) {
    apiClient.setAuthToken(token);
  }
}
