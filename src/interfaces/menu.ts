/* item del menu*/

export interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
}

/* Props para el componente FoodMenuItem */

export interface FoodMenuItemProps {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
}

/* Estructura de una categoría */
export interface Category {
  id: string;
  label: string;
}

/*Estructura del menú con todas las categorías*/
export interface MenuData {
  promociones: MenuItem[];
  entradas: MenuItem[];
  principales: MenuItem[];
  postres: MenuItem[];
}



