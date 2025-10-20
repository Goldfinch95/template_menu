export interface MenuItem {
  id: number;
  title: string;
  description: string;
  price: number;
  image: [];
}

export interface Menues {
  id: number;
  title: string;
}

export interface MenuData {
  promociones: MenuItem[];
  entradas: MenuItem[];
  principales: MenuItem[];
  postres: MenuItem[];
  bebidas: MenuItem[];
}

export interface Category {
  id: keyof MenuData;
  label: string;
  title: string;
  items: MenuItem[];
}

export interface FoodMenuItemProps extends MenuItem {}