import { Category } from "@/interfaces/menu";

// AGREGA UNA CATEGORIA
export const addCategory = (
  setCategories: React.Dispatch<React.SetStateAction<Category[]>>
) => {
  const newCategory: Category = {
    id: Date.now(),
    menuId: 0,
    title: "",
    active: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    items: [],
  };
  setCategories((prev) => [...prev, newCategory]);
};

// ACTUALIZA LA CATEGORIA
export const updateCategory = (
  categoryId: number,
  field: keyof Category,
  value: any,
  setCategories: React.Dispatch<React.SetStateAction<Category[]>>
) => {
  setCategories((prev) =>
    prev.map((cat) =>
      cat.id === categoryId
        ? { ...cat, [field]: value, updatedAt: new Date().toISOString() }
        : cat
    )
  );
};

// BORRA LA CATEGORIA
export const deleteCategory = (
  categoryId: number,
  setCategories: React.Dispatch<React.SetStateAction<Category[]>>
) => {
  if (confirm("¿Eliminar esta categoría y todos sus platos?")) {
    setCategories((prev) => prev.filter((cat) => cat.id !== categoryId));
  }
};