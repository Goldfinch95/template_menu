"use client"

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Card } from "@/common/components/ui/card";
import { Button } from "@/common/components/ui/button";
import { Plus, Edit2, Trash2 } from "lucide-react";
import CatDialog from "./components/CatDialog";
import { Categories } from "@/interfaces/menu";
import { deleteCategory, updateCategory } from "@/common/utils/api";

interface CatEditorProps {
  menuId: number;
  menuCategories: Categories[];
  onCategoryChange: () => Promise<void>;
}

const MenuCatPage = ({
  menuId,
  menuCategories,
  onCategoryChange,
}: CatEditorProps) => {

  // Estado para manejar los títulos editables de todas las categorías
  const [categoryTitles, setCategoryTitles] = useState<Record<number, string>>(
    {}
  );

  // Estado para manejar la carga
  const [savingId, setSavingId] = useState<number | null>(null);

  // Editar categoria local
  const handleTitleChange = (categoryId: number, newTitle: string) => {
    setCategoryTitles((prev) => ({
      ...prev,
      [categoryId]: newTitle, // Actualiza solo el título de la categoría específica
    }));
  };

  // GUARDAR edición de categoria
  const handleEditSave = async (categoryId: number) => {
    const newTitle = categoryTitles[categoryId];

    // 1. Obtener el título original para la verificación (evitar llamadas innecesarias)
    const originalCategory = menuCategories.find((c) => c.id === categoryId);

    // 2. Comprobar si hay un cambio real
    if (originalCategory && originalCategory.title === newTitle) {
      console.log("No hay cambios para guardar en la categoría:", categoryId);
      return; // No hace nada si el título es el mismo
    }

    setSavingId(categoryId); // Activa el estado de carga para el botón

    try {
      //  actualizar en la BD
      await updateCategory(categoryId, { title: newTitle });

      //  Notificar
      await onCategoryChange();

      console.log(`✅ Categoría ${categoryId} actualizada: ${newTitle}`);
    } catch (error) {
      console.error("❌ Error al guardar la edición de categoría:", error);
      alert("Error al guardar la categoría. Revisa la consola.");
    } finally {
      setSavingId(null); // Desactiva el estado de carga
    }
  };

  // Borrar Categoria
  const handleDelete = async (categoryId: number) => {
    try {
      // 1. borrar en la BD
      await deleteCategory(categoryId);

      // 2. Notificar
      await onCategoryChange();
    } catch (error) {
      console.error("Error al eliminar categoría:", error);
      // Opcional: Muestra una notificación de error
      // showToast("Error al eliminar la categoría.", "error");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="w-full px-4"
    >
      <Card className="bg-white/80 backdrop-blur-sm border border-slate-200/50 rounded-2xl shadow-md p-6 w-full max-w-sm mx-auto">
        <div className="text-center mb-4">
          <p className="text-sm font-medium text-slate-500 uppercase tracking-wider mb-2">
            Menú
          </p>
          {/*abir dialogo de crear categoria */}
          <CatDialog
            menuId={menuId}
            onCategoryCreated={onCategoryChange}
            trigger={
              <Button className="w-full mt-3 bg-orange-500 text-white py-6 rounded-xl">
                <Plus className="w-4 h-4" />
              </Button>
            }
          />
          {/*mostrar categorias de la BD */}
          <div className="space-y-3 mt-4">
            {menuCategories && menuCategories.length > 0 ? (
              menuCategories.map((category) => (
                <div
                  key={category.id}
                  className="flex items-center justify-between p-3 bg-white border border-slate-100 rounded-lg shadow-sm"
                >
                  {/* INPUT EDITABLE (se muestra siempre) */}
                  <input
                    type="text"
                    // Usamos el estado local o un fallback si categoryTitles aún no se ha inicializado
                    value={categoryTitles[category.id] ?? category.title}
                    onChange={(e) =>
                      handleTitleChange(category.id, e.target.value)
                    }
                    className="flex-1 p-1 font-semibold text-slate-700 bg-transparent border-b border-transparent focus:border-orange-500 focus:outline-none transition-colors"
                  />

                  {/* BOTONES DE ACCIÓN */}
                  <div className="flex space-x-2">
                    {/* Botón Guardar/Editar */}
                    <Button
                      variant="ghost"
                      size="icon"
                      // Deshabilitado si ya está guardando
                      disabled={savingId === category.id}
                      // Al hacer clic, se llama a handleEditSave para enviar los datos
                      onClick={() => handleEditSave(category.id)}
                      className="h-8 w-8 text-orange-500 hover:text-orange-600 relative"
                    >
                      {/* Mostrar un spinner si está guardando, sino el ícono de edición */}
                      {savingId === category.id ? (
                        // Puedes usar un spinner si tienes uno (ej: de shadcn/ui)
                        // O solo deshabilitar y confiar en el estilo
                        <svg
                          className="animate-spin h-4 w-4 text-orange-500"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                      ) : (
                        <Edit2 className="h-4 w-4" />
                      )}
                    </Button>

                    {/* Botón Eliminar */}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-red-500 hover:bg-red-50"
                      onClick={() => handleDelete(category.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-400 italic mt-6">
                No hay categorías creadas aún.
              </p>
            )}
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default MenuCatPage;
