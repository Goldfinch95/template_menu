const getBaseUrl = () => {
    return `${process.env.NEXT_PUBLIC_API_URL}`;
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
