import { Items, newItem, UpdateItemPosition } from "@/interfaces/menu";
import { API_CONFIG } from "@/common/utils/config";
import { http } from "@/common/utils/http";

//crear item
export const itemService = {
  async create(data: newItem): Promise<Items> {
    const payload = {
      categoryId: data.categoryId,
      title: data.title,
      price: data.price,
      description: data.description || undefined,
      active: data.active,
    };

    return http.post<Items>(API_CONFIG.ENDPOINTS.ITEMS, payload, {
      useAuth: true,
      useTenant: true,
    });
  },
  //editar item
  async update(
    itemId: number,
    data: Partial<Items> | UpdateItemPosition
  ): Promise<Items> {
    return http.put<Items>(`${API_CONFIG.ENDPOINTS.ITEMS}/${itemId}`, data, {
      useAuth: true,
      useTenant: true,
    });
  },
  //borrar item
  async delete(itemId: number): Promise<void> {
    return http.delete<void>(`${API_CONFIG.ENDPOINTS.ITEMS}/${itemId}`, {
      useAuth: true,
      useTenant: true,
    });
  },
};
