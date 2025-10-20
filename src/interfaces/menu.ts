export interface Menues {
  id: number;
  title: string;
}

export interface Category {
  id: number;
  label: string;
  title: string;
  items: MenuItem[];
}
export interface MenuItem {
  id: number;
  title: string;
  description: string;
  price: number;
  image: [];
}




