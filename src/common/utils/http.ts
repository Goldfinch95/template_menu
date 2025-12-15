import { API_CONFIG } from "./config";
import { getAuthHeaders, getTenantHeaders } from "./auth";

interface FetchOptions extends RequestInit {
  useAuth?: boolean;
  useTenant?: boolean;
}

export const http = {
  async request<T>(
    endpoint: string,
    options: FetchOptions = {}
  ): Promise<T> {
    const { useAuth = false, useTenant = false, headers = {}, ...rest } = options;

    const defaultHeaders: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (useAuth) {
      Object.assign(defaultHeaders, getAuthHeaders());
    }

    if (useTenant) {
      Object.assign(defaultHeaders, getTenantHeaders());
    }

    const url = endpoint.startsWith("http") 
      ? endpoint 
      : `${API_CONFIG.BASE_URL}${endpoint}`;

    const response = await fetch(url, {
      ...rest,
      headers: { ...defaultHeaders, ...headers },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    // Si es 204 No Content, devolver null
    if (response.status === 204) {
      return null as T;
    }

    return response.json();
  },

  get<T>(endpoint: string, options?: FetchOptions): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: "GET" });
  },

  post<T>(endpoint: string, data?: any, options?: FetchOptions): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  put<T>(endpoint: string, data?: any, options?: FetchOptions): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  delete<T>(endpoint: string, options?: FetchOptions): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: "DELETE" });
  },

  // Para FormData
  async uploadFormData<T>(
    endpoint: string,
    formData: FormData,
    options: FetchOptions = {}
  ): Promise<T> {
    const { useAuth = false, useTenant = false, headers = {}, ...rest } = options;

    const defaultHeaders: Record<string, string> = {};

    if (useAuth) {
      Object.assign(defaultHeaders, getAuthHeaders());
    }

    if (useTenant) {
      Object.assign(defaultHeaders, getTenantHeaders());
    }

    const url = endpoint.startsWith("http")
      ? endpoint
      : `${API_CONFIG.BASE_URL}${endpoint}`;

    const response = await fetch(url, {
      ...rest,
      method: rest.method || "POST",
      headers: { ...defaultHeaders, ...headers },
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    return response.json();
  },
};