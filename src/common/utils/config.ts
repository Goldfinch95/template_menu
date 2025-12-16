const getBaseUrl = () => {
  // Si hay variable de entorno, úsala
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }
  
  // En Vercel, usa la URL automática del backend
  if (process.env.NEXT_PUBLIC_VERCEL_URL) {
    return `https://${process.env.NEXT_PUBLIC_VERCEL_URL}/api`;
  }
  
  // Fallback para desarrollo local
  return "http://localhost:3000/api";
};

export const API_CONFIG = {
  BASE_URL: getBaseUrl(),
  ENDPOINTS: {
    USERS: "/users",
    AUTH: "/auth",
    MENUS: "/menus",
    CATEGORIES: "/categories",
    ITEMS: "/items",
    IMAGES: "/images",
  },
} as const;