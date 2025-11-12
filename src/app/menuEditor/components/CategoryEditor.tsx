"use client";

import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import {
  Plus,
  Trash2,
  GripVertical,
  Pencil,
  ChevronDown,
  ChevronUp,
  Utensils,
  Upload,
  X,
} from "lucide-react";
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@/common/components/ui/collapsible";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/common/components/ui/dialog";
import { Input } from "@/common/components/ui/input";
import { Button } from "@/common/components/ui/button";
import { Card, CardHeader, CardContent } from "@/common/components/ui/card";
import { motion } from "framer-motion";
import {
  Categories,
  newCategory,
  EditedCategory,
  newItem,
  Items,
} from "@/interfaces/menu";
import { cn } from "@/common/utils/utils";
import { Label } from "@/common/components/ui/label";
import { Spinner } from "@/common/components/ui/spinner";

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
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [newCategories, setNewCategories] = useState<newCategory[]>([]);
  const [localTitles, setLocalTitles] = useState<{ [key: number]: string }>({});
  const [localItems, setLocalItems] = useState<{ [key: number]: Items[] }>({});
  const [editingItem, setEditingItem] = useState<{
    categoryId: number;
    item: Items | newItem | null;
  }>({ categoryId: 0, item: null });
  const [loadingBackground, setLoadingBackground] = useState(false);

  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const editDebounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const pendingNewCategoriesRef = useRef<newCategory[] | null>(null);
  const pendingEditCategoryRef = useRef<EditedCategory | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (file) {
    setLoadingBackground(true);  // Activar el spinner cuando se comienza a cargar la imagen
    const reader = new FileReader();
    reader.onloadend = () => {
      const imageUrl = reader.result as string;
      saveItemEdit("images", imageUrl);
      setLoadingBackground(false);  // Desactivar el spinner una vez la imagen esté cargada
    };
    reader.readAsDataURL(file);
  }
};

  const validatePrice = (price: string): boolean => {
    if (!price) return true;
    const priceRegex = /^\d+(\.\d{0,2})?$/;
    return priceRegex.test(price);
  };

  const validateImageUrl = (url: string): boolean => {
    if (!url) return true;
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  useEffect(() => {
    const titles: { [key: number]: string } = {};
    const items: { [key: number]: Items[] } = {};

    categories.forEach((cat) => {
      titles[cat.id] = cat.title;
      items[cat.id] = cat.items || [];
    });

    setLocalTitles(titles);
    setLocalItems(items);
  }, [categories]);

  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
        if (pendingNewCategoriesRef.current) {
          onCategoriesChange(pendingNewCategoriesRef.current);
        }
      }
      if (editDebounceTimerRef.current) {
        clearTimeout(editDebounceTimerRef.current);
        if (pendingEditCategoryRef.current) {
          onEditCategory(pendingEditCategoryRef.current);
        }
      }
    };
  }, [onCategoriesChange, onEditCategory]);

  const visibleCategories = useMemo(
    () => categories.filter((cat) => !categoriesToDelete.includes(cat.id)),
    [categories, categoriesToDelete]
  );

  const allCategories = useMemo(
    () => [
      ...visibleCategories.map((cat) => ({
        ...cat,
        title: localTitles[cat.id] ?? cat.title,
        items: localItems[cat.id] ?? cat.items,
      })),
      ...newCategories,
    ],
    [visibleCategories, localTitles, localItems, newCategories]
  );

  const notifyNewCategoriesAdd = useCallback((updatedCategories: newCategory[]) => {
    pendingNewCategoriesRef.current = updatedCategories;
    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    debounceTimerRef.current = setTimeout(() => {
      onCategoriesChange(updatedCategories);
      pendingNewCategoriesRef.current = null;
    }, 500);
  }, [onCategoriesChange]);

  const notifyEditedCategory = useCallback((editedCategory: EditedCategory) => {
    pendingEditCategoryRef.current = editedCategory;
    if (editDebounceTimerRef.current) clearTimeout(editDebounceTimerRef.current);
    editDebounceTimerRef.current = setTimeout(() => {
      onEditCategory(editedCategory);
      pendingEditCategoryRef.current = null;
    }, 500);
  }, [onEditCategory]);

  // Ordenamiento para categorías: nuevas primero
  const sortCategoriesByNewFirst = <T extends { id?: number; tempId?: number; title?: string }>(
    a: T,
    b: T
  ) => {
    const isANew = !a.id && "tempId" in a;
    const isBNew = !b.id && "tempId" in b;

    if (isANew && isBNew) {
      return (b.tempId ?? 0) - (a.tempId ?? 0);
    }

    if (isANew) return -1;
    if (isBNew) return 1;

    const titleA = a.title?.toLowerCase() || "";
    const titleB = b.title?.toLowerCase() || "";
    return titleA.localeCompare(titleB);
  };

  // Ordenamiento para items/platos: mantener orden de inserción (sin ordenar)
  const sortItemsByInsertionOrder = <T extends { id?: number; tempId?: number }>(
    a: T,
    b: T
  ) => {
    // Los items con id (de BD) van primero, ordenados por id
    // Los items con tempId (nuevos) van después, ordenados por tempId
    const hasAId = !!a.id;
    const hasBId = !!b.id;

    if (hasAId && hasBId) {
      return (a.id ?? 0) - (b.id ?? 0);
    }

    if (hasAId && !hasBId) return -1;
    if (!hasAId && hasBId) return 1;

    // Ambos son nuevos: ordenar por tempId (el más antiguo primero)
    return (a.tempId ?? 0) - (b.tempId ?? 0);
  };

  const createCategory = () => {
    const newCat: newCategory = {
      tempId: Date.now(),
      title: "",
      menuId: 1,
      items: [],
    };
    const updated = [newCat, ...newCategories];
    setNewCategories(updated);
    notifyNewCategoriesAdd(updated);
  };

  const updateCategoryTitle = (categoryKey: number, newTitle: string) => {
    const isNew = newCategories.some((cat) => cat.tempId === categoryKey);

    if (isNew) {
      const updated = newCategories.map((cat) =>
        cat.tempId === categoryKey ? { ...cat, title: newTitle } : cat
      );
      setNewCategories(updated);
      notifyNewCategoriesAdd(updated);
    } else {
      setLocalTitles((prev) => ({ ...prev, [categoryKey]: newTitle }));
      notifyEditedCategory({ id: categoryKey, title: newTitle });
    }
  };

  const deleteCategory = (categoryKey: number) => {
    const isNew = newCategories.some((cat) => cat.tempId === categoryKey);

    if (isNew) {
      const updated = newCategories.filter((cat) => cat.tempId !== categoryKey);
      setNewCategories(updated);
      notifyNewCategoriesAdd(updated);
    } else {
      onDeleteCategory(categoryKey);
    }
  };

  const addItem = (categoryKey: number) => {
    const newItemObj: Items = {
      tempId: Date.now(),
      title: "",
      description: "",
      price: "",
      images: [],
    };

    const isNew = newCategories.some((cat) => cat.tempId === categoryKey);

    if (isNew) {
      const updated = newCategories.map((cat) =>
        cat.tempId === categoryKey
          ? { ...cat, items: [...(cat.items || []), newItemObj] }
          : cat
      );
      setNewCategories(updated);
      notifyNewCategoriesAdd(updated);
    } else {
      const updatedItems = [...(localItems[categoryKey] || []), newItemObj];
      setLocalItems((prev) => ({ ...prev, [categoryKey]: updatedItems }));
      notifyEditedCategory({
        id: categoryKey,
        title: localTitles[categoryKey],
        items: updatedItems,
      });
    }
  };

  const deleteItem = (categoryKey: number, itemKey: number) => {
    const isNew = newCategories.some((cat) => cat.tempId === categoryKey);

    if (isNew) {
      const updated = newCategories.map((cat) =>
        cat.tempId === categoryKey
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
      const updatedItems = (localItems[categoryKey] || []).filter(
        (item) => item.id !== itemKey && item.tempId !== itemKey
      );
      setLocalItems((prev) => ({ ...prev, [categoryKey]: updatedItems }));
      notifyEditedCategory({
        id: categoryKey,
        title: localTitles[categoryKey],
        items: updatedItems,
      });
    }
  };

  const handleItemEdit = (categoryId: number, item: Items | newItem) => {
    setEditingItem({ categoryId, item: { ...item } });
  };

  const saveItemEdit = (field: keyof Items, value: string) => {
    if (!editingItem.item) return;

    if (field === "price" && value && !validatePrice(value)) {
      return;
    }

    if (field === "images") {
      const existingImages = editingItem.item.images || [];
      const updatedItem = {
        ...editingItem.item,
        images: value
          ? existingImages.length > 0
            ? [{ url: value }, ...existingImages.slice(1)]
            : [{ url: value }]
          : [],
      };
      setEditingItem((prev) => ({ ...prev, item: updatedItem }));
    } else {
      const updatedItem = { ...editingItem.item, [field]: value };
      setEditingItem((prev) => ({ ...prev, item: updatedItem }));
    }
  };

  // ✅ CORRECCIÓN PRINCIPAL: confirmItemEdit ahora guarda correctamente
  const confirmItemEdit = () => {
    if (!editingItem.item) return;

    const { categoryId, item } = editingItem;
    const itemKey = item.id ?? item.tempId;

    // Validación final
    if (!item.title?.trim()) {
      alert("El título del plato es obligatorio");
      return;
    }

    if (item.price && !validatePrice(item.price)) {
      alert("El precio debe ser un número válido");
      return;
    }

    if (item.images?.[0]?.url && !validateImageUrl(item.images[0].url)) {
      alert("La URL de la imagen no es válida");
      return;
    }

    const isNew = newCategories.some((cat) => cat.tempId === categoryId);

    if (isNew) {
      // Actualizar en newCategories
      const updated = newCategories.map((cat) => {
        if (cat.tempId === categoryId) {
          const updatedItems = (cat.items || []).map((existingItem) =>
            (existingItem.id === itemKey || existingItem.tempId === itemKey)
              ? { ...existingItem, ...item }
              : existingItem
          );
          return { ...cat, items: updatedItems };
        }
        return cat;
      });
      setNewCategories(updated);
      notifyNewCategoriesAdd(updated);
    } else {
      // Actualizar en localItems
      const updatedItems = (localItems[categoryId] || []).map((existingItem) =>
        (existingItem.id === itemKey || existingItem.tempId === itemKey)
          ? { ...existingItem, ...item }
          : existingItem
      );
      
      setLocalItems((prev) => ({ ...prev, [categoryId]: updatedItems }));
      
      notifyEditedCategory({
        id: categoryId,
        title: localTitles[categoryId],
        items: updatedItems,
      });
    }

    // Cerrar modal
    setEditingItem({ categoryId: 0, item: null });
  };

  return (
    <Card className="bg-gradient-to-b from-white/80 to-white/60 backdrop-blur-xl border border-white/30 rounded-3xl p-5 shadow-md">
      <CardHeader className="flex justify-between items-center mb-2">
        <h3 className="font-semibold text-slate-800 text-lg">Categorías y Platos</h3>
        <Button
          onClick={createCategory}
          className="bg-gradient-to-br from-orange-400 to-orange-500 text-white rounded-xl"
        >
          <Plus className="w-4 h-4" />
          Nueva Categoría
        </Button>
      </CardHeader>

      <CardContent className="space-y-4">
        {[...allCategories].sort(sortCategoriesByNewFirst).map((category) => (
          <Collapsible
            key={category.id ?? category.tempId}
            open={expandedCategory === String(category.id ?? category.tempId)}
            onOpenChange={() =>
              setExpandedCategory(
                expandedCategory === String(category.id ?? category.tempId)
                  ? null
                  : String(category.id ?? category.tempId)
              )
            }
          >
            <motion.div
              layout
              className="border border-slate-200 rounded-2xl p-3 bg-white/80 shadow-sm"
            >
              <div className="flex justify-between items-center">
                <input
                  type="text"
                  value={category.title}
                  onChange={(e) =>
                    updateCategoryTitle(category.id ?? category.tempId, e.target.value)
                  }
                  placeholder="Ej: Entradas, Postres..."
                  className="font-medium text-slate-800 bg-transparent border-none focus:ring-0 text-base flex-1"
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => deleteCategory(category.id ?? category.tempId)}
                    className="text-red-500 hover:bg-red-100 p-2 rounded-md"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <CollapsibleTrigger asChild>
                    <button
                      className={cn(
                        "p-2 rounded-lg transition-all duration-200",
                        expandedCategory === String(category.id ?? category.tempId)
                          ? "bg-orange-50 text-orange-500 shadow-sm"
                          : "text-slate-500 hover:bg-slate-100"
                      )}
                    >
                      {expandedCategory === String(category.id ?? category.tempId) ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </button>
                  </CollapsibleTrigger>
                </div>
              </div>
            </motion.div>

            <CollapsibleContent>
              <div className="mt-3 space-y-3">
                {[...(category.items || [])].sort(sortItemsByInsertionOrder).map((item) => (
                  <motion.div
                    key={item.id ?? item.tempId}
                    layout
                    className="flex justify-between items-center bg-white border border-slate-200 rounded-xl p-3"
                  >
                    <div className="flex items-center gap-3 overflow-hidden">
                      {item.images && item.images.length > 0 ? (
                        <img
                          src={item.images[0].url}
                          alt={item.title}
                          className="w-12 h-12 rounded-lg object-cover border border-slate-200"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-lg bg-slate-100 flex items-center justify-center">
                          <Utensils className="w-5 h-5 text-slate-400" />
                        </div>
                      )}

                      <p className="font-medium text-slate-700 text-sm truncate max-w-[120px]">
                        {item.title || "Nuevo plato"}
                      </p>
                      {item.price && (
                        <p className="text-slate-500 text-xs">${item.price}</p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-orange-500 hover:text-orange-600"
                        onClick={() => handleItemEdit(category.id ?? category.tempId, item)}
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-red-500 hover:text-red-600"
                        onClick={() =>
                          deleteItem(category.id ?? category.tempId, item.id ?? item.tempId)
                        }
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </motion.div>
                ))}

                <div className="pt-4 mt-4 border-t border-slate-300">
                  <Button
                    onClick={() => addItem(category.id ?? category.tempId)}
                    variant="outline"
                    className="w-full border-dashed border-slate-300 text-slate-500 hover:border-orange-400 hover:text-orange-500 rounded-xl py-5"
                  >
                    <Plus className="w-4 h-4 mr-2" /> Agregar plato
                  </Button>
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>
        ))}
      </CardContent>

      <Dialog
        open={!!editingItem.item}
        onOpenChange={(open) =>
          setEditingItem({
            categoryId: 0,
            item: open ? editingItem.item : null,
          })
        }
      >
        <DialogContent className="rounded-2xl max-w-md bg-white/90 backdrop-blur-xl border border-white/30">
        <DialogClose className="absolute right-4 top-4 rounded-full p-2 hover:bg-white/70 transition-colors z-50">
          <X className="h-5 w-5 text-orange-400" />
        </DialogClose>
          <DialogHeader>
            <DialogTitle className="text-slate-800 text-lg font-semibold">Editar plato</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-3">
            <div>
              <Input
                placeholder="Título del plato *"
                value={editingItem.item?.title || ""}
                onChange={(e) => saveItemEdit("title", e.target.value)}
                className="text-black"
              />
              {editingItem.item?.title === "" && (
                <p className="text-xs text-red-500 mt-1">El título es obligatorio</p>
              )}
            </div>
            <Input
              placeholder="Descripción"
              value={editingItem.item?.description || ""}
              onChange={(e) => saveItemEdit("description", e.target.value)}
              className="text-black"
            />
            <div>
              <Input
                placeholder="Precio (ej: 12.50)"
                value={editingItem.item?.price || ""}
                onChange={(e) => saveItemEdit("price", e.target.value)}
                className="text-black"
              />
              {editingItem.item?.price && !validatePrice(editingItem.item.price) && (
                <p className="text-xs text-red-500 mt-1">
                  Use solo números y hasta 2 decimales
                </p>
              )}
            </div>

            <div className="relative w-full h-full group">
              <Input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="mt-4 hidden"
                id="image-upload-input"
              />

              <Label
                htmlFor="image-upload-input"
                className={`w-full h-64 rounded-2xl overflow-hidden 
    ${
      editingItem.item?.images?.[0]?.url
        ? "border-0"
        : "border-2 border-dashed border-slate-300"
    }
    bg-slate-50 flex items-center justify-center cursor-pointer hover:border-orange-500 transition-all`}
              >
                {/* Mostrar la imagen si existe */}
                {editingItem.item?.images?.[0]?.url ? (
                  <>
                    <img
                      src={editingItem.item?.images[0]?.url || ""}
                      alt="Preview"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.currentTarget;
                        target.style.display = "none";
                        const nextEl = target.nextElementSibling as HTMLElement;
                        if (nextEl) nextEl.classList.remove("hidden");
                      }}
                    />
                  </>
                ) : (
                  // Si no hay imagen cargada
                  <div className="flex flex-col items-center">
                    {loadingBackground ? (
                      <Spinner className="w-6 h-6 text-orange-500" />
                    ) : (
                      <>
                        <Upload className="w-8 h-8 text-slate-400 mb-1" />
                        <p className="text-sm text-slate-500">
                          Carga la imagen del plato
                        </p>
                      </>
                    )}
                  </div>
                )}

                {/* Subtítulo para formatos de imagen */}
              </Label>
              {editingItem.item?.images?.[0]?.url && (
                <p className="text-base text-slate-400 mt-2">
                  Toca la imagen para cambiarla
                </p>
              )}
              <p className="text-base text-slate-400 mt-2">
                PNG, JPG hasta 10MB
              </p>
              <DialogFooter className="mt-5">
            <Button
              variant="outline"
              onClick={() => setEditingItem({ categoryId: 0, item: null })}
              className="text-black"
            >
              Cancelar
            </Button>
            <Button
              onClick={confirmItemEdit}
              className="bg-gradient-to-br from-orange-400 to-orange-500 text-white"
            >
              Guardar cambios
            </Button>
          </DialogFooter>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default CategoryEditor;

{/*<div className="relative w-full h-full group">
              <Input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="mt-4 hidden"
                id="image-upload-input"
              />

              <Label
                htmlFor="image-upload-input"
                className={`w-full h-64 rounded-2xl overflow-hidden 
    ${
      editingItem.item?.images?.[0]?.url
        ? "border-0"
        : "border-2 border-dashed border-slate-300"
    }
    bg-slate-50 flex items-center justify-center cursor-pointer hover:border-orange-500 transition-all`}
              >
                {/* Mostrar la imagen si existe 
                {editingItem.item?.images?.[0]?.url ? (
                  <>
                    <img
                      src={editingItem.item?.images[0]?.url || ""}
                      alt="Preview"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.currentTarget;
                        target.style.display = "none";
                        const nextEl = target.nextElementSibling as HTMLElement;
                        if (nextEl) nextEl.classList.remove("hidden");
                      }}
                    />
                  </>
                ) : (
                  // Si no hay imagen cargada
                  <div className="flex flex-col items-center">
                    {loadingBackground ? (
                      <Spinner className="w-6 h-6 text-orange-500" />
                    ) : (
                      <>
                        <Upload className="w-8 h-8 text-slate-400 mb-1" />
                        <p className="text-sm text-slate-500">
                          Carga la imagen del plato
                        </p>
                      </>
                    )}
                  </div>
                )}

                {/* Subtítulo para formatos de imagen 
              </Label>
              {editingItem.item?.images?.[0]?.url && (
                <p className="text-base text-slate-400 mt-2">
                  Toca la imagen para cambiarla
                </p>
              )}
              <p className="text-base text-slate-400 mt-2">
                PNG, JPG hasta 10MB
              </p>
            </div>*/}