import {
  Menu,
  Categories,
  Items,
  newCategory,
  newMenu,
} from "@/interfaces/menu";
import { promises } from "dns";

const BASE_URL = "http://localhost:3000/api/menus";
const CATEGORIES_BASE_URL = "http://localhost:3000/api/categories";
const ITEM_BASE_URL = "http://localhost:3000/api/items";
const TENANT_HEADER = { "x-tenant-subdomain": "amax" };

// Obtener todos los menús
export const getMenus = async (): Promise<Menu[]> => {
  try {
    const response = await fetch(BASE_URL, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...TENANT_HEADER,
      },
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`Error al cargar los menús: ${response.status}`);
    }

    const data: Menu[] = await response.json();

    return data;
  } catch (error) {
    console.error(
      "❌ Error al cargar los menús:",
      error instanceof Error ? error.message : "Error desconocido"
    );
    throw error;
  }
};

//CRUD MENÚ

// Obtener un menú específico
export const getMenu = async (id: string | number): Promise<Menu> => {
  try {
    const response = await fetch(`${BASE_URL}/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...TENANT_HEADER,
      },
    });

    if (!response.ok) throw new Error(`Error al cargar el menú ${id}`);

    return response.json();
  } catch (error) {
    console.error("❌ Error al obtener menú:", error);
    throw error;
  }
};

/// Crear un NUEVO menú
export const createMenu = async (data: newMenu): Promise<Menu> => {
  try {
    const formData = new FormData();

    // Campos obligatorios
    formData.append("title", data.title);

    // Campos opcionales

    if (data.userId !== undefined) {
      formData.append("userId", String(data.userId));
    }

    if (data.pos) {
      formData.append("pos", data.pos);
    }

    // Color (si existe, convertir a JSON string)
    if (data.color) {
      formData.append("color", JSON.stringify(data.color));
    }
    // Archivos
    if (data.logo) {
      formData.append("logo", data.logo);
    }

    if (data.backgroundImage) {
      formData.append("backgroundImage", data.backgroundImage);
    }

    const response = await fetch(BASE_URL, {
      method: "POST",
      headers: {
        // ⚠️ NO incluir Content-Type con FormData
        ...TENANT_HEADER,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Error al crear menú: ${response.status} - ${errorText}`);
    }

    return response.json();
  } catch (error) {
    console.error("❌ Error al crear menú:", error);
    throw error;
  }
};

// ACTUALIZAR menú
export const updateMenu = async (
  id: string | number,
  data: Partial<Menu>
): Promise<Menu> => {
  try {
    const formData = new FormData();

    // Campos opcionales
    if (data.title !== undefined) {
      formData.append("title", data.title);
    }

    if (data.userId !== undefined) {
      formData.append("userId", String(data.userId));
    }

    if (data.pos !== undefined) {
      formData.append("pos", data.pos);
    }

    // Color (si existe, convertir a JSON string)
    if (data.color !== undefined) {
      formData.append("color", JSON.stringify(data.color));
    }

    // Archivos
    if (data.logo) {
      formData.append("logo", data.logo);
    }

    if (data.backgroundImage) {
      formData.append("backgroundImage", data.backgroundImage);
    }

    const response = await fetch(`${BASE_URL}/${id}`, {
      method: "PUT",
      headers: {
        // ⚠️ NO incluir Content-Type con FormData
        ...TENANT_HEADER,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Error al actualizar menú: ${response.status} - ${errorText}`
      );
    }

    return response.json();
  } catch (error) {
    console.error("❌ Error al actualizar menú:", error);
    throw error;
  }
};

// ELIMINAR menú
export const deleteMenu = async (id: string | number): Promise<void> => {
  try {
    const response = await fetch(`${BASE_URL}/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        ...TENANT_HEADER,
      },
    });

    if (!response.ok) throw new Error(`Error al eliminar menú ${id}`);

    //console.log(` Menú ${id} eliminado correctamente.`);
  } catch (error) {
    console.error("❌ Error al eliminar menú:", error);
    throw error;
  }
};

// CRUD categorias

// Crear una nueva categoría
export const createCategory = async (
  data: newCategory
): Promise<Categories> => {
  try {
    const response = await fetch(CATEGORIES_BASE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...TENANT_HEADER,
      },
      body: JSON.stringify({
        menuId: data.menuId,
        title: data.title,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Error al crear categoría: ${response.status} - ${errorText}`
      );
    }

    const newCategory: Categories = await response.json();
    console.log("✅ Categoría creada correctamente");
    return newCategory;
  } catch (error) {
    console.error("❌ Error al crear categoría:", error);
    throw error;
  }
};

// Editar una categoria
export const updateCategory = async (
  categoryId: number,
  categoryData: { title?: string; items?: Items[] }
): Promise<Categories> => {
  try {
    const formData = new FormData();

    // Campo título (opcional)
    if (categoryData.title !== undefined) {
      formData.append("title", categoryData.title);
    }

    // Items (opcional)
    if (categoryData.items) {
      categoryData.items.forEach((item, itemIndex) => {
        formData.append(`items[${itemIndex}][title]`, item.title);
        formData.append(
          `items[${itemIndex}][description]`,
          item.description || ""
        );
        formData.append(`items[${itemIndex}][price]`, String(item.price || 0));

        // Si el item tiene un ID, incluirlo para que el backend sepa que es un item existente
        if (item.id) {
          formData.append(`items[${itemIndex}][id]`, String(item.id));
        }

        item.images?.forEach((img, imgIndex) => {
          if (img instanceof File) {
            const fileField = `item_${itemIndex}_img_${imgIndex}`;
            // 🔹 asociamos el fileField en JSON
            formData.append(
              `items[${itemIndex}][images][${imgIndex}][fileField]`,
              fileField
            );
            // 🔹 y subimos el archivo con ese nombre
            formData.append(fileField, img);
          } else if (typeof img === "object" && img.url) {
            // 🔹 imagen ya existente
            formData.append(
              `items[${itemIndex}][images][${imgIndex}][url]`,
              img.url
            );
            // Si la imagen tiene id, incluirlo
            if (img.id) {
              formData.append(
                `items[${itemIndex}][images][${imgIndex}][id]`,
                String(img.id)
              );
            }
          }
        });
      });
    }

    console.groupCollapsed(`📦 Actualizando categoría ID: ${categoryId}`);
    for (let [key, val] of formData.entries()) {
      console.log(key, val instanceof File ? `File(${val.name})` : val);
    }
    console.groupEnd();

    const response = await fetch(`${CATEGORIES_BASE_URL}/${categoryId}`, {
      method: "PUT",
      headers: {
        ...TENANT_HEADER,
        // ⚠️ NO incluir Content-Type con FormData
      },
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Error al editar categoría: ${response.status} - ${errorText}`
      );
    }

    const updatedCategory: Categories = await response.json();
    return updatedCategory;
  } catch (error) {
    console.error("❌ Error al editar categoría:", error);
    throw error;
  }
};

// Eliminar una categoría
export const deleteCategory = async (categoryId: number): Promise<void> => {
  try {
    const response = await fetch(`${CATEGORIES_BASE_URL}/${categoryId}`, {
      method: "DELETE",
      headers: {
        ...TENANT_HEADER,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Error al eliminar categoría: ${response.status} - ${errorText}`
      );
    }

    // Como el backend responde con 204 (No Content), no hay body que parsear
    console.log("✅ Categoría eliminada correctamente");
  } catch (error) {
    console.error("❌ Error al eliminar categoría:", error);
    throw error;
  }
};

// ITEMS

// Eliminar un item
export const deleteItem = async (itemId: number): Promise<void> => {
  try {
    const response = await fetch(`${ITEM_BASE_URL}/${itemId}`, {
      method: "DELETE",
      headers: {
        ...TENANT_HEADER,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Error al eliminar item: ${response.status} - ${errorText}`
      );
    }
  } catch (error) {
    console.error("❌ Error al eliminar item:", error);
    throw error;
  }
};
