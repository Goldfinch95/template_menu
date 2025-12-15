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
      useTenant: true,
    });
  },
//editar item
  async update(
    itemId: number,
    data: Partial<Items> | UpdateItemPosition
  ): Promise<Items> {
    return http.put<Items>(
      `${API_CONFIG.ENDPOINTS.ITEMS}/${itemId}`,
      data,
      { useTenant: true }
    );
  },
//borrar item
  async delete(itemId: number): Promise<void> {
    return http.delete<void>(`${API_CONFIG.ENDPOINTS.ITEMS}/${itemId}`, {
      useTenant: true,
    });
  },
};