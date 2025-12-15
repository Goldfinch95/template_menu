import { Menu, newMenu } from "@/interfaces/menu";
import { API_CONFIG } from "@/common/utils/config";
import { http } from "@/common/utils/http";

//obtener todos los menus
export const menuService = {
  async getAll(): Promise<Menu[]> {
    return http.get<Menu[]>(API_CONFIG.ENDPOINTS.MENUS, {
      useAuth: true,
      useTenant: true,
      cache: "no-store",
    });
  },

  //obtener menu especifico
  async getById(id: string | number): Promise<Menu> {
    return http.get<Menu>(`${API_CONFIG.ENDPOINTS.MENUS}/${id}`, {
      useAuth: true,
      useTenant: true,
    });
  },

  //crear menu
  async create(data: newMenu): Promise<Menu> {
    const formData = new FormData();

    formData.append("title", data.title);
    if (data.userId !== undefined)
      formData.append("userId", String(data.userId));
    if (data.pos) formData.append("pos", data.pos);
    if (data.color) formData.append("color", JSON.stringify(data.color));
    if (data.logo) formData.append("logo", data.logo);
    if (data.backgroundImage)
      formData.append("backgroundImage", data.backgroundImage);

    return http.uploadFormData<Menu>(API_CONFIG.ENDPOINTS.MENUS, formData, {
      useAuth: true,
      useTenant: true,
    });
  },
  //editar menu
  async update(id: string | number, data: Partial<Menu>): Promise<Menu> {
    const formData = new FormData();

    if (data.title !== undefined) formData.append("title", data.title);
    if (data.userId !== undefined)
      formData.append("userId", String(data.userId));
    if (data.hasOwnProperty("pos")) formData.append("pos", data.pos || "");
    if (data.color !== undefined)
      formData.append("color", JSON.stringify(data.color));
    if (data.logo) formData.append("logo", data.logo);
    if (data.backgroundImage)
      formData.append("backgroundImage", data.backgroundImage);

    return http.uploadFormData<Menu>(
      `${API_CONFIG.ENDPOINTS.MENUS}/${id}`,
      formData,
      { method: "PUT", useAuth: true, useTenant: true }
    );
  },
  //borrar menu
  async delete(id: string | number): Promise<void> {
    return http.delete<void>(`${API_CONFIG.ENDPOINTS.MENUS}/${id}`, {
      useAuth: true,
      useTenant: true,
    });
  },

  //obtener qr
  async getQr(
    menuId: string | number,
    format: string = "png",
    size: number = 300
  ): Promise<string> {
    const response = await fetch(
      `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.MENUS}/${menuId}/qr?format=${format}&size=${size}`,
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

    const qrBlob = await response.blob();
    return URL.createObjectURL(qrBlob);
  },
};
