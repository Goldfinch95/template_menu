"use client";

import React, {
  useCallback,
  useState,
  useEffect,
  useRef,
  useMemo,
} from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Menu, newMenu, newCategory, EditedCategory } from "@/interfaces/menu";
import { deleteMenu, getMenu } from "@/common/utils/api";
//subcomponetes
import NavbarEditor from "@/app/menuEditor/components/NavbarEditor";
import MenuInfo from "./components/menuInfo/page";
import MenuCatPage from "./components/menuCat/page";
import CategoryEditor from "./components/CategoryEditor";
import FloatingActions from "./components/FloatingActions";

import { Trash2, X } from "lucide-react";

import { motion } from "framer-motion";

interface InfoEditorProps {
  menuId: number;
  onMenuCreated: (newMenuId: number) => void; // 🔥 Ahora recibe el ID
}

const MenuEditorContent = () => {
  //Estado para el menu
  const [menu, setMenu] = useState<Menu>({} as Menu);
  // estado para nuevo menú
  const [newMenu, setNewMenu] = useState<newMenu>({} as newMenu);
  // estado para nueva categoria
  const [newCategory, setNewCategory] = useState<newCategory[]>([]);
  // Estado para categorias editadas
  const [editedCategories, setEditedCategories] = useState<EditedCategory[]>(
    []
  );
  //Estado para categorías marcadas para eliminar
  const [categoriesToDelete, setCategoriesToDelete] = useState<number[]>([]);
  // Estado para el boton vista previa
  const [showPreview, setShowPreview] = useState(false);
  // Estado para categoria activa en el scroll
  const [activeCategory, setActiveCategory] = useState(0);

  // Referencias para el scroll
  const categoryRefs = useRef({});
  const scrollContainerRef = useRef(null);

  //Estado para obtener id del menú
  const searchParams = useSearchParams();
  // estado para el router
  const router = useRouter();

  //cargar menú existente si hay id en los parámetros
  const fetchMenuData = useCallback(async (menuId: string) => {
    try {
      const menuData = await getMenu(menuId);
      setMenu(menuData);
      console.log(menuData);
      //console.log("✅ Menú y categorías cargadas:", menuData.categories.length);
    } catch (error) {
      console.error("❌ Error al cargar el menú:", error);
    }
  }, []); // Dependencias vacías, ya que menuId viene del useEffect.

  // Cargar menú existente si hay id en los parámetros
  useEffect(() => {
    const menuId = searchParams.get("id");
    if (!menuId) return;

    // Llamamos a la función de carga
    fetchMenuData(menuId);
  }, [searchParams, fetchMenuData]);

  // 🆕 Función para combinar datos del menú para la vista previa
  const getPreviewData = useMemo(() => {
    const menuId = searchParams.get("id");

    // Si estamos creando un nuevo menú
    if (!menuId) {
      return {
        title: newMenu.title || "Nombre del Menú",
        pos: newMenu.pos || "Ubicación / Puntos de Venta",
        logo: newMenu.logo ? URL.createObjectURL(newMenu.logo) : null,
        backgroundImage: newMenu.backgroundImage
          ? URL.createObjectURL(newMenu.backgroundImage)
          : null,
        color: {
          primary: newMenu.color?.primary || "#FF6B35",
          secondary: newMenu.color?.secondary || "#FF8C42",
        },
        categories: newCategory || [],
      };
    }

    // Si estamos editando un menú existente
    // Combinar categorías: originales + editadas + nuevas - eliminadas
    const allCategories = [];

    // 1. Agregar categorías originales que NO han sido editadas ni eliminadas
    if (menu.categories) {
      menu.categories.forEach((originalCat) => {
        const isEdited = editedCategories.some(
          (edited) => edited.id === originalCat.id
        );
        const isDeleted = categoriesToDelete.includes(originalCat.id);

        if (!isEdited && !isDeleted) {
          allCategories.push(originalCat);
        }
      });
    }

    // 2. Agregar categorías editadas (reemplazan a las originales)
    editedCategories.forEach((editedCat) => {
      const isDeleted = categoriesToDelete.includes(editedCat.id);
      if (!isDeleted) {
        allCategories.push(editedCat);
      }
    });

    // 3. Agregar nuevas categorías
    if (newCategory && newCategory.length > 0) {
      allCategories.push(...newCategory);
    }

    return {
      title: newMenu.title || menu.title || "Nombre del Menú",
      pos: newMenu.pos || menu.pos || "Ubicación / Puntos de Venta",
      logo: newMenu.logo
        ? URL.createObjectURL(newMenu.logo)
        : menu.logo || null,
      backgroundImage: newMenu.backgroundImage
        ? URL.createObjectURL(newMenu.backgroundImage)
        : menu.backgroundImage || null,
      color: {
        primary: newMenu.color?.primary || menu.color?.primary || "#FF6B35",
        secondary:
          newMenu.color?.secondary || menu.color?.secondary || "#FF8C42",
      },
      categories: allCategories,
    };
  }, [
    menu,
    newMenu,
    newCategory,
    editedCategories,
    categoriesToDelete,
    searchParams,
  ]);

  // Función para scroll suave a una categoría
  const scrollToCategory = (index) => {
    setActiveCategory(index);
    const categoryElement = categoryRefs.current[index];
    if (categoryElement) {
      // Scroll a la categoría seleccionada
      categoryElement.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });

      // Scroll horizontal para alinear el botón al inicio
      const scrollContainer = scrollContainerRef.current;
      const activeButton = scrollContainer?.children[index];
      if (scrollContainer && activeButton) {
        const buttonLeft = activeButton.offsetLeft;

        scrollContainer.scrollTo({
          left: buttonLeft,
          behavior: "smooth",
        });
      }
    }
  };

  // recibir datos de los componentes hijos //

  //recibir imagenes
  const reciveRestaurantImages = useCallback(
    (images: { logo: File | null; backgroundImage: File | null }) => {
      // ver en consola
      /*console.log("📥 Imágenes recibidas al padre:", {
        logo: images.logo?.name,
        background: images.backgroundImage?.name,
      });*/

      // agregar imagenes al nuevo menú
      setNewMenu((prevMenu) => ({
        ...prevMenu,
        logo: images.logo as File, // Asegurar tipo File
        backgroundImage: images.backgroundImage as File,
      }));
    },
    []
  );

  // recibir info del restaurante
  const reciveRestaurantInformation = useCallback(
    (info: { title: string; pos: string }) => {
      // ver en consola
      //console.log("Información recibida del restaurante:", info);
      //agregar info del restaurante al nuevo menú
      setNewMenu((prevMenu) => ({
        ...prevMenu,
        title: info.title,
        pos: info.pos,
      }));
    },
    []
  );
  const reciveRestaurantColors = (colors: {
    primary: string;
    secondary: string;
  }) => {
    setNewMenu((prevMenu) => ({
      ...prevMenu,
      color: {
        primary: colors.primary,
        secondary: colors.secondary,
      },
    }));
  };

  //funcion para recibir las categorías del componente hijo
  const receiveRestaurantCategories = (categories: newCategory[]) => {
    console.log("📦 [PADRE] Nuevas categorías recibidas:", categories);
    categories.forEach((cat, i) => {
      console.log(`  🧭 Categoria[${i}]:`, cat.title || "(sin título)");
      cat.items?.forEach((item, j) => {
        console.log(`    🍽️ Item[${j}]:`, item.title || "(sin nombre)");
        if (item.images?.[0]) {
          console.log(
            `      🖼️ Imagen del item[${j}]:`,
            item.images[0],
            "Tipo:",
            item.images[0] instanceof File ? "File" : typeof item.images[0]
          );
        }
      });
    });

    setNewCategory(categories);
  };

  //  Función para recibir categorías editadas desde el hijo
  const receiveEditedCategory = useCallback(
    (editedCategory: EditedCategory) => {
      console.log(
        "✏️ [PADRE] Categoría editada recibida:",
        editedCategory.title
      );
      editedCategory.items?.forEach((item, i) => {
        console.log(`  🍽️ Item[${i}]:`, item.title || "(sin nombre)");
        if (item.images?.[0]) {
          console.log(
            `      🖼️ Imagen del item[${i}]:`,
            item.images[0],
            "Tipo:",
            item.images[0] instanceof File ? "File" : typeof item.images[0]
          );
        }
      });

      setEditedCategories((prev) => {
        const existingIndex = prev.findIndex(
          (cat) => cat.id === editedCategory.id
        );
        if (existingIndex !== -1) {
          const updated = [...prev];
          updated[existingIndex] = editedCategory;
          return updated;
        } else {
          return [...prev, editedCategory];
        }
      });
    },
    []
  );

  // Función para limpiar las categorías después de guardar
  const clearCategoriesAfterSave = useCallback(() => {
    console.log("🧹 Limpiando categorías después de guardar");
    setCategoriesToDelete([]);
    setEditedCategories([]);
  }, []);

  //  Función para recibir las categorías marcadas para eliminar
  const receiveCategoryForDelete = useCallback((categoryId: number) => {
    setCategoriesToDelete((prev) => {
      return [...prev, categoryId];
    });
  }, []);

  //  Función para limpiar las categorías marcadas después de guardar
  const clearCategoriesToDelete = useCallback(() => {
    setCategoriesToDelete([]);
  }, []);

  // funcion que elimina el menú
  const handleDeleteMenu = async () => {
    const menuId = searchParams.get("id");
    if (!menuId) {
      alert("No se encontró el ID del menú");
      return;
    }

    try {
      await deleteMenu(menuId);
      router.push("/menuShowcase");
    } catch (error) {
      alert("Error al eliminar el menú");
    }
  };

  // función para manejar el clic en Vista Previa
  const handlePreviewClick = () => {
    setActiveCategory(0);
    setShowPreview(true);
  };

  //  Obtener datos combinados para la vista previa
  const previewData = getPreviewData;

  return (
    <main
      className="min-h-screen w-full
        bg-gradient-to-b from-white via-[#FFF3EC] to-[#FFE6D3]
        flex flex-col"
    >
      {/* Navbar */}
      <NavbarEditor />
      {/* Contenido principal */}
      <motion.section
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="
          flex-1 w-full
          max-w-3xl mx-auto
          px-5 sm:px-6 lg:px-8
          pt-6 pb-24
          space-y-8
        "
      >
        <div className="space-y-8">
          {/*Sección de imagenes del menú*/}
          <MenuInfo
            menuId={menu.id}
            onMenuCreated={(newMenuId) => {
              console.log(
                "🔔 Abuelo notificado - Nuevo menú creado con ID:",
                newMenuId
              );
              //actualiza
              router.push(`/menuEditor?id=${newMenuId}`);
              //recarga
              fetchMenuData(String(newMenuId));
            }}
          />
          <MenuCatPage
            menuId={menu.id}
            menuCategories={menu.categories}
            onCategoryChange={() => fetchMenuData(String(menu.id))}
          />
          {/* Eliminar menu */}
          {menu?.id && (
            <div className="px-4 w-full">
              <button
                onClick={handleDeleteMenu}
                className="w-full py-4 mt-8 flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 active:bg-red-700 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg shadow-red-500/25"
              >
                <Trash2 size={18} />
                Eliminar Menú
              </button>
            </div>
          )}
        </div>
      </motion.section>
    </main>
  );
};

export default MenuEditorContent;
