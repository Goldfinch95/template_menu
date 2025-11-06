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
import { Alert, AlertDescription } from "@/common/components/ui/alert";

import NavbarEditor from "@/app/menuEditor/components/NavbarEditor";
import ImagesEditor from "./components/ImagesEditor";
import InfoEditor from "./components/InfoEditor";
import ColorEditor from "./components/ColorEditor";
import CategoryEditor from "./components/CategoryEditor";
import FloatingActions from "./components/FloatingActions";
import { AlertCircle, Trash2, Plus, GripVertical, X } from "lucide-react";
import { title } from "process";

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
  useEffect(() => {
    const menuId = searchParams.get("id");
    if (!menuId) return;

    const loadMenu = async () => {
      try {
        const menuData = await getMenu(menuId);
        setMenu(menuData);
      } catch (error) {
        console.error("❌ Error al cargar el menú:", error);
      }
    };
    loadMenu();
  }, [searchParams]);

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

  // recibir datos de los componentes hijos
  const reciveRestaurantImages = useCallback(
    (images: { logo: File | null; backgroundImage: File | null }) => {
      console.log("📥 Imágenes recibidas al padre:", {
        logo: images.logo?.name,
        background: images.backgroundImage?.name,
      });

      // ✅ TAMBIÉN actualizar newMenu (para modo creación)
      setNewMenu((prevMenu) => ({
        ...prevMenu,
        logo: images.logo as File, // Asegurar tipo File
        backgroundImage: images.backgroundImage as File,
      }));
    },
    []
  );
  const reciveRestaurantInformation = useCallback(
    (info: { title: string; pos: string }) => {
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
    console.log("categorias recibidas", categories);
    setNewCategory(categories);
  };

  //  Función para recibir categorías editadas desde el hijo
  const receiveEditedCategory = useCallback(
    (editedCategory: EditedCategory) => {
      setEditedCategories((prev) => {
        // Si la categoría ya está en el array, actualízala; si no, agrégala
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

      //console.log(editedCategory)
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
      router.push("/");
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
    <div className="min-h-screen bg-gradient-to-b from-white via-[#FFF3EC] to-[#FFE6D3] w-full  pb-25">
      {/* Navbar */}
      <NavbarEditor />
      {/* Contenido principal */}
      <main className="max-w-3xl mx-auto w-full px-5 sm:px-6 lg:px-8 py-10 space-y-8">
        <div className="space-y-6">
          {/* Alert de error 
          {saveError && (
            <Alert
              variant="destructive"
              className="bg-red-950/50 border border-red-900/70 backdrop-blur-sm"
            >
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{saveError}</AlertDescription>
            </Alert>
          )}

          {/*Sección de URLs de imágenes*/}
          <ImagesEditor
            logo={menu.logo}
            background={menu.backgroundImage}
            onImagesSubmit={reciveRestaurantImages}
          />

          {/*Información básica */}
          <InfoEditor
            title={menu.title}
            pos={menu.pos}
            onInfoSubmit={reciveRestaurantInformation}
          />
          {/* Colores */}
          <ColorEditor
            primary={menu.color?.primary}
            secondary={menu.color?.secondary}
            onColorsChange={reciveRestaurantColors}
          />
          <div className="py-1"></div>
          <CategoryEditor
            onCategoriesChange={receiveRestaurantCategories}
            onEditCategory={receiveEditedCategory}
            onDeleteCategory={receiveCategoryForDelete}
            categoriesToDelete={categoriesToDelete}
            categories={menu.categories}
          />

          {/* Eliminar menu */}
          <button
            onClick={handleDeleteMenu}
            className="w-full py-4 mt-8 flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 active:bg-red-700 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg shadow-red-500/25"
          >
            <Trash2 size={18} />
            Eliminar Menú
          </button>
        </div>
      </main>

      {/* Botones flotantes */}
      <FloatingActions
        menu={menu}
        newMenu={newMenu}
        newCategory={newCategory}
        editedCategories={editedCategories}
        categoriesToDelete={categoriesToDelete}
        onDeleteComplete={clearCategoriesToDelete}
        onPreviewClick={handlePreviewClick}
      />

      {/* Modal de Preview */}
      {showPreview && (
        <div className="fixed inset-0 bg-black z-50 overflow-y-auto">
          <div className="sticky top-0 bg-white/10 backdrop-blur-md border-b border-white/20 z-10">
            <div className="px-4 py-3 flex items-center justify-between">
              <span className="text-white font-medium">Vista Previa</span>
              <button
                onClick={() => {
                  setShowPreview(false);
                  setActiveCategory(0); // Resetear a la primera categoría al cerrar
                }}
                className="p-2 hover:bg-white/20 rounded-full transition-colors"
              >
                <X className="w-6 h-6 text-white" />
              </button>
            </div>
          </div>

          <div
            className="min-h-screen"
            style={{ backgroundColor: previewData.color.primary }}
          >
            <div className="relative h-72 overflow-hidden">
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{
                  backgroundImage: previewData.backgroundImage
                    ? `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.6)), url(${previewData.backgroundImage})`
                    : `linear-gradient(135deg, ${previewData.color.primary}, ${previewData.color.secondary})`,
                }}
              />

              <div className="relative h-full flex flex-col items-center justify-center px-6">
                {previewData.logo && (
                  <div className="w-28 h-28 mb-4 bg-white rounded-3xl flex items-center justify-center shadow-2xl overflow-hidden ring-4 ring-white/50">
                    <img
                      src={previewData.logo}
                      alt="Logo"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                <h1 className="text-white text-4xl font-bold text-center drop-shadow-lg mb-2">
                  {previewData.title || "Nombre del Menú"}
                </h1>
                <h2 className="text-white text-lg">
                  {previewData.pos || "Ubicación / Puntos de Venta"}
                </h2>
              </div>
            </div>
            {/* Scroll de Categorías */}
            {previewData.categories && previewData.categories.length > 0 && (
              <div className="sticky top-[57px] z-20 bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-md">
                <div
                  ref={scrollContainerRef}
                  className="flex overflow-x-auto scrollbar-hide px-6 py-3 gap-2"
                  style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                >
                  {previewData.categories.map((category, index) => (
                    <button
                      key={category.id || `cat-${index}`}
                      onClick={() => scrollToCategory(index)}
                      className={`flex-shrink-0 px-5 py-2.5 rounded-full font-medium text-sm transition-all duration-300 whitespace-nowrap
                        ${
                          activeCategory === index
                            ? "text-white shadow-lg transform scale-105"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                      style={{
                        backgroundColor:
                          activeCategory === index
                            ? previewData.color.secondary
                            : undefined,
                      }}
                    >
                      {category.title}
                    </button>
                  ))}
                </div>
              </div>
            )}
            <div className="px-6 py-8 max-w-4xl mx-auto">
              {!previewData.categories ||
              previewData.categories.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-white/70 text-lg">
                    No hay categorías ni platos para mostrar
                  </p>
                  <p className="text-white/50 text-sm mt-2">
                    Agrega categorías y platos para ver la vista previa
                  </p>
                </div>
              ) : (
                previewData.categories.map((category, catIndex) => (
                  <div
                    key={category.id || `new-${catIndex}`}
                    ref={(el) => (categoryRefs.current[catIndex] = el)}
                    className="mb-8 scroll-mt-32"
                  >
                    {category.title && (
                      <h2
                        className="text-2xl font-bold mb-6"
                        style={{ color: previewData.color.secondary }}
                      >
                        {category.title}
                      </h2>
                    )}
                    <div className="space-y-4">
                      {!category.items || category.items.length === 0 ? (
                        <p className="text-white/50 text-sm italic">
                          No hay platos en esta categoría
                        </p>
                      ) : (
                        category.items.map((item, itemIndex) => (
                          <div
                            key={item.id || `new-item-${itemIndex}`}
                            className="border-2 border-slate-200 rounded-2xl p-5 hover:shadow-lg transition-all duration-300 hover:border-slate-300 bg-white"
                          >
                            <div className="flex justify-between items-start gap-4">
                              <div className="flex-1">
                                <h3 className="font-bold text-slate-800 mb-2 text-lg">
                                  {item.title || "Plato sin nombre"}
                                </h3>
                                {item.description && (
                                  <p className="text-sm text-slate-600 mb-3">
                                    {item.description}
                                  </p>
                                )}
                                {item.price && (
                                  <p
                                    className="text-xl font-bold"
                                    style={{ color: previewData.color.secondary }}
                                  >
                                    ${item.price}
                                  </p>
                                )}
                              </div>
                              <div className="w-24 h-24 flex-shrink-0 rounded-2xl overflow-hidden">
                                {item.images[0]?.url ? (
                                  <img
                                    src={item.images[0].url}
                                    alt={item.title}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                      const target =
                                        e.target as HTMLImageElement;
                                      target.style.display = "none";
                                      if (target.parentElement) {
                                        target.parentElement.classList.add(
                                          "bg-gradient-to-br",
                                          "from-slate-200",
                                          "to-slate-300",
                                          "flex",
                                          "items-center",
                                          "justify-center"
                                        );
                                        target.parentElement.innerHTML =
                                          '<span class="text-slate-400 text-xs font-medium">Sin imagen</span>';
                                      }
                                    }}
                                  />
                                ) : (
                                  <div className="w-full h-full bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center">
                                    <span className="text-slate-400 text-xs font-medium">
                                      Sin imagen
                                    </span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                ))
              )}
              {/* Footer informativo */}
              <div className="mt-8 p-6 bg-slate-50 rounded-2xl text-center">
                <p className="text-slate-600 text-sm">
                  ✨ Esta es una vista previa de tu menú
                </p>
                <p className="text-slate-500 text-xs mt-2">
                  Los productos mostrados son solo de ejemplo
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

{
  /*const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
      <p className="mt-4 text-gray-600">Cargando editor...</p>
    </div>
  </div>
);*/
}

{
  /*const MenuEditor = () => {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <MenuEditorContent />
    </Suspense>
  );
};*/
}

export default MenuEditorContent;
