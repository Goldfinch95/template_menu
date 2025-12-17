import {
  LoginData,
  LoginResponse,
  RegisterData,
  User,
} from "@/interfaces/menu";
import { API_CONFIG } from "@/common/utils/config";
import { http } from "@/common/utils/http";

export const authService = {
  // registro
  async register(data: RegisterData): Promise<User> {
    return http.post<User>(
      API_CONFIG.ENDPOINTS.USERS,
      {
        name: data.name.trim(),
        lastName: data.lastName.trim(),
        email: data.email.trim(),
        cel: data.cel,
        roleId: data.roleId,
      },
      { useAuth: true, useTenant: false }
    );
  },

  //logearse
  async login(data: LoginData): Promise<LoginResponse> {
    try {
      const response = await http.post<LoginResponse>(
        `${API_CONFIG.ENDPOINTS.AUTH}/login`,
        {
          email: data.email.trim().toLowerCase(),
          password: data.password.trim(),
        }
      );

      // Guardar datos en localStorage
      if (response.token) {
        localStorage.setItem("authToken", response.token);
        localStorage.setItem("user", JSON.stringify(response.user));
        localStorage.setItem("subdomain", response.user.subdomain);
        document.cookie = `authToken=${response.token}; path=/; max-age=86400;`;
      }

      return response;
    } catch (error: unknown) {
      //manejo de errores
      const errorMessage =
        error instanceof Error ? error.message : String(error);

      if (errorMessage.includes("403")) {
        throw new Error("Tu cuenta está inactiva. Contacta al administrador.");
      }
      if (errorMessage.includes("401")) {
        throw new Error("Email o contraseña incorrectos");
      }
      throw error;
    }
  },

  //olvidar la contraseña
  async forgotPassword(
    email: string,
    signal?: AbortSignal
  ): Promise<{ message: string }> {
    try {
      return await http.post<{ message: string }>(
        `${API_CONFIG.ENDPOINTS.USERS}/forgot-password`,
        { email: email.trim() },
        { signal }
      );
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") {
        throw new Error("ABORTED");
      }
      throw error;
    }
  },

  // restablecer contraseña
  async resetPassword(
    token: string,
    password: string,
    signal?: AbortSignal
  ): Promise<{ message: string }> {
    try {
      return await http.post<{ message: string }>(
        `${API_CONFIG.ENDPOINTS.AUTH}/reset-password`,
        { token, password: password.trim() },
        { signal }
      );
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") {
        throw new Error("ABORTED");
      }
      throw error;
    }
  },

  //deslogearse
  logout(): void {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    localStorage.removeItem("subdomain");
    document.cookie =
      "authToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  },
};
