// menu con categorias e items
export interface Menues {
  id: number;
  userId: number;
  title: string;
  active: boolean;
  logo: string;
  backgroundImage: string;
  color: {
    primary: string;
    secondary: string;
  };
  pos: string;
  createdAt: string;
  updatedAt: string;
  categories?: Category[];
}

// nuevo menu

export interface newMenu {
  title: string;
  logo: string;
  backgroundImage: string;
  color: {
    primary: string;
    secondary: string;
  };
  pos: string;
}

// nueva categoria
export interface newCategory {
  id: number;
  menuId: number;
  title: string;
  items?: [];
}



// categoria con items
export interface Category {
  id: number;
  menuId: number;
  title: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
  items: MenuItem[];
}
// item del menu
export interface MenuItem {
  id: number;
  categoryId: number;
  title: string;
  description: string;
  price: string; // La API devuelve "7500.00" como string
  active: boolean;
  createdAt: string;
  updatedAt: string;
  images: MenuItemImage[];
}
// item de las imagenes del menu
export interface MenuItemImage {
  id: number;
  itemId: number;
  url: string;
  alt: string;
  sortOrder: number;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}


// payload de categoria

export interface newCategoryPayload {
  menuId: number;
  title: string;
  description?: string | null;
  active?: boolean;
  items?: NewItem[];
}
// payload de nuevo item
export interface NewItem {
  title: string;
  description?: string | null;
  price: string;
  active?: boolean;
  images?: NewImage[];
}

export interface NewImage {
  url: string;
  alt?: string | null;
  sortOrder?: number;
  active?: boolean;
}
