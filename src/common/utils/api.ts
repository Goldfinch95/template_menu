import {
  User,
  LoginData,
  LoginResponse,
  RegisterData,
  Menu,
  Categories,
  Items,
  newCategory,
  newMenu,
  newItem,
  UpdateCategoryPosition,
  UpdateItemPosition,
} from "@/interfaces/menu";

const USERS_BASE_URL = "http://localhost:3000/api/users";
const BASE_URL = "http://localhost:3000/api/menus";
const CATEGORIES_BASE_URL = "http://localhost:3000/api/categories";
const ITEM_BASE_URL = "http://localhost:3000/api/items";
const IMAGES_BASE_URL = "http://localhost:3000/api/images";

//registrarse
export const registerUser = async (data: RegisterData): Promise<User> => {
  try {
    const response = await fetch(USERS_BASE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // No incluimos TENANT_HEADER porque es un registro nuevo
      },
      body: JSON.stringify({
        name: data.name.trim(),
        lastName: data.lastName.trim(),
        email: data.email.trim(),
        cel: data.cel,
        roleId: data.roleId,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      // Manejar errores específicos del backend
      if (response.status === 409) {
        throw new Error("El email ya está en uso");
      }
      throw new Error(
        `Error al registrar usuario: ${response.status} - ${errorText}`
      );
    }

    const newUser: User = await response.json();
    //console.log("✅ Usuario registrado correctamente");
    return newUser;
  } catch (error) {
    console.error("❌ Error al registrar usuario:", error);
    throw error;
  }
};

// Resetear contraseña
export const resetPassword = async (
  token: string,
  password: string
): Promise<{ message: string }> => {
  try {
    const response = await fetch(
      "http://localhost:3000/api/auth/reset-password",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token,
          password: password.trim(),
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Error al restablecer la contraseña");
    }

    return data; // { message: "Contraseña actualizada correctamente" }
  } catch (error) {
    console.error("❌ Error al resetear contraseña:", error);
    throw error;
  }
};

// Solicitud para recuperar contraseña (enviar email con link)
export const forgotPassword = async (
  email: string,
): Promise<{ message: string }> => {
  try {
    const response = await fetch(
      "http://localhost:3000/api/users/forgot-password",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.trim(),
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.message || "No se pudo enviar el email de recuperación"
      );
    }

    return data; // { message: "Email enviado" } o lo que devuelva tu backend
  } catch (error) {
    console.error("❌ Error en forgotPassword:", error);
    throw error;
  }
};
//logearse
export const loginUser = async (data: LoginData): Promise<LoginResponse> => {
  try {
    const response = await fetch(`http://localhost:3000/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: data.email.trim().toLowerCase(),
        password: data.password.trim(),
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();

      // Manejar errores específicos del backend
      if (response.status === 403 && errorData.message === "USER_INACTIVE") {
        throw new Error("Tu cuenta está inactiva. Contacta al administrador.");
      }

      if (response.status === 401) {
        throw new Error("Email o contraseña incorrectos");
      }

      throw new Error(
        errorData.message || `Error al iniciar sesión: ${response.status}`
      );
    }

    const loginResponse: LoginResponse = await response.json();

    // Guardar el token en localStorage para futuras peticiones
    if (loginResponse.token) {
      localStorage.setItem("authToken", loginResponse.token);
      localStorage.setItem("user", JSON.stringify(loginResponse.user));
      localStorage.setItem("subdomain", loginResponse.user.subdomain);
      // Guardar token en cookies para el middleware
      document.cookie = `authToken=${loginResponse.token}; path=/; max-age=86400;`;
    }

    //console.log("✅ Login exitoso");
    return loginResponse;
  } catch (error) {
    //console.error("❌ Error al iniciar sesión:", error);
    throw error;
  }
};

// Función auxiliar para obtener el token
export const getAuthToken = (): string | null => {
  return localStorage.getItem("authToken");
};

// Función auxiliar para obtener el subdomain
export const getSubdomain = (): string => {
  return localStorage.getItem("subdomain") || "amax"; // fallback por si no hay
};

// Función auxiliar para obtener headers con tenant dinámico
const getTenantHeaders = (): Record<string, string> => {
  const subdomain = getSubdomain();
  return {
    "x-tenant-subdomain": subdomain,
  };
};

// Función auxiliar para logout
export const logoutUser = (): void => {
  localStorage.removeItem("authToken");
  localStorage.removeItem("user");
  localStorage.removeItem("subdomain");
  // Si usás cookies (solo si corresponde)
  document.cookie =
    "authToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  //console.log("✅ Sesión cerrada");
};

// Obtener todos los menús
export const getMenus = async (): Promise<Menu[]> => {
  try {
    const response = await fetch(BASE_URL, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...getTenantHeaders(),
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

// Obtener el QR de un menú
export const getMenuQr = async (
  menuId: string | number,
  format: string = "png",
  size: number = 300
): Promise<string> => {
  try {
    const response = await fetch(
      `${BASE_URL}/${menuId}/qr?format=${format}&size=${size}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...getTenantHeaders(),
        },
      }
    );

    if (!response.ok) {
      throw new Error("No se pudo obtener el QR del menú");
    }

    // Obtener la imagen QR como blob
    const qrBlob = await response.blob();
    console.log("✅ QR Blob recibido:", qrBlob);

    // Convertir el blob a una URL de imagen en base64
    const qrImageUrl = URL.createObjectURL(qrBlob);
    console.log("✅ URL del QR generada:", qrImageUrl);
    return qrImageUrl; // Devuelve la URL de la imagen QR en base64
  } catch (error) {
    console.error("❌ Error al obtener el QR del menú:", error);
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
        ...getTenantHeaders(),
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
        ...getTenantHeaders(),
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

    // 🔥 SOLUCIÓN: Si pos es null o string vacío, enviar string vacío
    // El backend lo convertirá a null con emptyToNull
    if (data.hasOwnProperty("pos")) {
      formData.append("pos", data.pos || "");
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
        ...getTenantHeaders(),
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
        ...getTenantHeaders(),
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

// CREAR una nueva categoría
export const createCategory = async (
  data: newCategory
): Promise<Categories> => {
  try {
    const response = await fetch(CATEGORIES_BASE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...getTenantHeaders(),
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
    //console.log("✅ Categoría creada correctamente");
    return newCategory;
  } catch (error) {
    console.error("❌ Error al crear categoría:", error);
    throw error;
  }
};

// EDITAR una categoria
export const updateCategory = async (
  categoryId: number,
  data: Partial<Categories> | UpdateCategoryPosition // Usamos Partial<Categories> para datos de actualización
): Promise<Categories> => {
  try {
    const response = await fetch(`${CATEGORIES_BASE_URL}/${categoryId}`, {
      method: "PUT", // 💡 Método PUT para actualización
      headers: {
        "Content-Type": "application/json",
        ...getTenantHeaders(),
      },
      body: JSON.stringify(data), // 💡 Enviamos solo los datos a actualizar (ej: { title: 'Nuevo Título' })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Error al actualizar categoría ${categoryId}: ${response.status} - ${errorText}`
      );
    } // El backend devuelve la categoría actualizada

    const updatedCategory: Categories = await response.json();
    //console.log(`✅ Categoría ${categoryId} actualizada correctamente`);
    return updatedCategory;
  } catch (error) {
    console.error("❌ Error al actualizar categoría:", error);
    throw error;
  }
};

// ELIMINAR una categoría
export const deleteCategory = async (categoryId: number): Promise<void> => {
  try {
    const response = await fetch(`${CATEGORIES_BASE_URL}/${categoryId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        ...getTenantHeaders(),
      },
    });

    // El backend responde con 204 No Content en caso de éxito, lo cual es correcto.
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Error al eliminar categoría: ${response.status} - ${errorText}`
      );
    }

    //  Log para confirmar en el front
    //console.log(`✅ Categoría ${categoryId} eliminada correctamente.`);
  } catch (error) {
    console.error("❌ Error al eliminar categoría:", error);
    throw error;
  }
};

// CRUD items

//Crear un item
export const createItem = async (data: newItem): Promise<Items> => {
  try {
    const payload = {
      categoryId: data.categoryId,
      title: data.title,
      price: data.price,
      description: data.description || undefined,
      // Omitimos las imágenes por ahora
    };

    //console.log("📤 Enviando payload:", payload);

    const response = await fetch(ITEM_BASE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...getTenantHeaders(),
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Error al crear ítem: ${response.status} - ${errorText}`);
    }

    const newItem: Items = await response.json();
    //console.log("✅ Ítem creado correctamente:", newItem);
    return newItem;
  } catch (error) {
    console.error("❌ Error al crear ítem:", error);
    throw error;
  }
};

//Editar un item
export const updateItem = async (
  itemId: number,
  data: Partial<Items> | UpdateItemPosition
): Promise<Items> => {
  try {
    const response = await fetch(`${ITEM_BASE_URL}/${itemId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...getTenantHeaders(),
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Error al actualizar ítem ${itemId}: ${response.status} - ${errorText}`
      );
    }

    const updatedItem: Items = await response.json();
    //console.log(`✅ Ítem ${itemId} actualizado correctamente`);
    return updatedItem;
  } catch (error) {
    console.error("❌ Error al actualizar ítem:", error);
    throw error;
  }
};

// borrar un item
export const deleteItem = async (itemId: number): Promise<void> => {
  try {
    const response = await fetch(`${ITEM_BASE_URL}/${itemId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        ...getTenantHeaders(),
      },
    });

    // El backend responde con 204 No Content en caso de éxito
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Error al eliminar ítem: ${response.status} - ${errorText}`
      );
    }

    // console.log(`✅ Ítem ${itemId} eliminado correctamente.`);
  } catch (error) {
    console.error("❌ Error al eliminar ítem:", error);
    throw error;
  }
};

//CRUD de imagenes

//la solicitud PUT debe ir aqui
export const upsertItemImages = async (
  itemId: number,
  images: Array<{
    id?: number;
    url?: string;
    fileField?: string;
    alt?: string;
    sortOrder?: number;
    active?: boolean;
    _delete?: boolean;
  }>,
  files?: File[]
): Promise<{ ok: boolean }> => {
  try {
    const formData = new FormData();

    // Agregar el array de imágenes como JSON string
    formData.append("images", JSON.stringify(images));

    // Agregar los archivos si existen
    if (files && files.length > 0) {
      files.forEach((file, index) => {
        // El fieldname debe coincidir con el fileField en el objeto images
        formData.append(`file_${index}`, file);
      });
    }

    const response = await fetch(`${IMAGES_BASE_URL}/items/${itemId}`, {
      method: "PUT",
      headers: {
        // ⚠️ NO incluir Content-Type con FormData
        ...getTenantHeaders(),
      },
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Error al actualizar imágenes: ${response.status} - ${errorText}`
      );
    }

    const result = await response.json();
    //console.log(`✅ Imágenes del ítem ${itemId} actualizadas correctamente`);
    return result;
  } catch (error) {
    console.error("❌ Error al actualizar imágenes:", error);
    throw error;
  }
};
