"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Category, newCategory } from "@/interfaces/menu";
import {
  createMenu,
  deleteMenu,
  getMenu,
  updateMenu,
  createCategory,
} from "@/common/utils/api";
import { Alert, AlertDescription } from "@/common/components/ui/alert";
import {
  validateFormData,
  handleInputChange as handleInputChangeUtil,
} from "@/app/menuEditor/utils/auxiliaryFunctions";
import NavbarEditor from "@/app/menuEditor/components/NavbarEditor";
import ImagesEditor from "./components/ImagesEditor";
import InfoEditor from "./components/InfoEditor";
import ColorEditor from "./components/ColorEditor";
import FloatingActions from "./components/FloatingActions";
import { AlertCircle, Trash2, Plus, GripVertical } from "lucide-react";

const MenuEditorContent = () => {

  //Recibo los valores de los subcomponentes
  const reciveRestaurantImages = (images: { logo: string; backgroundImage: string }) => {
    //ver valores recibidos de las imagenes
    console.log("Valores recibidos del hijo:", images);
  };
  const reciveRestaurantInformation = (info: { title: string; pos: string }) => {
    // ver valores recibidos de la info
    console.log("Información del restaurante recibida:", info);
  };

  const reciveRestaurantColors = (colors: { primary: string; secondary: string }) => {
    //ver valores recibidos de los colores
    console.log("Colores recibidos del hijo:", colors);    
  };
  {/*const searchParams = useSearchParams();
  const router = useRouter();
  const menuId = searchParams.get("id");
  const menuTitle = searchParams.get("title");

  const urlParams = {
    id: menuId || "",
    title: menuTitle || "",
  };

  const isCreating = !urlParams.id;
  const pageTitle = isCreating ? "Creador de Menú" : "Editor de Menú";

  // State
  const [showPreview, setShowPreview] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [formData, setFormData] = useState({
    title: urlParams.title || "",
    pos: "",
    color: {
      primary: "",
      secondary: "",
    },
    logo: "",
    backgroundImage: "",
  });

  // Categorías
  const [categories, setCategories] = useState<Category[]>([]);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [newCategory, setNewCategory] = useState<newCategory[]>([]);

  // Cargar menú específico
  useEffect(() => {
    if (!menuId) return;
    let mounted = true;

    (async () => {
      setIsLoading(true);
      try {
        const data = await getMenu(menuId);
        if (mounted) {
          setFormData({
            title: data.title,
            pos: data.pos,
            color: {
              primary: data.color?.primary || "",
              secondary: data.color?.secondary || "",
            },
            logo: data.logo,
            backgroundImage: data.backgroundImage,
          });
          setCategories(data.categories || []);
          console.log(data);
        }
      } catch (error) {
        setSaveError("Error al cargar el menú");
      } finally {
        setIsLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [menuId]);

  // HANDLERS DE CATEGORÍAS
  const handleAddCategory = () => {
    const newCategory: newCategory = {
      title: category.title,
    };
    setCategories([...categories, newCategory]);
    setHasUnsavedChanges(true);
  };

  

  
  // HANDLERS GENERALES
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleInputChangeUtil(e, setFormData);
    setHasUnsavedChanges(true);
  };

  const handleViewMenu = () => {
    router.push(
      `/menu?id=${menuId}&title=${encodeURIComponent(menuTitle || "")}`
    );
  };

  const canSave = () => validateFormData(formData);

  const handlePreview = () => {
    setShowPreview(!showPreview);
  };

  // Guardar menú Y categorías nuevas
  const handleSave = async () => {
    try {
      setIsSaving(true);
      setSaveError("");

      // 1. Guardar o actualizar el menú
      let currentMenuId = menuId;
      if (isCreating) {
        const createdMenu = await createMenu(formData);
        currentMenuId = String(createdMenu.id);
      } else {
        await updateMenu(menuId!, formData);
      }

      // 2. Guardar categorías nuevas
      const newCategories = categories.filter((cat) => cat.isNew);

      for (const category of newCategories) {
        if (category.title.trim()) {
          await createCategory(Number(currentMenuId), {
            title: category.title,
            items: [],
          });
        }
      }

      setHasUnsavedChanges(false);
      router.push("/");
    } catch (err) {
      setSaveError("Error al guardar el menú y/o categorías");
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  // Eliminar menú
  const handleDeleteMenu = async (id: number) => {
    try {
      await deleteMenu(id);
      router.push("/");
    } catch (error) {
      setSaveError("Error al eliminar el menú");
    }
  };

  // ============================================
  // LOADING STATE
  // ============================================
  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-slate-400">Cargando menú...</p>
        </div>
      </div>
    );
  }*/}

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-[#FFF3EC] to-[#FFE6D3] w-full  pb-25">
      {/* Navbar */}
      <NavbarEditor
      />
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
            onImagesSubmit={reciveRestaurantImages}
          />
          
          {/*Información básica */} 
          <InfoEditor
          onInfoSubmit={reciveRestaurantInformation}
          />
          {/* Colores */}
          <ColorEditor
            onColorsChange={reciveRestaurantColors}
          />
          <div className="py-1"></div>
          {/* Categorías y Platos 
         <div className="bg-white/80 backdrop-blur-xl border border-slate-200 rounded-xl shadow-md overflow-hidden sm:rounded-2xl sm:shadow-lg">
  {/* Header 
  <div className="bg-gradient-to-b from-white/90 to-white/70 px-4 py-3 border-b border-slate-200 flex items-center justify-between">
    <h3 className="font-semibold text-slate-800 text-base sm:text-lg">
      Categorías y Platos
    </h3>
    <button
      onClick={handleAddCategory}
      className="flex items-center justify-center gap-2 px-3 py-2 bg-gradient-to-br from-orange-400 to-orange-500 
      hover:from-orange-500 hover:to-orange-600 active:scale-[0.97]
      text-white rounded-lg text-sm font-semibold shadow-md hover:shadow-lg transition-all"
    >
      <Plus className="w-4 h-4" />
      <span className="hidden sm:inline">Nueva Categoría</span>
    </button>
  </div>

  {/* Contenido 
  <div className="p-3 sm:p-5 space-y-4">
    {categories.map((category) => (
      <div
        key={category.id}
        className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden"
      >
        {/*onChange={(e) =>
              updateCategoryTitle(category.id, e.target.value)
            }
        {/* Nombre categoría 
        <div className="flex items-center gap-3 px-3 py-3 border-b border-slate-200 bg-slate-50/50">
          <GripVertical className="w-4 h-4 text-slate-400 flex-shrink-0" />
          <input
            type="text"
            value={category.title}
            
            placeholder="Ej: Entradas, Postres..."
            className="flex-1 bg-white border border-slate-200 text-slate-800 text-sm rounded-lg px-3 py-2 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition-all"
          />
          
         
          {/*<button
            onClick={() => deleteCategory(category.id)}
            className="p-2 text-red-500 hover:bg-red-100 rounded-md transition-all"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>

        {/* Items 
        {/*<div className="p-3 space-y-3">
          {category.items.map((item) => (
            <div
              key={item.id}
              className="bg-slate-50 rounded-lg p-3 border border-slate-200"
            >
              {/* Nombre del plato 
              <input
                type="text"
                value={item.title}
                onChange={(e) =>
                  updateItem(category.id, item.id, "title", e.target.value)
                }
                placeholder="Nombre del plato"
                className="w-full bg-white border border-slate-200 text-slate-800 text-sm rounded-lg px-3 py-2 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition-all"
              />

              {/* Descripción 
              <textarea
                value={item.description}
                onChange={(e) =>
                  updateItem(category.id, item.id, "description", e.target.value)
                }
                placeholder="Descripción (ingredientes, detalles...)"
                rows={2}
                className="w-full mt-2 bg-white border border-slate-200 text-slate-800 text-sm rounded-lg px-3 py-2 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 resize-none transition-all"
              />

              {/* Precio 
              <div className="relative mt-2">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">
                  $
                </span>
                <input
                  type="text"
                  value={item.price}
                  onChange={(e) =>
                    updateItem(category.id, item.id, "price", e.target.value)
                  }
                  placeholder="Precio"
                  className="w-full bg-white border border-slate-200 text-slate-800 text-sm rounded-lg pl-7 pr-3 py-2 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition-all"
                />
              </div>

              {/* Imagen 
              <input
                type="url"
                value={item.images[0]?.url || ""}
                onChange={(e) =>
                  updateItemImage(category.id, item.id, e.target.value)
                }
                placeholder="URL de imagen..."
                className="w-full mt-2 bg-white border border-slate-200 text-slate-800 text-sm rounded-lg px-3 py-2 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition-all"
              />

              {/* Eliminar plato 
              <button
                onClick={() => deleteItem(category.id, item.id)}
                className="w-full mt-3 py-2 text-red-500 hover:bg-red-100 rounded-lg transition-all text-xs font-medium flex items-center justify-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Eliminar plato
              </button>
            </div>
          ))}

          {/* Agregar plato 
          <button
            onClick={() => addItem(category.id)}
            className="w-full py-3 border-2 border-dashed border-slate-300 text-slate-500 hover:text-orange-500 hover:border-orange-400 rounded-lg transition-all text-sm font-medium flex items-center justify-center gap-2 bg-white"
          >
            <Plus className="w-4 h-4" />
            Agregar Plato
          </button>
        </div>
      </div>
    ))}

    {/* Sin categorías 
    {categories.length === 0 && (
      <div className="text-center py-12 px-4">
        <div className="w-14 h-14 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3 shadow-inner">
          <Plus className="w-7 h-7 text-slate-400" />
        </div>
        <p className="text-slate-600 text-base font-medium mb-1">
          No hay categorías aún
        </p>
        <p className="text-slate-500 text-sm">
          Toca “+” para comenzar a crear tu menú
        </p>
      </div>
    )}
  </div>
</div>

          {/* Eliminar menu 
          <button
            onClick={() => handleDeleteMenu(Number(menuId))}
            className="w-full py-4 mt-8 flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 active:bg-red-700 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg shadow-red-500/25"
          >
            <Trash2 size={18} />
            Eliminar Menú
          </button>*/}
        </div>
      </main>

      {/* Botones flotantes */}
      <FloatingActions
        
      />

      {/* Modal de Preview 
      {showPreview && (
        <div className="fixed inset-0 bg-black z-50 overflow-y-auto">
          <div className="sticky top-0 bg-white/10 backdrop-blur-md border-b border-white/20 z-10">
            <div className="px-4 py-3 flex items-center justify-between">
              <span className="text-white font-medium">Vista Previa</span>
              <button
                onClick={() => setShowPreview(false)}
                className="p-2 hover:bg-white/20 rounded-full transition-colors"
              >
                <X className="w-6 h-6 text-white" />
              </button>
            </div>
          </div>

          <div
            className="min-h-screen"
            style={{ backgroundColor: formData.color.primary }}
          >
            <div className="relative h-72 overflow-hidden">
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{
                  backgroundImage: formData.backgroundImage
                    ? `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.6)), url(${formData.backgroundImage})`
                    : `linear-gradient(135deg, ${formData.color.primary}, ${formData.color.secondary})`,
                }}
              />

              <div className="relative h-full flex flex-col items-center justify-center px-6">
                {formData.logo && (
                  <div className="w-28 h-28 mb-4 bg-white rounded-3xl flex items-center justify-center shadow-2xl overflow-hidden ring-4 ring-white/50">
                    <img
                      src={formData.logo}
                      alt="Logo"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                <h1 className="text-white text-4xl font-bold text-center drop-shadow-lg mb-2">
                  {formData.title || "Nombre del Menú"}
                </h1>
                <h2 className="text-white text-lg">
                  {formData.pos || "Ubicación / Puntos de Venta"}
                </h2>
              </div>
            </div>

            <div className="px-6 py-8 max-w-4xl mx-auto">
              {categories.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-white/70 text-lg">
                    No hay categorías ni platos para mostrar
                  </p>
                  <p className="text-white/50 text-sm mt-2">
                    Agrega categorías y platos para ver la vista previa
                  </p>
                </div>
              ) : (
                categories.map((category) => (
                  <div key={category.id} className="mb-8">
                    {category.title && (
                      <h2
                        className="text-2xl font-bold mb-6"
                        style={{ color: formData.color.secondary }}
                      >
                        {category.title}
                      </h2>
                    )}
                    <div className="space-y-4">
                      {category.items.length === 0 ? (
                        <p className="text-white/50 text-sm italic">
                          No hay platos en esta categoría
                        </p>
                      ) : (
                        category.items.map((item) => (
                          <div
                            key={item.id}
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
                                    style={{ color: formData.color.secondary }}
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
                                      e.target.style.display = "none";
                                      e.target.parentElement.classList.add(
                                        "bg-gradient-to-br",
                                        "from-slate-200",
                                        "to-slate-300",
                                        "flex",
                                        "items-center",
                                        "justify-center"
                                      );
                                      e.target.parentElement.innerHTML =
                                        '<span class="text-slate-400 text-xs font-medium">Sin imagen</span>';
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
              {/* Footer informativo
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
      )}*/}
    </div>
  );
};

{/*const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
      <p className="mt-4 text-gray-600">Cargando editor...</p>
    </div>
  </div>
);*/}

{/*const MenuEditor = () => {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <MenuEditorContent />
    </Suspense>
  );
};*/}

export default MenuEditorContent;
