
// validaciones
export const validateFormData = (formData: any): boolean => {
  return !!(
    formData.title?.trim() &&
    formData.pos?.trim()
  );
};

// Manejar cambios en inputs simples
export const handleInputChange = (
  e: React.ChangeEvent<HTMLInputElement>,
  setFormData: React.Dispatch<React.SetStateAction<any>>
) => {
  const { name, value } = e.target;

  // Si el campo es anidado (ej: color.primary)
  if (name.includes(".")) {
    const [parent, child] = name.split(".");
    setFormData((prev: any) => ({
      ...prev,
      [parent]: {
        ...prev[parent],
        [child]: value,
      },
    }));
  } else {
    // Campo simple
    setFormData((prev: any) => ({
      ...prev,
      [name]: value,
    }));
  }
};