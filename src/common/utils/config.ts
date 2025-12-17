const getBaseUrl = () => {
  // Si hay variable de entorno, úsala
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }

  // Si no hay variable de entorno, podrías configurar una URL automática si usas Vercel
  // Se podría agregar la URL del dominio de Vercel si deseas manejarlo automáticamente en producción.
  if (process.env.NEXT_PUBLIC_VERCEL_URL) {
    return `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`;
  }

  // Si no está definida ninguna URL, puedes devolver una URL por defecto (en desarrollo o durante pruebas).
  return 'https://localhost:3000'; // Cambia esta URL si quieres algo diferente en desarrollo
};

export const API_CONFIG = {
  BASE_URL: getBaseUrl(),
  ENDPOINTS: {
    USERS: "/users",
    AUTH: "/auth",
    MENUS: "/menus",
    PUBLIC_MENUS: "/public/menus",
    CATEGORIES: "/categories",
    ITEMS: "/items",
    IMAGES: "/images",
  },
} as const;
