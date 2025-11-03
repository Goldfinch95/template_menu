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
  price: string;
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
  backgroundImage: string;
  color: {
    primary: string;
    secondary: string;
  };
  logo: string;
  pos: string;
  title: string;
  categories: [];
}



// nueva categoria
export interface newCategory {
  id: number;
  menuId: number; // temporalmente lo fijo en 1
  title: string;
  items?: [];
}



