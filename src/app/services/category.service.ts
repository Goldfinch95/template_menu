import {
  Categories,
  newCategory,
  UpdateCategoryPosition,
} from "@/interfaces/menu";
import { API_CONFIG } from "@/common/utils/config";
import { http } from "@/common/utils/http";

//crear categoria
export const categoryService = {
  async create(data: newCategory): Promise<Categories> {
    return http.post<Categories>(
      API_CONFIG.ENDPOINTS.CATEGORIES,
      { menuId: data.menuId, title: data.title },
      { useAuth: true, useTenant: true }
    );
  },

  //editar categoria
  async update(
    categoryId: number,
    data: Partial<Categories> | UpdateCategoryPosition
  ): Promise<Categories> {
    return http.put<Categories>(
      `${API_CONFIG.ENDPOINTS.CATEGORIES}/${categoryId}`,
      data,
      { useAuth: true, useTenant: true }
    );
  },
  //borrar categoria
  async delete(categoryId: number): Promise<void> {
    return http.delete<void>(
      `${API_CONFIG.ENDPOINTS.CATEGORIES}/${categoryId}`,
      { useAuth: true, useTenant: true }
    );
  },
};
