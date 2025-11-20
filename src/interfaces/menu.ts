//  INTERFAZ GENERAL

// menu
export interface Menu {
  active: boolean;
  backgroundImage: string;
  categories: Categories[];
  id: number;
  userId: number;
  title: string;
  logo: string;
  color: {
    primary: string;
    secondary: string;
  };
  pos: string;
  createdAt: string;
  updatedAt: string;
}

// categorias del menu
export interface Categories {
  active: boolean;
  createdAt: string;
  id: number;
  items: Items[];
  menuId: number;
  title: string;
  updatedAt: string;
}

// items de las categorias

export interface Items {
  active: boolean;
  categoryId: number;
  createdAt: string;
  description: string;
  id: number;
  images: ImageItems[];
  price: number;
  title: string;
  updatedAt: string;
}

// imagenes de los items
export interface ImageItems {
  active: boolean;
  alt: string;
  createdAt: string;
  id: number;
  itemId: number;
  sortOrder: number;
  updatedAt: string;
  url: string;
}

// INTERFAZ PARA CREACION

// nuevo menu

export interface newMenu {
  userId: 1; // temporalmente lo fijo en 1
  backgroundImage: File | null;
  color: {
    primary: string;
    secondary: string;
  };
  logo: File | null;
  pos: string;
  title: string;
  categories: Categories[]; 
}

// nueva categoria
export interface newCategory {
  menuId: number;
  title: string;
}

// nuevo item
export interface newItem {
  categoryId: number;
  title: string;
  description: string;
  price: number;
  images?: ImageItems[];
  
}

export interface newImage {
  itemId: number;
  url: File;
  alt: string;
}

// INTERFAZ PARA EDICION

// editar categoria
export interface EditedCategory {
  id: number;
  title: string;
  items?: Items[];
}
