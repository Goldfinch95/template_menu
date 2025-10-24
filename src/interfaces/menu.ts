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


export interface Category {
  id: number;
  menuId: number;
  title: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
  items: MenuItem[];
}
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

export interface MenuItem {
  id: number;
  title: string;
  description: string;
  price: string; // La API devuelve string "7500.00", no number
  images: MenuItemImage[]; // Cambio: era "image: string[]"
}


