import { Category, MenuItem } from "@/interfaces/menu";

// CREA EL PLATO
export const addItem = (
  categoryId: number,
  setCategories: React.Dispatch<React.SetStateAction<Category[]>>
) => {
  const newItem: MenuItem = {
    id: Date.now(),
    categoryId,
    title: "",
    description: "",
    price: "",
    active: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    images: [],
  };
  setCategories((prev) =>
    prev.map((cat) =>
      cat.id === categoryId
        ? {
            ...cat,
            items: [...cat.items, newItem],
            updatedAt: new Date().toISOString(),
          }
        : cat
    )
  );
};

// EDITA EL PLATO
export const updateItem = (
  categoryId: number,
  itemId: number,
  field: keyof MenuItem,
  value: any,
  setCategories: React.Dispatch<React.SetStateAction<Category[]>>
) => {
  setCategories((prev) =>
    prev.map((cat) =>
      cat.id === categoryId
        ? {
            ...cat,
            items: cat.items.map((item) =>
              item.id === itemId
                ? {
                    ...item,
                    [field]: value,
                    updatedAt: new Date().toISOString(),
                  }
                : item
            ),
            updatedAt: new Date().toISOString(),
          }
        : cat
    )
  );
};

// BORRA EL PLATO
export const deleteItem = (
  categoryId: number,
  itemId: number,
  setCategories: React.Dispatch<React.SetStateAction<Category[]>>
) => {
  if (confirm("¿Eliminar este plato?")) {
    setCategories((prev) =>
      prev.map((cat) =>
        cat.id === categoryId
          ? {
              ...cat,
              items: cat.items.filter((item) => item.id !== itemId),
              updatedAt: new Date().toISOString(),
            }
          : cat
      )
    );
  }
};