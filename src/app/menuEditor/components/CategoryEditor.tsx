"use client";

import React, { useEffect, useState, useRef } from "react";
import { Plus, GripVertical, Trash2 } from "lucide-react";
import { Categories, newCategory, EditedCategory, newItem } from "@/interfaces/menu";

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
  //estado de nueva categoria
  const [newCategories, setNewCategories] = useState<newCategory[]>([]);

    // 🆕 Estado local para los títulos editados de categorías existentes
    const [localTitles, setLocalTitles] = useState<{ [key: number]: string }>({});

   // Referencia para el timeout del debounce
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // 🆕 Referencia para el timeout del debounce de edición
  const editDebounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // 🆕 Inicializar títulos locales cuando cambian las categorías
  useEffect(() => {
    const titles: { [key: number]: string } = {};
    categories.forEach(cat => {
      titles[cat.id] = cat.title;
    });
    setLocalTitles(titles);
  }, [categories]);

  // Filtrar categorías que NO están marcadas para eliminar
  const visibleCategories = categories.filter(
    (cat) => !categoriesToDelete.includes(cat.id)
  );
  

  // mostrar las categorias combinadas
  const allCategories = [
    ...visibleCategories.map(cat => ({
      ...cat,
      title: localTitles[cat.id] ?? cat.title, // 🆕 Usar título local si existe
    })),
    ...newCategories
  ];

  // funcion para notificar al padre de los cambios en categorias con debounce
  const notifyNewCategoriesAdd = (updatedCategories: newCategory[]) => {
    // Limpiar el timer anterior si existe
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // Crear nuevo timer
    debounceTimerRef.current = setTimeout(() => {
      onCategoriesChange(updatedCategories);
    }, 500); // 500ms de espera
  };

  // 🆕 Función para notificar al padre de categorías editadas con debounce
  const notifyEditedCategory = (editedCategory: EditedCategory) => {
    // Limpiar el timer anterior si existe
    if (editDebounceTimerRef.current) {
      clearTimeout(editDebounceTimerRef.current);
    }

    // Crear nuevo timer
    editDebounceTimerRef.current = setTimeout(() => {
      
      onEditCategory(editedCategory);
    }, 500); // 500ms de espera
  };

  // Limpiar el timer cuando el componente se desmonte
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  //Crear una nueva categoria

  const createNewCategory = () => {
    const newCat: newCategory = {
      id: Date.now(),
      menuId: 1, // Usar timestamp como ID temporal
      title: "",
      items: [],
    };
    const updatedNewCategories = [...newCategories, newCat];
    setNewCategories(updatedNewCategories);
    onCategoriesChange(updatedNewCategories);
  };

  //Actualizar el título de la categoría
  const UpdateCategoryTitle = (id: number, newTitle: string) => {
    const isNewCategory = newCategories.some((cat) => cat.id === id);

    if (isNewCategory) {
     const update = newCategories.map((cat) =>
        cat.id === id ? { ...cat, title: newTitle } : cat
      );
      setNewCategories(update);
      notifyNewCategoriesAdd(update);
    }
    // 🆕 Si es una categoría EXISTENTE, actualizar estado local y notificar al padre
    else{
      
      setLocalTitles(prev => ({
        ...prev,
        [id]: newTitle
      }));
      
      // Y notificar al padre con debounce
      const editedCategory: EditedCategory = {
        id: id,
        title: newTitle,
      };
      notifyEditedCategory(editedCategory);
    }
  };

  // Eliminar una categoría
  const deleteCategory = (id: number) => {
    const isNewCategory = newCategories.some((cat) => cat.id === id);

    if (isNewCategory) {
      // Si es una categoría nueva (local), la eliminamos del estado
      const updated = newCategories.filter((cat) => cat.id !== id);
      setNewCategories(updated);
      onCategoriesChange(updated); // ← Notificar solo con las nuevas actualizadas
    }else{
       // Si es una categoría existente (de la BD), la marcamos para eliminar
      onDeleteCategory(id);
    }
  };

  // añadir un plato
  const addItem = () =>{
    console.log("crear un nuevo item")
    // Crear nuevo item vacío
  const newItem: newItem = {
    id: Date.now(), // ID temporal único
    title: "",
    description: "",
    price: "",
    images: [],
  };

  
    
    //acceder a la categoria seleccionada
    console.log(visibleCategories[1].id)
    //acceder a los items de la categoria
    console.log(visibleCategories[1].id.items)
    //añadir el item dentro de los items de categoria

    //mostrar en consola el resultado

  }
  

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
            key={category.id}
            className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden"
          >
            {/* Nombre categoría */}
            <div className="flex items-center gap-3 px-3 py-3 border-b border-slate-200 bg-slate-50/50">
              <GripVertical className="w-4 h-4 text-slate-400 flex-shrink-0" />
              <input
                type="text"
                value={category.title}
                onChange={(e) =>
                  UpdateCategoryTitle(category.id, e.target.value)
                }
                placeholder="Ej: Entradas, Postres..."
                className="flex-1 bg-white border border-slate-200 text-slate-800 text-sm rounded-lg px-3 py-2 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition-all"
              />
              <button
                onClick={() => deleteCategory(category.id)}
                className="p-2 text-red-500 hover:bg-red-100 rounded-md transition-all"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            {/* Items */}
            <div className="p-3 space-y-3">
              {category.items?.map((item) => (
                <div
                  key={item.id}
                  className="bg-slate-50 rounded-lg p-3 border border-slate-200"
                >
                  {/* Nombre del plato */}
                  <input
                    type="text"
                    defaultValue={item.title}
                    placeholder="Nombre del plato"
                    className="w-full bg-white border border-slate-200 text-slate-800 text-sm rounded-lg px-3 py-2 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition-all"
                  />

                  {/* Descripción */}
                  <textarea
                    defaultValue={item.description}
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
                      defaultValue={item.price}
                      placeholder="Precio"
                      className="w-full bg-white border border-slate-200 text-slate-800 text-sm rounded-lg pl-7 pr-3 py-2 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition-all"
                    />
                  </div>

                  {/* Imagen */}
                  <input
                    type="url"
                    defaultValue={item.images[0]?.url || ""}
                    placeholder="URL de imagen..."
                    className="w-full mt-2 bg-white border border-slate-200 text-slate-800 text-sm rounded-lg px-3 py-2 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition-all"
                  />

                  {/* Eliminar plato */}
                  <button className="w-full mt-3 py-2 text-red-500 hover:bg-red-100 rounded-lg transition-all text-xs font-medium flex items-center justify-center gap-2">
                    <Trash2 className="w-4 h-4" />
                    Eliminar plato
                  </button>
                </div>
              ))}

              {/* Agregar plato */}
              <button onClick={addItem} className="w-full py-3 border-2 border-dashed border-slate-300 text-slate-500 hover:text-orange-500 hover:border-orange-400 rounded-lg transition-all text-sm font-medium flex items-center justify-center gap-2 bg-white">
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
