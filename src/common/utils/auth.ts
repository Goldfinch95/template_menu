//FUNCIONES AUXILIARES

// obtener el token para autenticar.

export const getAuthHeaders = (): Record<string, string> => {
  const token = localStorage.getItem("authToken");
  
  if (!token) {
    return {};
  }
  
  return {
    Authorization: `Bearer ${token}`,
  };
};

// obtener el subdominio del usuario

export const getSubdomain = (): string => {
  return localStorage.getItem("subdomain") as string;
};

// obtener el tenant del usuario
export const getTenantHeaders = (): Record<string, string> => {
  return {
    "x-tenant-subdomain": getSubdomain(),
  };
};

// almacenar el token en el local storage
export const getAuthToken = (): string | null => {
  return localStorage.getItem("authToken");
};

// obtener usuario
export const getCurrentUser = () => {
  const userStr = localStorage.getItem("user");
  if (!userStr) return null;
  
  try {
    return JSON.parse(userStr);
  } catch (error) {
    console.error("Error al parsear usuario:", error);
    return null;
  }
};

// limpiar el local storage
export const clearAuth = (): void => {
  localStorage.removeItem("authToken");
  localStorage.removeItem("user");
  localStorage.removeItem("subdomain");
  document.cookie = "authToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
};