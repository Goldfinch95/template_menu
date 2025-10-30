"use client"

import React, { useState } from "react";
import { Card } from "@/common/components/ui/card";
import { Category } from "@/interfaces/menu";
import { ChevronDown, ChevronUp, Image as ImageIcon } from "lucide-react";

interface ExistingCategoriesViewProps {
  categories: Category[];
}

const ExistingCategoriesView = ({ categories }: ExistingCategoriesViewProps) => {
  const [expandedCategories, setExpandedCategories] = useState<Set<number>>(new Set());

  const toggleCategoryExpansion = (categoryId: number) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
    }
    setExpandedCategories(newExpanded);
  };

  if (categories.length === 0) {
    return null;
  }

  return (
    <Card className="bg-white/70 backdrop-blur-xl border border-white/40 rounded-2xl p-6 shadow-lg">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-slate-800 text-lg">
            Categorías Existentes
          </h3>
          <span className="text-sm text-slate-600 bg-slate-100 px-3 py-1 rounded-full">
            {categories.length} categoría{categories.length !== 1 ? 's' : ''}
          </span>
        </div>

        <div className="space-y-3">
          {categories.map((category) => (
            <div
              key={category.id}
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
                  <p className="text-xs text-slate-500 mt-1">
                    {category.items?.length || 0} item{category.items?.length !== 1 ? 's' : ''}
                  </p>
                </div>
                <button
                  onClick={() => toggleCategoryExpansion(category.id)}
                  className="text-slate-600 hover:text-slate-800 transition-colors p-1"
                >
                  {expandedCategories.has(category.id) ? (
                    <ChevronUp size={20} />
                  ) : (
                    <ChevronDown size={20} />
                  )}
                </button>
              </div>

              {/* Items de la categoría (expandible) */}
              {expandedCategories.has(category.id) && category.items && category.items.length > 0 && (
                <div className="p-4 space-y-3 border-t border-slate-200">
                  {category.items.map((item) => (
                    <div
                      key={item.id}
                      className="p-4 bg-slate-50 rounded-lg border border-slate-200"
                    >
                      <div className="flex gap-4">
                        {/* Contenido del item */}
                        <div className="flex-1">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h5 className="font-medium text-slate-800">{item.title}</h5>
                              {!item.active && (
                                <span className="inline-block text-xs px-2 py-0.5 bg-slate-300 text-slate-700 rounded mt-1">
                                  Inactivo
                                </span>
                              )}
                            </div>
                            <p className="text-lg font-semibold text-orange-600 ml-3">
                              ${parseFloat(item.price).toFixed(2)}
                            </p>
                          </div>

                          {item.description && (
                            <p className="text-sm text-slate-600 mt-2">{item.description}</p>
                          )}

                          {item.images && item.images.length > 0 && (
                            <div className="mt-3">
                              <p className="text-xs text-slate-500 mb-2 flex items-center gap-1">
                                <ImageIcon size={14} />
                                {item.images.length} imagen{item.images.length !== 1 ? 'es' : ''}
                              </p>
                              <div className="flex gap-2 flex-wrap">
                                {item.images.map((img, imgIndex) => (
                                  <div
                                    key={img.id || imgIndex}
                                    className="relative w-16 h-16 rounded-lg overflow-hidden border border-slate-200"
                                  >
                                    <img
                                      src={img.url}
                                      alt={img.alt || item.title}
                                      className="w-full h-full object-cover"
                                      onError={(e) => {
                                        e.currentTarget.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64"><rect width="64" height="64" fill="%23e2e8f0"/><text x="50%" y="50%" font-size="10" text-anchor="middle" dy=".3em" fill="%2394a3b8">Sin img</text></svg>';
                                      }}
                                    />
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Mensaje cuando no hay items */}
              {expandedCategories.has(category.id) && (!category.items || category.items.length === 0) && (
                <div className="p-4 text-center text-slate-500 text-sm border-t border-slate-200">
                  No hay items en esta categoría
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};

export default ExistingCategoriesView;
