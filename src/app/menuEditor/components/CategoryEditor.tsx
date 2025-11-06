"use client";

import React, { useEffect, useState, useRef } from "react";
import { Plus, GripVertical, Trash2 } from "lucide-react";
import {
  Categories,
  newCategory,
  EditedCategory,
  newItem,
  Items,
} from "@/interfaces/menu";

interface CategoryEditorProps {
  categories: Categories[];
  onCategoriesChange: (categories: newCategory[]) => void;
  onEditCategory: (editedCategory: EditedCategory) => void;
  onDeleteCategory: (categoryId: number) => void;
  categoriesToDelete: number[];
}

const CategoryEditor = ({
  onCategoriesChange,
  onEditCategory,
  categories = [],
  onDeleteCategory,
  categoriesToDelete,
}: CategoryEditorProps) => {
  // Estado de nueva categoria
  const [newCategories, setNewCategories] = useState<newCategory[]>([]);
  // Estado local para los títulos editados de categorías existentes
  const [localTitles, setLocalTitles] = useState<{ [key: number]: string }>({});
  // Estado local para los items
  const [localItems, setLocalItems] = useState<{ [key: number]: Items[] }>({});
  

  // Referencia para el timeout del debounce
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  // Referencia para el timeout del debounce de edición
  const editDebounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  //  Inicializar títulos locales cuando cambian las categorías
  useEffect(() => {
    const titles: { [key: number]: string } = {};
    const items: { [key: number]: Items[] } = {};

    categories.forEach((cat) => {
      titles[cat.id] = cat.title;
      items[cat.id] = cat.items || [];
    });

    // Solo actualizar si realmente hay cambios
    setLocalTitles((prev) => {
      const hasChanges = categories.some((cat) => prev[cat.id] !== cat.title);
      return hasChanges ? titles : prev;
    });

    setLocalItems((prev) => {
      const hasChanges = categories.some(
        (cat) => JSON.stringify(prev[cat.id]) !== JSON.stringify(cat.items)
      );
      return hasChanges ? items : prev;
    });
  }, [categories]);

  // Limpiar timers al desmontar
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
      if (editDebounceTimerRef.current)
        clearTimeout(editDebounceTimerRef.current);
    };
  }, []);

  // Categorías visibles (no marcadas para eliminar)
  const visibleCategories = categories.filter(
    (cat) => !categoriesToDelete.includes(cat.id)
  );

  // mostrar las categorias combinadas
  const allCategories = [
    ...visibleCategories.map((cat) => ({
      ...cat,
      title: localTitles[cat.id] ?? cat.title,
      items: localItems[cat.id] ?? cat.items,
    })),
    ...newCategories,
  ];

  // Función para notificar al padre de los cambios en categorias con debounce
  const notifyNewCategoriesAdd = (updatedCategories: newCategory[]) => {
    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    debounceTimerRef.current = setTimeout(() => {
      onCategoriesChange(updatedCategories);
    }, 500);
  };

  // Función para notificar al padre de categorías editadas con debounce
  const notifyEditedCategory = (editedCategory: EditedCategory) => {
    if (editDebounceTimerRef.current)
      clearTimeout(editDebounceTimerRef.current);
    editDebounceTimerRef.current = setTimeout(() => {
      onEditCategory(editedCategory);
    }, 500);
  };

  //Crear una nueva categoria

  const createNewCategory = () => {
    const newCat: newCategory & { tempId: number } = {
      tempId: Date.now(),
      menuId: 1, // Usar timestamp como ID temporal
      title: "",
      items: [],
    };
    const updated = [...newCategories, newCat];
    setNewCategories(updated);
    onCategoriesChange(updated);
  };

  //Actualizar el título de la categoría
  const updateCategoryTitle = (categoryKey: number, newTitle: string) => {
  const isNewCategory = newCategories.some(
    (cat) => cat.id === categoryKey || cat.tempId === categoryKey
  );

  if (isNewCategory) {
    const updated = newCategories.map((cat) =>
      cat.id === categoryKey || cat.tempId === categoryKey
        ? { ...cat, title: newTitle }
        : cat
    );
    setNewCategories(updated);
    notifyNewCategoriesAdd(updated);
  } else {
    setLocalTitles((prev) => ({ ...prev, [categoryKey]: newTitle }));
    notifyEditedCategory({ id: categoryKey, title: newTitle });
  }
};

  // Eliminar categoría
  const deleteCategory = (categoryKey: number) => {
  const isNewCategory = newCategories.some(
    (cat) => cat.id === categoryKey || cat.tempId === categoryKey
  );

  if (isNewCategory) {
    const updated = newCategories.filter(
      (cat) => cat.id !== categoryKey && cat.tempId !== categoryKey
    );
    setNewCategories(updated);
    onCategoriesChange(updated);
  } else {
    onDeleteCategory(categoryKey);
  }
};

  // añadir un plato
  // añadir un plato
  const addItem = (categoryKey: number) => {
  const newItemObj: newItem & { tempId: number } = {
    tempId: Date.now(),
    categoryId: 1, // el menuId del restaurante, NO la categoría
    title: "",
    description: "",
    price: "",
    images: [],
  };

  const isNewCategory = newCategories.some(
    (cat) => cat.id === categoryKey || cat.tempId === categoryKey
  );

  if (isNewCategory) {
    // ✅ Categoría nueva
    const updated = newCategories.map((cat) =>
      cat.id === categoryKey || cat.tempId === categoryKey
        ? { ...cat, items: [...(cat.items || []), newItemObj] }
        : cat
    );
    setNewCategories(updated);
    notifyNewCategoriesAdd(updated);
  } else {
    // ✅ Categoría existente
    const updatedItems = [
      ...(localItems[categoryKey] || []),
      newItemObj,
    ];
    setLocalItems((prev) => ({
      ...prev,
      [categoryKey]: updatedItems,
    }));

    notifyEditedCategory({
      id: categoryKey,
      title: localTitles[categoryKey],
      items: updatedItems,
    });
  }
};

  // Actualizar un plato
  const updateItem = (
  categoryId: number,
  itemKey: number, // puede ser id o tempId
  field: keyof newItem,
  value: string
) => {
  const isNewCategory = newCategories.some((cat) => cat.id === categoryId);

    if (isNewCategory) {
    const updated = newCategories.map((cat) => {
      if (cat.id === categoryId) {
        const updatedItems = (cat.items || []).map((item) =>
          (item.id === itemKey || item.tempId === itemKey)
            ? field === "images"
              ? { ...item, images: [{ url: value }] }
              : { ...item, [field]: value }
            : item
        );
        return { ...cat, items: updatedItems };
      }
      return cat;
    });
       setNewCategories(updated);
    notifyNewCategoriesAdd(updated);
    } else {
    setLocalItems((prev) => {
      const categoryItems = prev[categoryId] || [];
      const updatedItems = categoryItems.map((item) =>
        (item.id === itemKey || item.tempId === itemKey)
          ? field === "images"
            ? { ...item, images: [{ url: value }] }
            : { ...item, [field]: value }
          : item
      );
      return { ...prev, [categoryId]: updatedItems };
    });

      // Notificar al backend
      const currentItems = localItems[categoryId] || [];
    const updatedItemsList = currentItems.map((item) =>
      (item.id === itemKey || item.tempId === itemKey)
        ? field === "images"
          ? { ...item, images: [{ url: value }] }
          : { ...item, [field]: value }
        : item
    );
      notifyEditedCategory({
      id: categoryId,
      title: localTitles[categoryId],
      items: updatedItemsList,
    });
    }
  };

  // 🆕 Eliminar plato
  const deleteItem = (categoryKey: number, itemKey: number) => {
  const isNewCategory = newCategories.some(
    (cat) => cat.id === categoryKey || cat.tempId === categoryKey
  );

  if (isNewCategory) {
    // ✅ Categoría nueva → eliminar item usando id o tempId
    const updated = newCategories.map((cat) =>
      cat.id === categoryKey || cat.tempId === categoryKey
        ? {
            ...cat,
            items: (cat.items || []).filter(
              (item) => item.id !== itemKey && item.tempId !== itemKey
            ),
          }
        : cat
    );
    setNewCategories(updated);
    notifyNewCategoriesAdd(updated);
  } else {
    // ✅ Categoría existente → eliminar del estado local
    const updatedItems = (localItems[categoryKey] || []).filter(
      (item) => item.id !== itemKey && item.tempId !== itemKey
    );

    setLocalItems((prev) => ({
      ...prev,
      [categoryKey]: updatedItems,
    }));

    notifyEditedCategory({
      id: categoryKey,
      title: localTitles[categoryKey],
      items: updatedItems,
    });
  }
};

  return (
    <div className="bg-white/80 backdrop-blur-xl border border-slate-200 rounded-xl shadow-md overflow-hidden sm:rounded-2xl sm:shadow-lg">
      {/* Header */}
      <div className="bg-gradient-to-b from-white/90 to-white/70 px-4 py-3 border-b border-slate-200 flex items-center justify-between">
        <h3 className="font-semibold text-slate-800 text-base sm:text-lg">
          Categorías y Platos
        </h3>
        <button
          onClick={createNewCategory}
          className="flex items-center justify-center gap-2 px-3 py-2 bg-gradient-to-br from-orange-400 to-orange-500 
              hover:from-orange-500 hover:to-orange-600 active:scale-[0.97]
              text-white rounded-lg text-sm font-semibold shadow-md hover:shadow-lg transition-all"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">Nueva Categoría</span>
        </button>
      </div>

      {/* Contenido */}
      <div className="p-3 sm:p-5 space-y-4">
        {allCategories.map((category) => (
          <div
            key={category.id ?? category.tempId}
            className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden"
          >
            {/* Nombre categoría */}
            <div className="flex items-center gap-3 px-3 py-3 border-b border-slate-200 bg-slate-50/50">
              <GripVertical className="w-4 h-4 text-slate-400 flex-shrink-0" />
              <input
                type="text"
                value={category.title}
                onChange={(e) =>
      updateCategoryTitle(category.id ?? category.tempId, e.target.value)
    }
                placeholder="Ej: Entradas, Postres..."
                className="flex-1 bg-white border border-slate-200 text-slate-800 text-sm rounded-lg px-3 py-2 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition-all"
              />
              <button
                 onClick={() => deleteCategory(category.id ?? category.tempId)}
                className="p-2 text-red-500 hover:bg-red-100 rounded-md transition-all"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            {/* Items */}
            <div className="p-3 space-y-3">
              {[...(category.items || [])]
                .sort((a, b) => {
                  // No ordenar items nuevos (sin id o con tempId)
                  const isANew = !a.id || "tempId" in a;
                  const isBNew = !b.id || "tempId" in b;

                  // Si ambos son nuevos, mantener orden original
                  if (isANew && isBNew) return 0;
                  // Items nuevos siempre al final
                  if (isANew) return 1;
                  if (isBNew) return -1;

                  // Solo ordenar items existentes alfabéticamente
                  const titleA = a.title?.toLowerCase() || "";
                  const titleB = b.title?.toLowerCase() || "";
                  return titleA.localeCompare(titleB);
                })
                .map((item) => (
                  <div
                    key={item.id ?? item.tempId}
                    className="bg-slate-50 rounded-lg p-3 border border-slate-200"
                  >
                    {/* Nombre del plato */}
                    <input
                      type="text"
                      value={item.title}
                      onChange={(e) =>
                        updateItem(
                          category.id,
                          item.id ?? item.tempId,
                          "title",
                          e.target.value
                        )
                      }
                      placeholder="Nombre del plato"
                      className="w-full bg-white border border-slate-200 text-slate-800 text-sm rounded-lg px-3 py-2 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition-all"
                    />

                    {/* Descripción */}
                    <textarea
                      value={item.description}
                      onChange={(e) =>
                        updateItem(
                          category.id,
                          item.id ?? item.tempId,
                          "description",
                          e.target.value
                        )
                      }
                      placeholder="Descripción (ingredientes, detalles...)"
                      rows={2}
                      className="w-full mt-2 bg-white border border-slate-200 text-slate-800 text-sm rounded-lg px-3 py-2 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 resize-none transition-all"
                    />

                    {/* Precio */}
                    <div className="relative mt-2">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">
                        $
                      </span>
                      <input
                        type="text"
                        value={item.price}
                        onChange={(e) =>
                          updateItem(
                            category.id,
                            item.id ?? item.tempId,
                            "price",
                            e.target.value
                          )
                        }
                        placeholder="Precio"
                        className="w-full bg-white border border-slate-200 text-slate-800 text-sm rounded-lg pl-7 pr-3 py-2 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition-all"
                      />
                    </div>

{/*<input
                      type="url"
                      value={item.images[0]?.url || ""}
                      onChange={(e) =>
        updateItem(category.id, item.id ?? item.tempId, "images", e.target.value)
      }
                      placeholder="URL de imagen..."
                      className="w-full mt-2 bg-white border border-slate-200 text-slate-800 text-sm rounded-lg px-3 py-2 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition-all"
                    /> */}
                    {/* Imagen con preview */}
<div className="mt-2 space-y-2">
  <label className="block text-sm font-medium text-slate-700">
    Imagen del plato
  </label>

  {/* Input URL */}
  <input
    type="url"
    value={item.images?.[0]?.url || ""}
    onChange={(e) =>
      updateItem(category.id, item.id ?? item.tempId, "images", e.target.value)
    }
    placeholder="https://ejemplo.com/imagen.jpg"
    className="w-full bg-white border border-slate-200 text-slate-800 text-sm rounded-lg px-3 py-2 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition-all"
  />

  {/* Preview */}
  {item.images?.[0]?.url && (
    <div className="relative w-full aspect-video bg-slate-100 rounded-xl overflow-hidden border border-slate-200">
      <img
        src={item.images[0].url}
        alt="Preview"
        className="w-full h-full object-cover"
        onError={(e) => {
          e.currentTarget.src =
            "https://via.placeholder.com/400x300?text=Imagen+no+disponible";
        }}
      />
    </div>
  )}
</div>
                    {/* Eliminar plato */}
                    <button
                      onClick={() => deleteItem(category.id ?? category.tempId, item.id ?? item.tempId)}
                      className="w-full mt-3 py-2 text-red-500 hover:bg-red-100 rounded-lg transition-all text-xs font-medium flex items-center justify-center gap-2"
                    >
                      <Trash2 className="w-4 h-4" />
                      Eliminar plato
                    </button>
                  </div>
                ))}

              {/* Agregar plato */}
              <button
                onClick={() => addItem(category.id ?? category.tempId)}
                className="w-full py-3 border-2 border-dashed border-slate-300 text-slate-500 hover:text-orange-500 hover:border-orange-400 rounded-lg transition-all text-sm font-medium flex items-center justify-center gap-2 bg-white"
              >
                <Plus className="w-4 h-4" />
                Agregar Plato
              </button>
            </div>
          </div>
        ))}

        {categories.length === 0 && (
          <div className="text-center py-12 px-4">
            <div className="w-14 h-14 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3 shadow-inner">
              <Plus className="w-7 h-7 text-slate-400" />
            </div>
            <p className="text-slate-600 text-base font-medium mb-1">
              No hay categorías aún
            </p>
            <p className="text-slate-500 text-sm">
              Toca "+" para comenzar a crear tu menú
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryEditor;
