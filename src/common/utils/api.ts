import { Menues, Category, MenuItem } from "@/interfaces/menu";

const BASE_URL = "http://localhost:3000/api/menus";
const TENANT_HEADER = { "x-tenant-subdomain": "amaxlequeano" };

// --- 🔹 Obtener todos los menús (para Home)
export const getMenus = async (): Promise<Menues[]> => {
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

    const data: Menues[] = await response.json();
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

// --- 🔹 Obtener un menú específico
export const getMenu = async (id: string | number): Promise<Menues> => {
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

// --- 🔹 Crear un nuevo menú
export const createMenu = async (data: Partial<Menues>): Promise<Menues> => {
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
  data: Partial<Menues>
): Promise<Menues> => {
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