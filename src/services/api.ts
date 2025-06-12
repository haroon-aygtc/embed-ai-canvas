const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:8000/api";

class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const errorData = await response
      .json()
      .catch(() => ({ message: "Network error" }));
    throw new ApiError(
      response.status,
      errorData.message || "API request failed",
    );
  }
  return response.json();
};

const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const config: RequestInit = {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...options.headers,
    },
    ...options,
  };

  const response = await fetch(url, config);
  return handleResponse(response);
};

export const widgetApi = {
  // Widget CRUD operations
  getWidget: (id: string) => apiRequest(`/widgets/${id}`),
  createWidget: (data: any) =>
    apiRequest("/widgets", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  updateWidget: (id: string, data: any) =>
    apiRequest(`/widgets/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  deleteWidget: (id: string) =>
    apiRequest(`/widgets/${id}`, {
      method: "DELETE",
    }),
  listWidgets: () => apiRequest("/widgets"),
};

export const aiModelApi = {
  getProviders: () => apiRequest("/ai-providers"),
  getModels: (providerId?: string) => {
    const query = providerId ? `?provider_id=${providerId}` : "";
    return apiRequest(`/ai-models${query}`);
  },
};

export const knowledgeBaseApi = {
  list: () => apiRequest("/knowledge-bases"),
  get: (id: string) => apiRequest(`/knowledge-bases/${id}`),
  create: (data: any) =>
    apiRequest("/knowledge-bases", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  update: (id: string, data: any) =>
    apiRequest(`/knowledge-bases/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  delete: (id: string) =>
    apiRequest(`/knowledge-bases/${id}`, {
      method: "DELETE",
    }),
};

export { ApiError };
