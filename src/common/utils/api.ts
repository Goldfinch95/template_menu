import { Menu, Categories, newCategory, newMenu  } from "@/interfaces/menu";

const BASE_URL = "http://localhost:3000/api/menus";
const CATEGORIES_BASE_URL = "http://localhost:3000/api/categories";
const TENANT_HEADER = { "x-tenant-subdomain": "amax" };

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
    console.log("✅ Menús cargados:", data);
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

// --- 🔹 Crear un nuevo menú (menuEditor)
export const createMenu = async (data: newMenu): Promise<Menu> => {
  try {
    const response = await fetch(BASE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...TENANT_HEADER,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) throw new Error("Error al crear menú");

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
    const response = await fetch(CATEGORIES_BASE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...TENANT_HEADER,
      },
      body: JSON.stringify(categoryData),
    });

    if (!response.ok){
      const errorText = await response.text();
      throw new Error(`Error al crear categoría: ${response.status} - ${errorText}`);
    } 
    const data = await response.json();
    console.log("✅ Categoría creada:", data);
    return data;
  } catch (error) {
    console.error("❌ Error al crear categoría:", error);
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