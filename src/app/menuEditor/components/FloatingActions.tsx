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
  updateMenu,
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

  const base64ToFile = async (
    base64String: string,
    filename: string
  ): Promise<File> => {
    // Extraer el tipo MIME y los datos
    const arr = base64String.split(",");
    const mime = arr[0].match(/:(.*?);/)?.[1] || "image/png";
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);

    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }

    return new File([u8arr], filename, { type: mime });
  };

  useEffect(() => {
    /*console.group("🔍 === DATOS RECIBIDOS DEL PADRE ===");
    
    console.log("📋 menu:", menu);
    console.log("  - ID:", menu?.id);
    console.log("  - Nombre:", menu?.title);
    console.log("  - Categorías:", menu?.categories?.length || 0);*/

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
      const menuId = Number(menuIdParam) || menu?.id;
      const userId = 1;

      // controlar el usuario y menu seleccionado.
      console.log("🧾 ID del menú detectado:", menuId);
      console.log("👤 userId:", userId);

      // Si se está editando un menú existente
      if (menuIdParam || menu?.id) {
        console.group("🧩 ACTUALIZANDO MENÚ EXISTENTE");
        console.log("🚀 Llamando a updateMenu con ID:", menuId);
        console.log("📦 Enviando datos:", newMenu);
        console.groupEnd();

        //editar menu
        const updatedMenu = await updateMenu(menuId, newMenu);
        console.log("🧾 Datos a enviar a updateMenu():", updatedMenu);

        //editar categorias e items
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
            } else {
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
            newCategory.map((category) => {
              // Asegurarse de que los items tengan el formato correcto
              const formattedItems = (category.items || []).map((item) => ({
                title: item.title,
                description: item.description,
                price: item.price,
                categoryId: menuId, // Usar el menuId actual
                images: item.images || [], // Array de File[]
              }));
              return createCategory({
                title: category.title,
                items: formattedItems,
                menuId,
              });
            })
          );
        }
      } else {
        //  Crear un nuevo menú
        const createdMenu = await createMenu(newMenu);
        console.log(createdMenu);
        const newMenuId = createdMenu.id;
        //  Crear nuevas categorías
        if (newCategory && newCategory.length > 0) {
          console.group("➕ CREANDO NUEVAS CATEGORÍAS (Nuevo Menu)");

          await Promise.all(
            newCategory.map(async (category, catIndex) => {
              console.log(`📋 Categoría ${catIndex}: ${category.title}`);

              // ✅ Procesar items con conversión de base64 a File
              const formattedItems = await Promise.all(
                (category.items || []).map(async (item, itemIndex) => {
                  const validImages: File[] = [];

                  // Convertir cada imagen
                  if (item.images && item.images.length > 0) {
                    for (
                      let imgIndex = 0;
                      imgIndex < item.images.length;
                      imgIndex++
                    ) {
                      const img = item.images[imgIndex];

                      // Si es un File, usarlo directamente
                      if (img instanceof File) {
                        validImages.push(img);
                        console.log(
                          `    ✅ Imagen ${imgIndex}: File directo (${img.name}, ${img.size} bytes)`
                        );
                      }
                      // Si tiene URL en base64, convertirla
                      else if (
                        img.url &&
                        typeof img.url === "string" &&
                        img.url.startsWith("data:")
                      ) {
                        try {
                          const file = await base64ToFile(
                            img.url,
                            `${item.title}-${imgIndex}.png`
                          );
                          validImages.push(file);
                          console.log(
                            `    ✅ Imagen ${imgIndex}: Convertida de base64 a File (${file.size} bytes)`
                          );
                        } catch (error) {
                          console.error(
                            `  ❌ Error convirtiendo imagen ${imgIndex}:`,
                            error
                          );
                        }
                      }
                    }
                  }

                  console.log(
                    `  📦 Item "${item.title}" con ${validImages.length} imágenes válidas`
                  );

                  return {
                    title: item.title,
                    description: item.description,
                    price: item.price,
                    categoryId: newMenuId, // Usar newMenuId aquí
                    images: validImages,
                  };
                })
              );

              const dataToSend = {
                title: category.title,
                items: formattedItems,
                menuId: newMenuId,
              };

              console.log(`\n📤 ENVIANDO A LA BD - Categoría ${catIndex + 1}:`);
              console.log("  ├─ Título:", dataToSend.title);
              console.log("  ├─ Menu ID:", dataToSend.menuId);
              console.log("  └─ Items:", dataToSend.items.length);

              dataToSend.items.forEach((item, i) => {
                console.log(`\n    Item ${i + 1}:`);
                console.log(`      ├─ Título: "${item.title}"`);
                console.log(`      ├─ Descripción: "${item.description}"`);
                console.log(`      ├─ Precio: ${item.price}`);
                console.log(`      ├─ Category ID: ${item.categoryId}`);
                console.log(`      └─ Imágenes: ${item.images.length}`);

                if (item.images.length > 0) {
                  item.images.forEach((img, imgIndex) => {
                    console.log(
                      `         └─ Imagen ${imgIndex + 1}: ${img.name} (${(
                        img.size / 1024
                      ).toFixed(2)} KB, ${img.type})`
                    );
                  });
                }
              });

              console.log("\n  📦 Objeto completo a enviar:", dataToSend);
              console.log(
                `📤 Enviando categoría "${dataToSend.title}" con ${dataToSend.items.length} items`
              );
              dataToSend.items.forEach((item, index) => {
                item.images.forEach((img, imgIndex) => {
                  console.log(
                    `    🧾 Item ${index + 1} → Imagen ${imgIndex + 1}:`,
                    img instanceof File
                      ? `✅ File "${img.name}" (${img.size} bytes)`
                      : img
                  );
                });
              });
              return createCategory(dataToSend);
            })
          );

          console.groupEnd();
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
