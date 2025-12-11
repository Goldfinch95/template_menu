//  INTERFAZ GENERAL

//user
export interface User {
  id: number;
  name: string;
  lastName: string;
  email: string;
  cel?: string;
  roleId?: number;
  subdomain: string;
  active: boolean;
  createdAt?: string;
  updatedAt?: string;
}

//
export interface LoginData {
  email: string;
  password: string;
}

//
export interface LoginResponse {
  message: string;
  token: string;
  user: {
    id: number;
    name: string;
    lastName: string;
    email: string;
    cel: string;
    roleId: number;
    active: boolean;
    subdomain: string;
  };
}

//registro de usuario
export interface RegisterData {
  name: string;
  lastName: string;
  email: string;
  cel?: string;
  roleId?: number;
}

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
  position: number;
}

// items de las categorias

export interface Items {
  categoryId: number;
  createdAt: string;
  description: string;
  id: number;
  images: ImageItems[];
  active: boolean;
  price: number;
  title: string;
  updatedAt: string;
  position: number;
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
  userId: number; // temporalmente lo fijo en 1
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
  active: boolean;
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

export interface UpdateCategoryPosition {
  newPosition: number;
}

export interface UpdateItemPosition {
  newPosition: number;
}
