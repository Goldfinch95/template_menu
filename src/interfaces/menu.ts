export interface Menues {
  id: number;
  title: string;
  color: string;
}

export interface Category {
  id: number;
  label: string;
  title: string;
  items: MenuItem[];
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


