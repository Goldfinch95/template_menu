import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { Card } from "@/common/components/ui/card";
import { Button } from "@/common/components/ui/button";
import { Plus, Edit2, Trash2, X } from "lucide-react";
import CatDialog from "./components/CatDialog";
import { Categories } from "@/interfaces/menu";
import { deleteCategory } from "@/common/utils/api";

interface CatEditorProps {
  menuId: number;
  menuCategories: Categories[];
  onCategoryChange: () => Promise<void>;
}

const MenuCatPage = ({ menuId, menuCategories, onCategoryChange }: CatEditorProps) => {
  useEffect(() => {
    console.log("Categorías recibidas en MenuCatPage:", menuCategories);
  }, [menuCategories]);

  // borrar categorias
  const handleDelete = async (categoryId: number) => {
    try {
      // 1. Llamar a la API para borrar
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
                  key={category.id} // 👈 ¡CLAVE! React necesita una 'key' única para cada elemento mapeado.
                  className="flex items-center justify-between p-3 bg-white border border-slate-100 rounded-lg shadow-sm"
                >
                  <span className="font-semibold text-slate-700">
                    {category.title} {/* Muestra el título de la categoría */}
                  </span>
                  <div className="flex space-x-2">
                    {/* Botón para editar */}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-orange-500 hover:text-orange-600"
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    {/* Botón para eliminar */}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-red-500 hover:bg-red-50"
                      // Llamar a la función handleDelete al hacer clic
                      onClick={() => handleDelete(category.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              // Mensaje si no hay categorías
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
