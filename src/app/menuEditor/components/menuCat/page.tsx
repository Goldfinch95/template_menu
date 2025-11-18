"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card } from "@/common/components/ui/card";
import { Button } from "@/common/components/ui/button";
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@/common/components/ui/collapsible";
import {
  ChevronUp,
  ChevronDown,
  Plus,
  Edit2,
  Trash2,
  Utensils,
  Pencil,
} from "lucide-react";
import CatDialog from "./components/CatDialog";
import ItemDialog from "./components/ItemDialog";
import { Categories } from "@/interfaces/menu";
import { deleteCategory, updateCategory } from "@/common/utils/api";
import { cn } from "@/common/utils/utils";

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
  // 🆕 Estado para controlar la categoría desplegada (usando su ID)
  const [expandedCategoryId, setExpandedCategoryId] = useState<number | null>(
    null
  );

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
        <div className="mb-4">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-slate-500 uppercase tracking-wider mb-0 ml-1">
              Menú
            </p>
            {/*abir dialogo de crear categoria */}
            <div className="flex-shrink-0">
              <CatDialog
                menuId={menuId}
                onCategoryCreated={onCategoryChange}
                trigger={
                  <Button
                    size="icon"
                    className="bg-orange-500 text-white p-2 rounded-lg h-8 w-8 shadow-md hover:bg-orange-600 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                }
              />
            </div>
          </div>
          {/*mostrar categorias de la BD */}
          <div className="space-y-3 mt-4">
            {menuCategories && menuCategories.length > 0 ? (
              menuCategories.map((category) => (
                // 🆕 Envolvemos cada categoría en Collapsible
                <Collapsible
                  key={category.id}
                  open={expandedCategoryId === category.id}
                  onOpenChange={() =>
                    setExpandedCategoryId(
                      expandedCategoryId === category.id ? null : category.id
                    )
                  }
                >
                  {/* Contenedor principal de la Categoría (Trigger) */}
                  <div className="flex items-center justify-between p-3 bg-white border border-slate-100 rounded-lg shadow-sm">
                    {/* INPUT EDITABLE */}
                    <input
                      type="text"
                      value={categoryTitles[category.id] ?? category.title}
                      onChange={(e) =>
                        handleTitleChange(category.id, e.target.value)
                      }
                      className="flex-1 min-w-0 p-1 font-semibold text-slate-700 bg-transparent border-b border-transparent focus:border-orange-500 focus:outline-none transition-colors"
                    />

                    {/* BOTONES DE ACCIÓN */}
                    <div className="flex space-x-2">
                      {/* Botón Guardar/Editar */}
                      <Button
                        variant="ghost"
                        size="icon"
                        disabled={savingId === category.id}
                        onClick={() => handleEditSave(category.id)}
                        className="h-8 w-8 text-orange-500 hover:text-orange-600 relative"
                      >
                        {/* ... (Spinner o Edit2) ... */}
                        {savingId === category.id ? (
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

                      {/* 🆕 Botón de Plegar/Desplegar */}
                      <CollapsibleTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className={cn(
                            "h-8 w-8 p-0 rounded-lg transition-all duration-200",
                            expandedCategoryId === category.id
                              ? "bg-orange-50 text-orange-500 shadow-sm"
                              : "text-slate-500 hover:bg-slate-100"
                          )}
                        >
                          {expandedCategoryId === category.id ? (
                            <ChevronUp className="w-4 h-4" />
                          ) : (
                            <ChevronDown className="w-4 h-4" />
                          )}
                        </Button>
                      </CollapsibleTrigger>
                    </div>
                  </div>

                  {/* 🆕 CONTENIDO DESPLEGABLE (Aquí irían los items, si existieran) */}
                  <CollapsibleContent>
                    <div className="mt-3 space-y-3">
                      {/* TODO: Implementar la función de ordenación si es necesaria. */}
                      {
                        // Utilizamos la data de ítems sin ordenar por ahora, o implementa una función de ordenación simple.
                        [...(category.items || [])].map((item) => {
                          // TODO: Implementar getImagePreviewUrl(item.images?.[0])
                          const previewUrl = item.images?.[0]?.url || null;
                          // Usamos 'url' como un supuesto para el placeholder

                          return (
                            <div
                              key={item.id ?? item.tempId}
                              className="flex justify-between items-center bg-white border border-slate-200 rounded-xl p-3"
                            >
                              <div className="flex items-center gap-3 overflow-hidden">
                                {previewUrl ? (
                                  <div
                                    style={{
                                      backgroundImage: `url(${previewUrl})`,
                                    }}
                                    className="w-12 h-12 rounded-lg border border-slate-200 bg-center bg-cover"
                                  />
                                ) : (
                                  <div className="w-12 h-12 rounded-lg bg-slate-100 flex items-center justify-center">
                                    {/* Utensils debe estar importado */}
                                    <Utensils className="w-5 h-5 text-slate-400" />
                                  </div>
                                )}

                                <p className="font-medium text-slate-700 text-sm truncate max-w-[120px]">
                                  {item.title || "Nuevo plato"}
                                </p>
                                {item.price && (
                                  <p className="text-slate-500 text-xs">
                                    ${item.price}
                                  </p>
                                )}
                              </div>
                              <div className="flex gap-2">
                                <ItemDialog
                                  categoryId={category.id}
                                  item={item}
                                  onItemSaved={onCategoryChange} // para refrescar al guardar
                                  trigger={
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      className="text-orange-500 hover:text-orange-600"
                                    >
                                      <Pencil className="w-4 h-4" />
                                    </Button>
                                  }
                                />
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="text-red-500 hover:text-red-600"
                                  onClick={() => {
                                    // TODO: Implementar deleteItem(category.id, item.id)
                                    console.log("Delete item:", item.id);
                                  }}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                          );
                        })
                      }

                      <div className="pt-4 mt-4 border-t border-slate-300">
                        <ItemDialog
                                  categoryId={category.id}
                                  
                                  onItemSaved={onCategoryChange} // para refrescar al guardar
                                  trigger={
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      className="w-full border-dashed border-slate-300 text-slate-500 hover:border-orange-400 hover:text-orange-500 rounded-xl py-5"
                                    >
                                      <Plus className="w-4 h-4 mr-2" /> Agregar plato
                                    </Button>
                                  }
                                />
                        
                      </div>
                    </div>
                  </CollapsibleContent>
                </Collapsible>
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
