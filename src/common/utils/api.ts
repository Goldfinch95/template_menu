import { Menu, Categories, Items, newCategory, newMenu  } from "@/interfaces/menu";

const BASE_URL = "http://localhost:3000/api/menus";
const CATEGORIES_BASE_URL = "http://localhost:3000/api/categories";
const ITEM_BASE_URL = "http://localhost:3000/api/items"
const TENANT_HEADER = { "x-tenant-subdomain": "amaxlote" };

// --- 🔹 Obtener todos los menús (para Home)
export const getMenus = async (): Promise<Menu[]> => {
  try {
    const response = await fetch(BASE_URL, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...TENANT_HEADER,
      },
      cache: "no-store", // evita que Next.js lo cachee
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

// --- 🔹 Obtener un menú específico (menuEditor)
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



/// 🔹 Crear un nuevo menú (menuEditor)
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

// --- 🔹 Actualizar un menú existente
export const updateMenu = async (
  id: string | number,
  data: Partial<Menu>
): Promise<Menu> => {
  try {
    const response = await fetch(`${BASE_URL}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...TENANT_HEADER,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) throw new Error(`Error al actualizar menú ${id}`);

    return response.json();
  } catch (error) {
    console.error("❌ Error al actualizar menú:", error);
    throw error;
  }
};

// --- 🔹 Eliminar un menú
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

    console.log(`✅ Menú ${id} eliminado correctamente.`);
  } catch (error) {
    console.error("❌ Error al eliminar menú:", error);
    throw error;
  }
};

// --- 🔹 CATEGORÍAS

// Crear una nueva categoría
export const createCategory = async (
  categoryData: newCategory
): Promise<Categories> => {
  try {
    const formData = new FormData();
    
    // Campos obligatorios
    formData.append("menuId", String(categoryData.menuId));
    formData.append("title", categoryData.title);
    
    // Items (si existen)
    if (categoryData.items && categoryData.items.length > 0) {
      categoryData.items.forEach((item, itemIndex) => {
        // Datos básicos del item
        formData.append(`items[${itemIndex}][title]`, item.title);
        formData.append(`items[${itemIndex}][description]`, item.description);
        formData.append(`items[${itemIndex}][price]`, item.price);
        formData.append(`items[${itemIndex}][categoryId]`, String(item.categoryId));
        
        // 🔍 IMPORTANTE: Verificar que images sea un array de File
        if (item.images && item.images.length > 0) {
          item.images.forEach((imageFile, imageIndex) => {
            // ✅ Verificar que sea un File antes de agregar
            if (imageFile instanceof File) {
              formData.append(`items[${itemIndex}][images]`, imageFile);
            } else {
              console.warn(`⚠️ Item ${itemIndex}, imagen ${imageIndex} no es un File:`, imageFile);
            }
          });
        }
      });
    }

    // 🔍 Debug: Ver qué se está enviando
    console.log("📤 FormData a enviar:");
    for (let [key, value] of formData.entries()) {
      console.log(`  ${key}:`, value instanceof File ? `File: ${value.name}` : value);
    }

    const response = await fetch(CATEGORIES_BASE_URL, {
      method: "POST",
      headers: {
        ...TENANT_HEADER,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Error al crear categoría: ${response.status} - ${errorText}`);
    }
    
    return response.json();
    
  } catch (error) {
    console.error("❌ Error al crear categoría:", error);
    throw error;
  }
};

// Editar una categoria
export const updateCategory = async (
  categoryId: number, 
  categoryData: { title: string; items?: Items[] }
): Promise<Categories> => {
  try {
    const response = await fetch(`${CATEGORIES_BASE_URL}/${categoryId}`, {
      method: "PUT",
      headers: {
        ...TENANT_HEADER,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(categoryData),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Error al editar categoría: ${response.status} - ${errorText}`);
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
      throw new Error(`Error al eliminar categoría: ${response.status} - ${errorText}`);
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
      throw new Error(`Error al eliminar item: ${response.status} - ${errorText}`);
    }
    
  } catch (error) {
    console.error("❌ Error al eliminar item:", error);
    throw error;
  }
};