import { API_CONFIG } from "@/common/utils/config";
import { http } from "@/common/utils/http";

interface ImageData {
  id?: number;
  url?: string;
  fileField?: string;
  alt?: string;
  sortOrder?: number;
  active?: boolean;
  _delete?: boolean;
}

//subir imagen
export const imageService = {
  async upsertItemImages(
    itemId: number,
    images: ImageData[],
    files?: File[]
  ): Promise<{ ok: boolean }> {
    const formData = new FormData();

    formData.append("images", JSON.stringify(images));

    if (files && files.length > 0) {
      files.forEach((file, index) => {
        formData.append(`file_${index}`, file);
      });
    }

    return http.uploadFormData<{ ok: boolean }>(
      `${API_CONFIG.ENDPOINTS.IMAGES}/items/${itemId}`,
      formData,
      { method: "PUT", useAuth: true, useTenant: true }
    );
  },
};