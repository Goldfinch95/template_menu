import { createMenu, updateMenu, deleteMenu } from "@/common/utils/api";

// Guardar menu
export const saveMenu = async (
  isCreating: boolean,
  menuId: string | null,
  formData: any
) => {
  if (isCreating) {
    return await createMenu(formData);
  } else {
    return await updateMenu(menuId!, formData);
  }
};

//Eliminar menu

export const removeMenu = async (id: number) => {
  return await deleteMenu(id);
};