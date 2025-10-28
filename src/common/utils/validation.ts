// vlaidaicon del guardado
export const canSaveMenu = (formData: any) => {
  if (!formData.nombre.trim()) return false;
  try {
    if (formData.logoUrl) new URL(formData.logoUrl);
    if (formData.backgroundUrl) new URL(formData.backgroundUrl);
  } catch {
    return false;
  }
  return true;
};