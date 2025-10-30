"use client"

import React, { useState } from "react";
import { Card } from "@/common/components/ui/card";
import { NewCategoryPayload, NewItem } from "@/interfaces/menu";
import ItemForm from "./ItemForm";
import { Plus, Trash2, ChevronDown, ChevronUp } from "lucide-react";

interface CategoryEditorProps {
  onCategorySubmit?: (category: NewCategoryPayload) => void;
  menuId: number;
}

const CategoryEditor = ({ onCategorySubmit, menuId }: CategoryEditorProps) => {
  const [categories, setCategories] = useState<NewCategoryPayload[]>([]);
  const [currentCategory, setCurrentCategory] = useState<Partial<NewCategoryPayload>>({
    title: "",
    description: "",
    active: true,
    items: []
  });
  const [showItemForm, setShowItemForm] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState<Set<number>>(new Set());

  const handleAddItem = (item: NewItem) => {
    setCurrentCategory(prev => ({
      ...prev,
      items: [...(prev.items || []), item]
    }));
    setShowItemForm(false);
  };

  const handleRemoveItem = (index: number) => {
    setCurrentCategory(prev => ({
      ...prev,
      items: prev.items?.filter((_, i) => i !== index)
    }));
  };

  const handleAddCategory = () => {
    if (!currentCategory.title?.trim()) {
      alert("El título de la categoría es obligatorio");
      return;
    }

    const newCategory: NewCategoryPayload = {
      menuId,
      title: currentCategory.title.trim(),
      description: currentCategory.description?.trim() || null,
      active: currentCategory.active ?? true,
      items: currentCategory.items && currentCategory.items.length > 0 ? currentCategory.items : undefined
    };

    setCategories([...categories, newCategory]);

    if (onCategorySubmit) {
      onCategorySubmit(newCategory);
    }

    // Limpiar formulario
    setCurrentCategory({
      title: "",
      description: "",
      active: true,
      items: []
    });
    setShowItemForm(false);
  };

  const handleRemoveCategory = (index: number) => {
    setCategories(categories.filter((_, i) => i !== index));
  };

  const toggleCategoryExpansion = (index: number) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedCategories(newExpanded);
  };

  return (
    <div className="space-y-6">
      {/* Formulario de Nueva Categoría */}
      <Card className="bg-white/70 backdrop-blur-xl border border-white/40 rounded-2xl p-6 shadow-lg">
        <div className="space-y-6">
          {/* Título */}
          <h3 className="font-semibold text-slate-800 text-lg">
            Crear Nueva Categoría
          </h3>

          {/* Inputs */}
          <div className="space-y-5">
            {/* Título de la Categoría */}
            <div>
              <label
                htmlFor="category-title"
                className="block text-sm font-medium text-slate-700 mb-2"
              >
                Título de la Categoría *
              </label>
              <input
                id="category-title"
                name="title"
                type="text"
                value={currentCategory.title || ""}
                onChange={(e) => setCurrentCategory({ ...currentCategory, title: e.target.value })}
                placeholder="Ej: Bebidas, Platos Principales, Postres"
                className="w-full px-4 py-2 border border-slate-300 rounded-lg placeholder:text-slate-400 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>

            {/* Descripción de la Categoría */}
            <div>
              <label
                htmlFor="category-description"
                className="block text-sm font-medium text-slate-700 mb-2"
              >
                Descripción
              </label>
              <textarea
                id="category-description"
                name="description"
                value={currentCategory.description || ""}
                onChange={(e) => setCurrentCategory({ ...currentCategory, description: e.target.value })}
                placeholder="Descripción opcional de la categoría"
                rows={2}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg placeholder:text-slate-400 focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
              />
            </div>

            {/* Toggle Activo */}
            <div className="flex items-center justify-between">
              <label
                htmlFor="category-active"
                className="text-sm font-medium text-slate-700"
              >
                Categoría Activa
              </label>
              <button
                id="category-active"
                type="button"
                onClick={() => setCurrentCategory({ ...currentCategory, active: !currentCategory.active })}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  currentCategory.active ? "bg-orange-500" : "bg-slate-300"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    currentCategory.active ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>

            {/* Items de la categoría actual */}
            {currentCategory.items && currentCategory.items.length > 0 && (
              <div className="space-y-3">
                <label className="block text-sm font-medium text-slate-700">
                  Items en esta categoría ({currentCategory.items.length})
                </label>
                <div className="space-y-2">
                  {currentCategory.items.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-start justify-between p-3 bg-slate-50 rounded-lg border border-slate-200"
                    >
                      <div className="flex-1">
                        <p className="font-medium text-slate-800">{item.title}</p>
                        {item.description && (
                          <p className="text-sm text-slate-600 mt-1">{item.description}</p>
                        )}
                        <p className="text-sm font-semibold text-orange-600 mt-1">
                          ${item.price.toFixed(2)}
                        </p>
                        {item.images && item.images.length > 0 && (
                          <p className="text-xs text-slate-500 mt-1">
                            {item.images.length} imagen{item.images.length !== 1 ? 'es' : ''}
                          </p>
                        )}
                      </div>
                      <button
                        onClick={() => handleRemoveItem(index)}
                        className="text-red-500 hover:text-red-700 transition-colors ml-3"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Botón para mostrar formulario de item */}
            {!showItemForm && (
              <button
                type="button"
                onClick={() => setShowItemForm(true)}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-lg transition-colors border border-slate-300"
              >
                <Plus size={20} />
                Agregar Item a esta categoría
              </button>
            )}
          </div>

          {/* Botón para agregar categoría */}
          <button
            onClick={handleAddCategory}
            className="w-full bg-gradient-to-br from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            Agregar Categoría
          </button>
        </div>
      </Card>

      {/* Formulario de Item (condicional) */}
      {showItemForm && (
        <ItemForm
          onAddItem={handleAddItem}
          onCancel={() => setShowItemForm(false)}
        />
      )}

      {/* Lista de Categorías Agregadas */}
      {categories.length > 0 && (
        <Card className="bg-white/70 backdrop-blur-xl border border-white/40 rounded-2xl p-6 shadow-lg">
          <div className="space-y-4">
            <h3 className="font-semibold text-slate-800 text-lg">
              Categorías Agregadas ({categories.length})
            </h3>
            <div className="space-y-3">
              {categories.map((category, index) => (
                <div
                  key={index}
                  className="border border-slate-200 rounded-lg overflow-hidden bg-white"
                >
                  {/* Header de categoría */}
                  <div className="flex items-center justify-between p-4 bg-slate-50">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <h4 className="font-semibold text-slate-800">{category.title}</h4>
                        {!category.active && (
                          <span className="text-xs px-2 py-1 bg-slate-300 text-slate-700 rounded">
                            Inactiva
                          </span>
                        )}
                      </div>
                      {category.description && (
                        <p className="text-sm text-slate-600 mt-1">{category.description}</p>
                      )}
                      <p className="text-xs text-slate-500 mt-1">
                        {category.items?.length || 0} item{category.items?.length !== 1 ? 's' : ''}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => toggleCategoryExpansion(index)}
                        className="text-slate-600 hover:text-slate-800 transition-colors p-1"
                      >
                        {expandedCategories.has(index) ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                      </button>
                      <button
                        onClick={() => handleRemoveCategory(index)}
                        className="text-red-500 hover:text-red-700 transition-colors p-1"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>

                  {/* Items de la categoría (expandible) */}
                  {expandedCategories.has(index) && category.items && category.items.length > 0 && (
                    <div className="p-4 space-y-2 border-t border-slate-200">
                      {category.items.map((item, itemIndex) => (
                        <div
                          key={itemIndex}
                          className="p-3 bg-slate-50 rounded-lg border border-slate-200"
                        >
                          <p className="font-medium text-slate-800">{item.title}</p>
                          {item.description && (
                            <p className="text-sm text-slate-600 mt-1">{item.description}</p>
                          )}
                          <div className="flex justify-between items-center mt-2">
                            <p className="text-sm font-semibold text-orange-600">
                              ${item.price.toFixed(2)}
                            </p>
                            {item.images && item.images.length > 0 && (
                              <p className="text-xs text-slate-500">
                                {item.images.length} imagen{item.images.length !== 1 ? 'es' : ''}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default CategoryEditor;
