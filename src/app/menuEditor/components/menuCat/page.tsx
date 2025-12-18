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
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/common/components/ui/dialog";
import {
  ChevronUp,
  ChevronDown,
  Plus,
  Trash2,
  UtensilsCrossed,
  Pencil,
  GripVertical,
  Check,
} from "lucide-react";
import { Spinner } from "@/common/components/ui/spinner";
import CatDialog from "./components/CatDialog";
import ItemDialog from "./components/ItemDialog";
import { Categories, Items, UpdateCategoryPosition } from "@/interfaces/menu";
import { categoryService, itemService } from "@/app/services";
import { cn } from "@/common/utils/utils";
import { AlertTriangle, X } from "lucide-react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { toast } from "sonner";
function SortableItem({
  item,
  categoryId,
  onItemSaved,
  handleDeleteItem,
  deletingItemId,
}: {
  item: Items;
  categoryId: number;
  onItemSaved: () => Promise<void>;
  handleDeleteItem: (id: number) => Promise<void>;
  deletingItemId: number | null;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const previewUrl = item.images?.[0]?.url || null;

  return (
    <div ref={setNodeRef} style={style}>
      <div className="flex justify-between items-center bg-white border border-slate-200 rounded-xl p-3">
        {/* Drag Handle */}
        <div
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing touch-none mr-2 text-slate-400 hover:text-slate-600 transition-colors"
        >
          <GripVertical className="w-4 h-4" />
        </div>

        <div className="flex items-center gap-2 overflow-hidden flex-1">
          {previewUrl ? (
            <div
              style={{ backgroundImage: `url(${previewUrl})` }}
              className="w-12 h-12 flex-shrink-0 rounded-lg border border-slate-200 bg-center bg-cover"
            />
          ) : (
            <div className="w-12 h-12 flex-shrink-0 rounded-lg bg-slate-100 flex items-center justify-center">
              <UtensilsCrossed className="w-6 h-6 text-slate-400" />
            </div>
          )}

          <div className="flex-1 min-w-0 overflow-hidden">
            {" "}
            {/* Aseguramos que el texto no desborde */}
            <p className="font-medium text-slate-700 text-sm truncate">
              {item.title || "Nuevo plato"}
            </p>
          </div>

          {item.price && item.price > 0 && (
            <div className="w-16 flex justify-center items-center">
              <p className="text-slate-500 text-xs">
                $
                {Number.isInteger(Number(item.price))
                  ? Number(item.price)
                  : Number(item.price).toFixed(2)}
              </p>
            </div>
          )}
        </div>

        <div className="flex gap-2">
          <ItemDialog
            categoryId={categoryId}
            item={item}
            onItemSaved={onItemSaved}
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
          <Dialog>
            <DialogTrigger asChild>
              <Button
                size="sm"
                variant="ghost"
                className="text-red-500 hover:text-red-600"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </DialogTrigger>

            <DialogContent className="max-w-sm rounded-2xl p-6 shadow-xl [&>button]:hidden">
              <DialogClose className="absolute right-6 top-6 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground !flex items-center justify-center">
                <X className="h-5 w-5 text-red-600" />
              </DialogClose>

              <DialogHeader>
                <DialogTitle className="flex items-center gap-2 text-red-500">
                  <AlertTriangle className="w-5 h-5" />
                  Eliminar plato
                </DialogTitle>
              </DialogHeader>

              <DialogDescription className="text-base text-slate-600 mt-2">
                ¿Estás seguro de que deseas eliminar este plato? Esta acción no
                se puede deshacer.
              </DialogDescription>

              <DialogFooter className="flex justify-end gap-2 mt-6">
                <DialogClose asChild>
                  <Button variant="outline">Cancelar</Button>
                </DialogClose>

                <Button
                  className="bg-red-500 hover:bg-red-600 text-white"
                  onClick={() => handleDeleteItem(item.id)}
                  disabled={deletingItemId === item.id}
                >
                  {deletingItemId === item.id ? "Eliminando..." : "Eliminar"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
}

function SortableCategory({
  category,
  expandedCategoryId,
  setExpandedCategoryId,
  categoryTitles,
  handleTitleChange,
  handleEditSave,
  handleDelete,
  handleDeleteItem,
  deletingItemId,
  onCategoryChange,
  sensors,
  handleItemDragEnd,
}: {
  category: Categories;
  expandedCategoryId: number | null;
  setExpandedCategoryId: (id: number | null) => void;
  categoryTitles: Record<number, string>;
  handleTitleChange: (id: number, title: string) => void;
  handleEditSave: (id: number) => Promise<void>;
  savingId: number | null;
  handleDelete: (id: number) => Promise<void>;
  handleDeleteItem: (id: number) => Promise<void>;
  deletingItemId: number | null;
  onCategoryChange: () => Promise<void>;
  sensors: ReturnType<typeof useSensors>;
  handleItemDragEnd: (
    event: DragEndEvent,
    categoryId: number,
    items: Items[],
    setLocalItems: (items: Items[]) => void
  ) => Promise<void>;
}) {
  // Estado local para los items de esta categoría
  const [localItems, setLocalItems] = useState<Items[]>(category.items || []);
  const [isFocused, setIsFocused] = useState(false);
  // Sincronizar cuando cambien los items de la categoría
  useEffect(() => {
    setLocalItems(category.items || []);
  }, [category.items]);

  const currentTitle = categoryTitles[category.id] ?? category.title;
  const hasChanged = currentTitle !== category.title;
  const showPlayButton = isFocused && currentTitle.length > 3 && currentTitle.length < 41 && hasChanged;

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: category.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style}>
      <Collapsible
        open={expandedCategoryId === category.id}
        onOpenChange={() =>
          setExpandedCategoryId(
            expandedCategoryId === category.id ? null : category.id
          )
        }
      >
        <div className="flex items-center justify-between p-3 bg-white border border-slate-100 rounded-lg shadow-sm">
          {/* Drag Handle */}
          <div
            {...attributes}
            {...listeners}
            className="cursor-grab active:cursor-grabbing touch-none mr-2 text-slate-400 hover:text-slate-600 transition-colors"
          >
            <GripVertical className="w-5 h-5" />
          </div>

          {/* INPUT EDITABLE */}
          <input
            type="text"
            value={categoryTitles[category.id] ?? category.title}
            onChange={(e) => handleTitleChange(category.id, e.target.value)}
            onFocus={() => setIsFocused(true)} // ← NUEVO
            onBlur={() => {
              setIsFocused(false);
              // Si hay cambios no guardados, revertir al valor original
              if (hasChanged) {
                // ← NUEVA lógica
                handleTitleChange(category.id, category.title); // ← Revierte al original
              }
            }} // ← NUEVO
            className="flex-1 min-w-0 p-1 font-semibold text-slate-700 bg-transparent border-b border-transparent  focus:outline-none transition-colors truncate"
          />

          {/* BOTONES DE ACCIÓN */}
          <div className="flex space-x-2">
            {/* Botón Eliminar */}
            <Dialog>
              {showPlayButton && (
                <motion.div
                  initial={{ opacity: 0.0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0.0 }}
                  transition={{
                    duration: 0.4,
                    ease: [0.4, 0.0, 0.2, 1], // material / iOS-like
                  }}
                >
                  <Button
                    variant="ghost"
                    size="icon"
                    className=" h-8 w-8
          text-emerald-600
          hover:bg-emerald-50
          hover:scale-105
          transition"
                    onMouseDown={(e) => {
                      e.preventDefault();
                      handleEditSave(category.id);
                    }}
                  >
                    <Check className="h-4 w-4" />
                  </Button>
                </motion.div>
              )}
              <DialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-red-500 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </DialogTrigger>

              <DialogContent className="max-w-sm rounded-2xl p-6 shadow-xl [&>button]:hidden">
                <DialogClose className="absolute right-6 top-6 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground !flex items-center justify-center">
                  <X className="h-5 w-5 text-red-600" />
                </DialogClose>

                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2 text-red-600">
                    <AlertTriangle className="w-5 h-5" />
                    Eliminar categoria
                  </DialogTitle>
                </DialogHeader>
                <DialogDescription className="text-base text-slate-600 mt-2">
                  ¿Estás seguro de que deseas eliminar esta categoría? Los
                  platos dentro de ella también se eliminarán.
                </DialogDescription>
                <DialogFooter className="flex justify-end gap-2 mt-6">
                  <DialogClose asChild>
                    <Button variant="outline">Cancelar</Button>
                  </DialogClose>

                  <Button
                    className="bg-red-600 hover:bg-red-700 text-white"
                    onClick={() => handleDelete(category.id)}
                  >
                    Eliminar
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {/* Botón de Plegar/Desplegar */}
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

        {/* CONTENIDO DESPLEGABLE */}
        <CollapsibleContent>
          <div className="mt-3 space-y-3">
            {localItems && localItems.length > 0 ? (
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={(event) =>
                  handleItemDragEnd(
                    event,
                    category.id,
                    localItems,
                    setLocalItems
                  )
                }
              >
                <SortableContext
                  items={localItems.map((item) => item.id)}
                  strategy={verticalListSortingStrategy}
                >
                  {localItems.map((item) => (
                    <SortableItem
                      key={item.id}
                      item={item}
                      categoryId={category.id}
                      onItemSaved={onCategoryChange}
                      handleDeleteItem={handleDeleteItem}
                      deletingItemId={deletingItemId}
                    />
                  ))}
                </SortableContext>
              </DndContext>
            ) : null}

            <div className="pt-4 mt-4 border-t border-slate-300">
              <ItemDialog
                categoryId={category.id}
                onItemSaved={onCategoryChange}
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
    </div>
  );
}

interface CatEditorProps {
  menuId: number;
  menuCategories: Categories[];
  onCategoryChange: () => Promise<void>;
  onMenuCatLoaded: () => void;
}

const MenuCatPage = ({
  menuId,
  menuCategories,
  onCategoryChange,
  onMenuCatLoaded,
}: CatEditorProps) => {
  // ⚠️ MOVER TODOS LOS HOOKS ANTES DEL RETURN CONDICIONAL
  const [loading, setLoading] = useState(true);
  const [expandedCategoryId, setExpandedCategoryId] = useState<number | null>(
    null
  );
  const [categoryTitles, setCategoryTitles] = useState<Record<number, string>>(
    {}
  );
  const [categories, setCategories] = useState<Categories[]>([]);
  const [savingId, setSavingId] = useState<number | null>(null);
  const [deletingItemId, setDeletingItemId] = useState<number | null>(null);

  // Configuración de sensores para drag and drop (compartido para categorías e items)
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  

  useEffect(() => {
    const loadCategories = async () => {
      // Si menuCategories es undefined, no hacer nada
      if (!menuCategories) {
        return;
      }
      setLoading(true);
      
      setCategories(menuCategories);
      setLoading(false);
      if (onMenuCatLoaded) {
        onMenuCatLoaded();
      }
    };

    loadCategories();
  }, [menuId, menuCategories]);

  // Handler para drag and drop de CATEGORÍAS
  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = categories.findIndex((cat) => cat.id === active.id);
      const newIndex = categories.findIndex((cat) => cat.id === over.id);

      const newCategories = arrayMove(categories, oldIndex, newIndex);
      setCategories(newCategories);

      const movedCategory = categories[oldIndex];
      let newPosition: number;

      // CASO 1: Mover al principio (antes del primer item actual)
      if (newIndex === 0) {
        newPosition = Math.round(categories[0].position - 1);
      }
      // CASO 2: Mover al final (después del último item actual)
      else if (newIndex === categories.length - 1) {
        newPosition = Math.round(
          categories[categories.length - 1].position + 1
        );
      }
      // CASO 3: Mover entre dos items
      else {
        const targetCategory = categories[newIndex];

        // Si nos movemos hacia abajo (oldIndex < newIndex)
        if (oldIndex < newIndex) {
          const prevPosition = targetCategory.position;
          const nextPosition =
            categories[newIndex + 1]?.position ?? targetCategory.position + 1;
          newPosition = Math.round((prevPosition + nextPosition) / 2);
        }
        // Si nos movemos hacia arriba (oldIndex > newIndex)
        else {
          const prevPosition =
            categories[newIndex - 1]?.position ?? targetCategory.position - 1;
          const nextPosition = targetCategory.position;
          newPosition = Math.round((prevPosition + nextPosition) / 2);
        }
      }

      /*console.log(
        `📦 Moviendo categoría ${movedCategory.id} desde posición ${oldIndex} a ${newIndex} con newPosition: ${newPosition}`
      );*/

      try {
        const updateData: UpdateCategoryPosition = { newPosition };
        await categoryService.update(movedCategory.id, updateData);
        await onCategoryChange();
        // console.log(`✅ Orden de categoría actualizado correctamente`);
      } catch {
        console.error("❌ Error al actualizar el orden de categoría");
        setCategories(categories);
        alert("Error al actualizar el orden. Revisa la consola.");
      }
    }
  };

  // Handler para drag and drop de ITEMS
  const handleItemDragEnd = async (
    event: DragEndEvent,
    categoryId: number,
    items: Items[],
    setLocalItems: (items: Items[]) => void
  ) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = items.findIndex((item) => item.id === active.id);
      const newIndex = items.findIndex((item) => item.id === over.id);

      // 1. Actualizar el estado local PRIMERO con arrayMove
      const newItems = arrayMove(items, oldIndex, newIndex);
      setLocalItems(newItems);

      const movedItem = items[oldIndex];
      let newPosition: number;

      // CASO 1: Mover al principio (antes del primer item actual)
      if (newIndex === 0) {
        newPosition = Math.round(items[0].position - 1);
      }
      // CASO 2: Mover al final (después del último item actual)
      else if (newIndex === items.length - 1) {
        newPosition = Math.round(items[items.length - 1].position + 1);
      }
      // CASO 3: Mover entre dos items
      else {
        const targetItem = items[newIndex];

        // Si nos movemos hacia abajo (oldIndex < newIndex)
        if (oldIndex < newIndex) {
          const prevPosition = targetItem.position;
          const nextPosition =
            items[newIndex + 1]?.position ?? targetItem.position + 1;
          newPosition = Math.round((prevPosition + nextPosition) / 2);
        }
        // Si nos movemos hacia arriba (oldIndex > newIndex)
        else {
          const prevPosition =
            items[newIndex - 1]?.position ?? targetItem.position - 1;
          const nextPosition = targetItem.position;
          newPosition = Math.round((prevPosition + nextPosition) / 2);
        }
      }

      /*console.log(
        `🍽️ Moviendo item ${movedItem.id} desde posición ${oldIndex} a ${newIndex} con newPosition: ${newPosition}`
      );*/

      try {
        await itemService.update(movedItem.id, { newPosition });
        await onCategoryChange();
        //console.log(`✅ Orden de item actualizado correctamente`);
      } catch {
        console.error("❌ Error al actualizar el orden de item");
        // Revertir el cambio local si falla
        setLocalItems(items);
        alert("Error al actualizar el orden del plato. Revisa la consola.");
      }
    }
  };

  const handleTitleChange = (categoryId: number, newTitle: string) => {
    setCategoryTitles((prev) => ({
      ...prev,
      [categoryId]: newTitle,
    }));
  };

  const handleEditSave = async (categoryId: number) => {
    const newTitle = categoryTitles[categoryId];
    const originalCategory = menuCategories.find((c) => c.id === categoryId);

    if (originalCategory && originalCategory.title === newTitle) {
      console.log("No hay cambios para guardar en la categoría:", categoryId);
      return;
    }

    setSavingId(categoryId);

    try {
      await categoryService.update(categoryId, { title: newTitle });
      await onCategoryChange();
      toast("Categoría actualizada con éxito.", {
        duration: 2000,
        icon: null,
        style: {
          background: "#22c55e",
          color: "white",
          borderRadius: "10px",
          padding: "14px 16px",
          fontSize: "16px",
        },
      });
      //aqui deberia avisarle al sonner
      //console.log(`✅ Categoría ${categoryId} actualizada: ${newTitle}`);
    } catch {
      console.error("❌ Error al guardar la edición de categoría");
      alert("Error al guardar la categoría. Revisa la consola.");
    } finally {
      setSavingId(null);
    }
  };

  const handleDelete = async (categoryId: number) => {
    try {
      await categoryService.delete(categoryId);
      await onCategoryChange();
      toast("Categoría eliminada con éxito.", {
        duration: 2000,
        icon: null,
        style: {
          background: "#22c55e",
          color: "white",
          borderRadius: "10px",
          padding: "14px 16px",
          fontSize: "16px",
        },
      });
    } catch {
      console.error("Error al eliminar categoría");
    }
  };

  const handleDeleteItem = async (itemId: number) => {
    setDeletingItemId(itemId);

    try {
      await itemService.delete(itemId);
      await onCategoryChange();
      toast("Plato eliminado con éxito.", {
        duration: 2000,
        icon: null,
        style: {
          background: "#22c55e",
          color: "white",
          borderRadius: "10px",
          padding: "14px 16px",
          fontSize: "16px",
        },
      });
      //console.log(`✅ Ítem ${itemId} eliminado correctamente`);
    } catch {
      console.error("❌ Error al eliminar ítem");
      alert("Error al eliminar el plato. Revisa la consola.");
    } finally {
      setDeletingItemId(null);
    }
  };

  // ✅ AHORA EL RETURN CONDICIONAL ESTÁ DESPUÉS DE TODOS LOS HOOKS
  if (!menuId) {
    return null;
  }

  if (loading) {
    return (
      <div className="w-full flex justify-center items-center py-10">
        <Spinner className="w-12 h-12 text-orange-500" />
      </div>
    );
  }

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

          <div className="space-y-3 mt-4">
            {categories && categories.length > 0 ? (
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={categories.map((cat) => cat.id)}
                  strategy={verticalListSortingStrategy}
                >
                  {categories.map((category) => (
                    <SortableCategory
                      key={category.id}
                      category={category}
                      expandedCategoryId={expandedCategoryId}
                      setExpandedCategoryId={setExpandedCategoryId}
                      categoryTitles={categoryTitles}
                      handleTitleChange={handleTitleChange}
                      handleEditSave={handleEditSave}
                      savingId={savingId}
                      handleDelete={handleDelete}
                      handleDeleteItem={handleDeleteItem}
                      deletingItemId={deletingItemId}
                      onCategoryChange={onCategoryChange}
                      sensors={sensors}
                      handleItemDragEnd={handleItemDragEnd}
                    />
                  ))}
                </SortableContext>
              </DndContext>
            ) : !loading ? (
              <p className="text-sm text-slate-400 italic mt-6">
                No hay categorías creadas aún.
              </p>
            ) : null}
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default MenuCatPage;
