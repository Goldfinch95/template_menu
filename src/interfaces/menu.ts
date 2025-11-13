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
  url: Array<{ url: string } | File>;
}


// INTERFAZ PARA CREACION

// nuevo menu

export interface newMenu {
  userId: 1; // temporalmente lo fijo en 1
  backgroundImage?: File;
  color?: {
    primary: string;
    secondary: string;
  };
  logo?: File;
  pos?: string;
  title: string;
  categories: [];
}



// nueva categoria
export interface newCategory {
  menuId: number;
  title: string;
  items?: newItem[];
}

// nuevo item
export interface newItem{
  description: string;
  categoryId: number;
  images?: File[];
  price: string;
  title: string;
}


// INTERFAZ PARA EDICION

// editar categoria
export interface EditedCategory {
  id: number;
  title: string;
  items?: Items[];
}

