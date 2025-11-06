"use client";

import { useEffect, useState } from "react";
import { Button } from "@/common/components/ui/button";
import {
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
  TooltipContent,
} from "@/common/components/ui/tooltip";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import {
  createMenu,
  createCategory,
  updateCategory,
  deleteCategory,
  deleteItem,
} from "@/common/utils/api";

import { Menu, newMenu, newCategory, EditedCategory } from "@/interfaces/menu";

interface FloatingActionsProps {
  menu: Menu;
  newMenu: newMenu;
  newCategory: newCategory[];
  editedCategories: EditedCategory[];
  categoriesToDelete: number[];
  onDeleteComplete: () => void;
  onPreviewClick: () => void;
}

const FloatingActions: React.FC<FloatingActionsProps> = ({
  menu,
  newMenu,
  newCategory,
  editedCategories,
  categoriesToDelete,
  onDeleteComplete,
  onPreviewClick,
}) => {
  
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    // Detectar si estamos creando o editando un menú
    if (pathname === "/menuEditor") {
      const id = searchParams.get("id");
      setTitle(id ? "Guardar Cambios" : "Crear Menú");
    }
  }, [pathname, searchParams]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      //obtener id del menu
      const menuIdParam = searchParams.get("id");
      const menuId = Number(menuIdParam);

      // Si se está editando un menú existente
      if (menuIdParam) {
        const categoriesToCheck = menu.categories || [];

        //Detectar y eliminar items individuales dentro de categorías
        const itemsToDelete: number[] = [];

        // 🧩 Comparar categorías e items
        editedCategories.forEach((editedCat) => {
          const originalCat = categoriesToCheck.find(
            (cat) => cat.id === editedCat.id
          );
          if (originalCat) {
            const originalItemsCount = originalCat.items?.length || 0;
            const editedItemsCount = editedCat.items?.length || 0;
            // Si se eliminaron items
            if (editedItemsCount < originalItemsCount) {
              // Obtener IDs de items editados
              const editedItemIds =
                editedCat.items?.map((item) => item.id).filter((id) => id) ||
                [];

              // Encontrar items que estaban en original pero no están en editado
              originalCat.items?.forEach((originalItem) => {
                if (
                  originalItem.id &&
                  !editedItemIds.includes(originalItem.id)
                ) {
                  itemsToDelete.push(originalItem.id);
                }
              });
            }  else {
              const itemsAreEqual = originalCat.items?.every(
                (originalItem, index) => {
                  const editedItem = editedCat.items?.[index];
                  return (
                    originalItem.id === editedItem?.id &&
                    originalItem.title === editedItem?.title &&
                    originalItem.description === editedItem?.description &&
                    originalItem.price === editedItem?.price
                  );
                }
              );

              if (itemsAreEqual) {
                
              } else {
                
              }
            }
          }
        });

        // 🆕 PASO 2: Eliminar items de la base de datos
        if (itemsToDelete.length > 0) {
          
          await Promise.all(itemsToDelete.map((itemId) => deleteItem(itemId)));
          
        }

        // 🗑️ Eliminar categorías
        if (categoriesToDelete.length > 0) {
          
          await Promise.all(
            categoriesToDelete.map((categoryId) => deleteCategory(categoryId))
          );
          onDeleteComplete();
          
        }

        // ✏️ Editar categorías existentes
        if (editedCategories && editedCategories.length > 0) {
          
          await Promise.all(
            editedCategories.map((category) => {
              const cleanedItems = (category.items || []).map((item) => {
                const { tempId, ...rest } = item as any;
                if (tempId) {
                  const { id, ...newItem } = rest;
                  return newItem;
                }
                return rest;
              });
              
              return updateCategory(category.id, {
                title: category.title,
                items: cleanedItems,
              });
            })
          );
        }

        //  Crear nuevas categorías
        if (newCategory && newCategory.length > 0) {
          await Promise.all(
            newCategory.map((category) =>
              createCategory({
                title: category.title,
                items: category.items || [],
                menuId,
              })
            )
          );
          
        }
      } else {
        //  Crear un nuevo menú
        const createdMenu = await createMenu(newMenu);
        console.log(createdMenu)
        const newMenuId = createdMenu.id;

        if (newCategory && newCategory.length > 0) {
          await Promise.all(
            newCategory.map((category) =>
              createCategory({
                title: category.title,
                items: category.items || [],
                menuId: newMenuId,
              })
            )
          );
        }
      }

      // ✅ Redirigir después de guardar
      router.push("/");
    } catch (error) {
      console.error("❌ Error al crear o editar el menú:", error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-b from-white via-[#FFF3EC] to-[#FFE6D3] backdrop-blur-md shadow-[0_-4px_24px_rgba(0,0,0,0.4)]">
      <div className="max-w-4xl mx-auto flex gap-4">
        {/* Botón Vista Previa */}
        <Button
        onClick={onPreviewClick}
          className="
            flex-1 h-14 
            bg-gradient-to-br from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600
            text-white font-semibold text-base 
            rounded-2xl transition-all duration-300 
            hover:scale-[1.02] active:scale-[0.98]
          "
        >
          Vista Previa
        </Button>

        {/* Botón Guardar */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex-1">
                <Button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="h-14 
                    bg-gradient-to-br from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600
                    text-white font-semibold text-base 
                    rounded-2xl transition-all duration-300 
                    hover:scale-[1.02] active:scale-[0.98]"
                >
                  {isSaving ? "Guardando..." : title}
                </Button>
              </div>
            </TooltipTrigger>

            <TooltipContent className="bg-slate-800 border border-slate-700 text-slate-300 text-xs">
              Completa el nombre y URLs válidas
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
};

export default FloatingActions;
