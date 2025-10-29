
// validaciones
export const validateFormData = (formData: {
  title: string;
  logo: string;
  backgroundImage: string;
}): boolean => {
  if (!formData.title.trim()) return false;
  try {
    if (formData.logo) new URL(formData.logo);
    if (formData.backgroundImage) new URL(formData.backgroundImage);
  } catch {
    return false;
  }
  return true;
};

// cambio del input
export const handleInputChange = (
  e: React.ChangeEvent<HTMLInputElement>,
  setFormData: React.Dispatch<React.SetStateAction<any>>
) => {
  const { name, value } = e.target;

  if (name === "colorPrimary" || name === "colorSecondary") {
    setFormData((prev: any) => ({
      ...prev,
      color: {
        ...prev.color,
        [name === "colorPrimary" ? "primary" : "secondary"]: value,
      },
    }));
  } else {
    setFormData((prev: any) => ({ ...prev, [name]: value }));
  }
};