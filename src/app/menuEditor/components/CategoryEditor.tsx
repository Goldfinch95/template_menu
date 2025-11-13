"use client";

import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
} from "react";
import {
  Plus,
  Trash2,
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
import Image from "next/image";

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
  //  Estados //
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [newCategories, setNewCategories] = useState<newCategory[]>([]);
  const [localTitles, setLocalTitles] = useState<{ [key: number]: string }>({});
  const [localItems, setLocalItems] = useState<{ [key: number]: Items[] }>({});
  const [editingItem, setEditingItem] = useState<{
    categoryId: number;
    item: Items | newItem | null;
  }>({ categoryId: 0, item: null });
  const [loadingBackground, setLoadingBackground] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // referencias
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const editDebounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const pendingNewCategoriesRef = useRef<newCategory[] | null>(null);
  const pendingEditCategoryRef = useRef<EditedCategory | null>(null);

  // 🔥 Cargar preview cuando se abre el modal de edición
  useEffect(() => {
    if (editingItem.item) {
      const firstImage = editingItem.item.images?.[0];
      if (firstImage) {
        // Si es un File, crear preview
        if (firstImage instanceof File) {
          const reader = new FileReader();
          reader.onloadend = () => {
            setImagePreview(reader.result as string);
          };
          reader.readAsDataURL(firstImage);
        }
        // Si es un objeto con url
        else if (typeof firstImage === "object" && "url" in firstImage) {
          setImagePreview(firstImage.url);
        }
      } else {
        setImagePreview(null);
      }
    } else {
      setImagePreview(null);
    }
  }, [editingItem.item]);

  // al subir una imagen del plato, guardarlo.
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    console.log("📸 Imagen seleccionada:", file);
    console.log("Es un File:", file instanceof File);
    if (!file) return;

    // Validar tamaño (10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert("La imagen debe ser menor a 10MB");
      return;
    }
    // Validar tipo
    const validTypes = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
    if (!validTypes.includes(file.type)) {
      alert("Solo se permiten imágenes JPG, PNG o WebP");
      return;
    }
    setLoadingBackground(true);

    // Crear preview para mostrar en UI (solo para visualización)
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
      setLoadingBackground(false);
    };
    reader.readAsDataURL(file);

    saveItemEdit("images", file);
  };

  //validacion del precio
  const validatePrice = (price: string): boolean => {
    if (!price) return true;
    const priceRegex = /^\d+(\.\d{0,2})?$/;
    return priceRegex.test(price);
  };

  //Actualiza los títulos y platos de las categorías cada vez que cambian las categorías.
  useEffect(() => {
    if (!categories || categories.length === 0) {
      return;
    }

    const titles: { [key: number]: string } = {};
    const items: { [key: number]: Items[] } = {};

    categories.forEach((cat) => {
      titles[cat.id] = cat.title;
      items[cat.id] = cat.items || [];
    });

    setLocalTitles(titles);
    setLocalItems(items);
  }, [categories]);

  //los cambios se guarden de forma "debounced" para evitar llamadas innecesarias al servidor.
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

  // Filtra las categorías que no deben ser eliminadas.
  const visibleCategories = useMemo(
    () => categories.filter((cat) => !categoriesToDelete.includes(cat.id)),
    [categories, categoriesToDelete]
  );

  //Combina las categorías existentes con las nuevas, ordenándolas.
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

  // avisar al padre de las NUEVAS categorias creadas.
  const notifyNewCategoriesAdd = useCallback(
    (updatedCategories: newCategory[]) => {
      console.log(
        "📤 Notificando nuevas categorías al padre:",
        updatedCategories
      );
      updatedCategories.forEach((cat) => {
        cat.items?.forEach((item, i) => {
          console.log(
            `🧾 Nueva categoría ${cat.tempId || cat.id} → Item[${i}] imágenes:`,
            item.images
          );
          if (item.images?.[0]) {
            console.log(
              "Tipo de imagen:",
              item.images[0] instanceof File ? "File" : typeof item.images[0]
            );
          }
        });
      });
      pendingNewCategoriesRef.current = updatedCategories;
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = setTimeout(() => {
        onCategoriesChange(updatedCategories);
        pendingNewCategoriesRef.current = null;
      }, 500);
    },
    [onCategoriesChange]
  );

  // avisar al padre de las categorias EDITADAS
  const notifyEditedCategory = useCallback(
    (editedCategory: EditedCategory) => {
      console.log("📤 Notificando edición al padre:", editedCategory);
      if (editedCategory.items) {
        editedCategory.items.forEach((item, i) => {
          console.log(`🧾 Item[${i}] imágenes:`, item.images);
          if (item.images?.[0]) {
            console.log(
              "Tipo de imagen:",
              item.images[0] instanceof File ? "File" : typeof item.images[0]
            );
          }
        });
      }
      pendingEditCategoryRef.current = editedCategory;
      if (editDebounceTimerRef.current)
        clearTimeout(editDebounceTimerRef.current);
      editDebounceTimerRef.current = setTimeout(() => {
        onEditCategory(editedCategory);
        pendingEditCategoryRef.current = null;
      }, 500);
    },
    [onEditCategory]
  );

  // Ordenamiento para categorías: nuevas primero
  const sortCategoriesByNewFirst = <
    T extends { id?: number; tempId?: number; title?: string }
  >(
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
  const sortItemsByInsertionOrder = <
    T extends { id?: number; tempId?: number }
  >(
    a: T,
    b: T
  ) => {
    const hasAId = !!a.id;
    const hasBId = !!b.id;

    if (hasAId && hasBId) {
      return (a.id ?? 0) - (b.id ?? 0);
    }

    if (hasAId && !hasBId) return -1;
    if (!hasAId && hasBId) return 1;

    return (a.tempId ?? 0) - (b.tempId ?? 0);
  };

  // crear NUEVA categoria y notificar al padre
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

  // EDITAR categoria y notificar al padre.
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

  //ELIMINAR categoria y notificar al padre.
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

  // crear NUEVO plato y notificar al padre.
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

  // borrar plato y notificar al padre.
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

  //editar el plato en el modal
  const handleItemEdit = (categoryId: number, item: Items | newItem) => {
    setEditingItem({ categoryId, item: { ...item } });
  };

  // guardar el plato editado en el modal
  const saveItemEdit = (field: keyof Items, value: string | File) => {
    if (!editingItem.item) return;

    if (
      field === "price" &&
      typeof value === "string" &&
      value &&
      !validatePrice(value)
    ) {
      return;
    }

    if (field === "images") {
      console.log("💾 Guardando imagen en item:", value);
      console.log("Es un File:", value instanceof File);
      const updatedItem = {
        ...editingItem.item,
        images: [value as File],
      };
      setEditingItem((prev) => ({ ...prev, item: updatedItem }));
    } else {
      const updatedItem = { ...editingItem.item, [field]: value };
      setEditingItem((prev) => ({ ...prev, item: updatedItem }));
    }
  };

  // confirmar los cambios del plato en el modal
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

    const isNew = newCategories.some((cat) => cat.tempId === categoryId);

    if (isNew) {
      // Actualizar en newCategories
      const updated = newCategories.map((cat) => {
        if (cat.tempId === categoryId) {
          const updatedItems = (cat.items || []).map((existingItem) =>
            existingItem.id === itemKey || existingItem.tempId === itemKey
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
        existingItem.id === itemKey || existingItem.tempId === itemKey
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

  // 🔥 Helper para obtener URL de preview (File o url string)
  const getImagePreviewUrl = (
    image: File | { url: string } | undefined
  ): string | null => {
    if (!image) return null;

    // Si es un File, necesitamos crear un ObjectURL
    if (image instanceof File) {
      return URL.createObjectURL(image);
    }

    // Si es un objeto con url (imagen de BD)
    if (typeof image === "object" && "url" in image) {
      return image.url;
    }

    return null;
  };

  return (
    <Card className="bg-gradient-to-b from-white/80 to-white/60 backdrop-blur-xl border border-white/30 rounded-3xl p-5 shadow-md">
      <CardHeader className="flex justify-between items-center mb-2">
        <h3 className="font-semibold text-slate-800 text-lg">
          Categorías y Platos
        </h3>
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
                    updateCategoryTitle(
                      category.id ?? category.tempId,
                      e.target.value
                    )
                  }
                  placeholder="Ej: Entradas, Postres..."
                  className="font-medium text-slate-800 bg-transparent border-none focus:ring-0 text-base flex-1"
                />
                <div className="flex gap-2">
                  <button
                    onClick={() =>
                      deleteCategory(category.id ?? category.tempId)
                    }
                    className="text-red-500 hover:bg-red-100 p-2 rounded-md"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <CollapsibleTrigger asChild>
                    <button
                      className={cn(
                        "p-2 rounded-lg transition-all duration-200",
                        expandedCategory ===
                          String(category.id ?? category.tempId)
                          ? "bg-orange-50 text-orange-500 shadow-sm"
                          : "text-slate-500 hover:bg-slate-100"
                      )}
                    >
                      {expandedCategory ===
                      String(category.id ?? category.tempId) ? (
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
                {[...(category.items || [])]
                  .sort(sortItemsByInsertionOrder)
                  .map((item) => {
                    // 🔥 Obtener preview URL correctamente
                    const previewUrl = getImagePreviewUrl(item.images?.[0]);

                    return (
                      <motion.div
                        key={item.id ?? item.tempId}
                        layout
                        className="flex justify-between items-center bg-white border border-slate-200 rounded-xl p-3"
                      >
                        <div className="flex items-center gap-3 overflow-hidden">
                          {previewUrl ? (
                            <Image
                              src={previewUrl}
                              alt={item.title}
                              width={48}
                              height={48}
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
                            <p className="text-slate-500 text-xs">
                              ${item.price}
                            </p>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-orange-500 hover:text-orange-600"
                            onClick={() =>
                              handleItemEdit(
                                category.id ?? category.tempId,
                                item
                              )
                            }
                          >
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-red-500 hover:text-red-600"
                            onClick={() =>
                              deleteItem(
                                category.id ?? category.tempId,
                                item.id ?? item.tempId
                              )
                            }
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </motion.div>
                    );
                  })}

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
            <DialogTitle className="text-slate-800 text-lg font-semibold">
              Editar plato
            </DialogTitle>
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
                <p className="text-xs text-red-500 mt-1">
                  El título es obligatorio
                </p>
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
                placeholder="Precio (ej: 1200.00)"
                value={editingItem.item?.price || ""}
                onChange={(e) => saveItemEdit("price", e.target.value)}
                className="text-black"
              />
              {editingItem.item?.price &&
                !validatePrice(editingItem.item.price) && (
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
                    imagePreview
                      ? "border-0"
                      : "border-2 border-dashed border-slate-300"
                  }
                  bg-slate-50 flex items-center justify-center cursor-pointer hover:border-orange-500 transition-all`}
              >
                {imagePreview ? (
                  <Image
                    src={imagePreview}
                    alt="Preview"
                    width={400}
                    height={256}
                    className="w-full h-full object-cover"
                  />
                ) : (
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
              </Label>
              {imagePreview && (
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
