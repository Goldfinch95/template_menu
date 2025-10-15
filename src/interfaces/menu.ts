export interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
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
}

export interface FoodMenuItemProps extends MenuItem {}