"use client";

import React, { useState, useEffect, Suspense } from "react";
import { Button } from "@/common/components/ui/button";
import { useSearchParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Eye,
  AlertCircle,
  X,
  Plus,
  Trash2,
  GripVertical,
  ImagePlus,
  
} from "lucide-react";
import { Card } from "@/common/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/common/components/ui/tooltip";
import { Alert, AlertDescription } from "@/common/components/ui/alert";
import { Category, MenuItem, MenuItemImage, Menues } from "@/interfaces/menu";

// Componente interno que usa useSearchParams
const MenuEditorContent = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const menuId = searchParams.get("id");
  const menuTitle = searchParams.get("title");

  const [urlParams] = useState({
    id: menuId || "",
    title: menuTitle || "",
  });

  const isCreating = !urlParams.id;
  const pageTitle = isCreating ? "Creador de Menú" : "Editor de Menú";

  const [showPreview, setShowPreview] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [saveError, setSaveError] = useState("");

  const [menus, setMenus] = useState<Menues[]>([]);

  const [formData, setFormData] = useState({
    nombre: urlParams.title || "",
    pos: "",
    colorPrincipal: "",
    colorSecundario: "",
    logoUrl: "",
    backgroundUrl: "",
  });

  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const loadMenuData = async () => {
      if (!urlParams.id) return;
       // Si no hay ID, no cargar nada (modo creación)
      setIsLoading(true);
      try {
        const response = await fetch(
          `http://localhost:3000/api/menus/${urlParams.id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "x-tenant-subdomain": "amaxlote",
        },
      });

        if (!response.ok) {
          throw new Error("Error al cargar el menú");
        }

        const data = await response.json();
        console.log("✅ Menú cargado:", data);

        // Actualizar formData con los datos del menú
        setFormData({
          nombre: data.title || "",
          pos: data.pos || "",
          colorPrincipal: data.color?.primary || "",
          colorSecundario: data.color?.secondary || "",
          logoUrl: data.logo || "",
          backgroundUrl: data.backgroundImage || "",
        });

        //cargar categorias y items
        if (data.categories) {
          const loadedCategories: Category[] = data.categories.map((cat: any) => ({
            id: cat.id,
            menuId: cat.menuId,
            title: cat.title,
            active: cat.active,
            createdAt: cat.createdAt,
            updatedAt: cat.updatedAt,
            items: cat.items?.map((item: any) => ({
              id: item.id,
              categoryId: item.categoryId,
              title: item.title,
              description: item.description,
              price: item.price,
              active: item.active,
              createdAt: item.createdAt,
              updatedAt: item.updatedAt,
              images: item.images || []
            })) || []
          }));
          setCategories(loadedCategories);
        }
      } catch (error) {
        console.error("❌ Error:", error);
        setSaveError("Error al cargar el menú");
      } finally {
        setIsLoading(false);
      }
    };

    loadMenuData();
  }, [urlParams.id]);

  /* ============================================
   * CÓDIGO DE IMÁGENES LOCALES (COMENTADO)
   * Descomenta esto cuando quieras volver a subir archivos
   * ============================================
  
  const [previews, setPreviews] = useState({
    logo: "",
    background: "",
  });

  const [imageErrors, setImageErrors] = useState({
    logo: "",
    background: "",
  });

  const [imageSizes, setImageSizes] = useState({
    logo: { width: 0, height: 0, size: 0 },
    background: { width: 0, height: 0, size: 0 },
  });

  // Límites de tamaño
  const LIMITS = {
    logo: {
      minWidth: 200,
      maxWidth: 2000,
      minHeight: 200,
      maxHeight: 2000,
      maxSize: 2 * 1024 * 1024, // 2MB
    },
    background: {
      minWidth: 800,
      maxWidth: 4000,
      minHeight: 400,
      maxHeight: 4000,
      maxSize: 5 * 1024 * 1024, // 5MB
    },
  };

  const validateImage = (file, field) => {
    return new Promise((resolve) => {
      const img = new Image();
      const reader = new FileReader();

      reader.onloadend = () => {
        img.src = reader.result;
      };

      img.onload = () => {
        const width = img.width;
        const height = img.height;
        const size = file.size;
        const limits = LIMITS[field];

        let error = "";

        if (size > limits.maxSize) {
          error = `El archivo es muy pesado (${(size / 1024 / 1024).toFixed(
            2
          )}MB). Máximo ${limits.maxSize / 1024 / 1024}MB`;
        }
        else if (width < limits.minWidth || height < limits.minHeight) {
          error = `Imagen muy pequeña (${width}x${height}px). Mínimo ${limits.minWidth}x${limits.minHeight}px`;
        } else if (width > limits.maxWidth || height > limits.maxHeight) {
          error = `Imagen muy grande (${width}x${height}px). Máximo ${limits.maxWidth}x${limits.maxHeight}px`;
        }
        setImageSizes((prev) => ({
          ...prev,
          [field]: { width, height, size },
        }));

        resolve({ valid: !error, error, preview: reader.result });
      };

      reader.readAsDataURL(file);
    });
  };

  const handleImageChange = async (e, field) => {
    const file = e.target.files?.[0];
    if (file) {
      const validation = await validateImage(file, field);

      if (validation.valid) {
        setPreviews((prev) => ({ ...prev, [field]: validation.preview }));
        setImageErrors((prev) => ({ ...prev, [field]: "" }));
      } else {
        setImageErrors((prev) => ({ ...prev, [field]: validation.error }));
        setPreviews((prev) => ({ ...prev, [field]: "" }));
      }
    }
  };

  * FIN DEL CÓDIGO DE IMÁGENES LOCALES
  * ============================================ */


  // ============================================
  // FUNCIONES PARA CATEGORÍAS
  // ============================================
  const addCategory = () => {
    const newCategory: Category = {
      id: Date.now(),
      menuId: 0,
      title: '',
      active: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      items: []
    };
    
    setCategories([...categories, newCategory]);
  };

  const updateCategory = (categoryId: number, field: keyof Category, value: any) => {
    setCategories(categories.map(cat =>
      cat.id === categoryId 
        ? { 
            ...cat, 
            [field]: value,
            updatedAt: new Date().toISOString()
          } 
        : cat
    ));
  };

  const updateCategoryTitle = (categoryId: number, title: string) => {
    updateCategory(categoryId, 'title', title);
  };

  const deleteCategory = (categoryId: number) => {
    if (confirm('¿Eliminar esta categoría y todos sus platos?')) {
      setCategories(categories.filter(cat => cat.id !== categoryId));
    }
  };

  

  // ============================================
  // FUNCIONES PARA ITEMS (PLATOS)
  // ============================================
  const addItem = (categoryId: number) => {
    const newItem: MenuItem = {
      id: Date.now(),
      categoryId: categoryId,
      title: '',
      description: '',
      price: '',
      active: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      images: []
    };

    setCategories(categories.map(cat =>
      cat.id === categoryId
        ? {
            ...cat,
            items: [...cat.items, newItem],
            updatedAt: new Date().toISOString()
          }
        : cat
    ));
  };

  const updateItem = (
    categoryId: number, 
    itemId: number, 
    field: keyof MenuItem, 
    value: any
  ) => {
    setCategories(categories.map(cat =>
      cat.id === categoryId
        ? {
            ...cat,
            items: cat.items.map(item =>
              item.id === itemId 
                ? { 
                    ...item, 
                    [field]: value,
                    updatedAt: new Date().toISOString()
                  } 
                : item
            ),
            updatedAt: new Date().toISOString()
          }
        : cat
    ));
  };

  const deleteItem = (categoryId: number, itemId: number) => {
    if (confirm('¿Eliminar este plato?')) {
      setCategories(categories.map(cat =>
        cat.id === categoryId
          ? {
              ...cat,
              items: cat.items.filter(item => item.id !== itemId),
              updatedAt: new Date().toISOString()
            }
          : cat
      ));
    }
  };
// ============================================
  // FUNCIONES PARA IMÁGENES
  // ============================================
  const updateItemImage = (categoryId: number, itemId: number, imageUrl: string) => {
    setCategories(categories.map(cat =>
      cat.id === categoryId
        ? {
            ...cat,
            items: cat.items.map(item =>
              item.id === itemId
                ? {
                    ...item,
                    images: imageUrl ? [{
                      id: Date.now(),
                      itemId: item.id,
                      url: imageUrl,
                      alt: item.title,
                      sortOrder: 0,
                      active: true,
                      createdAt: new Date().toISOString(),
                      updatedAt: new Date().toISOString()
                    }] : [],
                    updatedAt: new Date().toISOString()
                  }
                : item
            )
          }
        : cat
    ));
  };

  // ============================================
  // FUNCIONES AUXILIARES
  // ============================================
  const handleViewMenu = () => {
    router.push(
      `/menu?id=${menuId}&title=${encodeURIComponent(menuTitle || "")}`
    );
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const canSave = () => {
    if (!formData.nombre.trim()) return false;
    try {
      if (formData.logoUrl) new URL(formData.logoUrl);
      if (formData.backgroundUrl) new URL(formData.backgroundUrl);
    } catch {
      return false;
    }
    return true;
  };

   // ============================================
// GUARDAR MENÚ
// ============================================
const handleSave = async () => {
  try {
    setIsSaving(true);
    setSaveError("");

    // Si NO hay id, es un nuevo menú -> hacer POST
    if (!urlParams.id) {
      const response = await fetch("http://localhost:3000/api/menus/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-tenant-subdomain": "amaxlote",
        },
        body: JSON.stringify({
          title: formData.nombre,
          logo: formData.logoUrl,
          backgroundImage: formData.backgroundUrl,
          color: {
            primary: formData.colorPrincipal,
            secondary: formData.colorSecundario,
          },
          pos: formData.pos,
        }),
      });

      if (!response.ok) {
        throw new Error("Error al crear el menú");
      }

      const data = await response.json();
      console.log("✅ Menú creado exitosamente:", data);

      // Redirigir al editor con el nuevo id
      router.push("/");
      
    } else {
      console.log(urlParams.id)
      // Si hay id, es una actualización -> hacer PUT/PATCH
      const response = await fetch(`http://localhost:3000/api/menus/${urlParams.id}`, {
        method: "PUT", // o "PATCH" dependiendo de tu API
        headers: {
          "Content-Type": "application/json",
          "x-tenant-subdomain": "amaxlote",
        },
        body: JSON.stringify({
          title: formData.nombre,
          logo: formData.logoUrl,
          backgroundImage: formData.backgroundUrl,
          color: {
            primary: formData.colorPrincipal,
            secondary: formData.colorSecundario,
          },
          pos: formData.pos,
        }),
      });
       if (!response.ok) {
        throw new Error("Error al actualizar el menú");
      }

      const data = await response.json();
      console.log("✅ Menú actualizado exitosamente:", data);

      // Redirigir a la página principal
      router.push("/");
    }
  } catch (err) {
    console.error(
      "❌ Error al guardar el menú:",
      err instanceof Error ? err.message : "Error desconocido"
    );
    setSaveError(err instanceof Error ? err.message : "Error al guardar el menú");
  } finally {
    setIsSaving(false);
  }
};
  
//borrar menu
// Función para eliminar el menú
const handleDeleteMenu = async (menuId: number) => {
  // Opcional: confirmar antes de eliminar
  if (!window.confirm("¿Estás seguro de que deseas eliminar este menú?")) {
    return;
  }

  console.log(`${menuId}`)
  try {
    const response = await fetch(`http://localhost:3000/api/menus/${menuId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "x-tenant-subdomain": "amaxlote",
      },
    });

    if (!response.ok) {
      throw new Error(`Error al eliminar el menú: ${response.status}`);
    }

    console.log("Menú eliminado exitosamente");

    // Actualizar el estado local removiendo el menú eliminado
    setMenus((prevMenus) => prevMenus.filter((menu) => menu.id !== menuId));

    // Opcional: mostrar mensaje de éxito
    // toast.success("Menú eliminado exitosamente");
// Redirigir a la página principal
      router.push("/");
  } catch (err) {
    console.error(
      "Error al eliminar el menú:",
      err instanceof Error ? err.message : "Error desconocido"
    );
    // Opcional: mostrar mensaje de error
    // toast.error("No se pudo eliminar el menú");
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
  }

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Navbar */}
      <nav className="sticky top-0 z-20 bg-slate-950/95 backdrop-blur-lg border-b border-slate-800">
        <div className="px-6 py-4">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                className="text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors"
                onClick={() => window.history.back()}
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div>
                <h1 className="text-xl font-bold text-white flex items-center gap-2">
                  {pageTitle}
                </h1>
              </div>
            </div>
            {!isCreating && menuId && (
              <Button
                onClick={handleViewMenu}
                className="bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700 text-white rounded-xl shadow-lg shadow-blue-500/20"
              >
                <Eye className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      </nav>

      {/* Contenido principal */}
      <main className="px-6 py-6 pb-32 max-w-4xl mx-auto">
        <div className="space-y-6">
          {/* Alert de error */}
          {saveError && (
            <Alert variant="destructive" className="bg-red-950/50 border-red-900">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{saveError}</AlertDescription>
            </Alert>
          )}

          {/* Sección de URLs de imágenes */}
          <Card className="bg-slate-900/50 border-slate-800 backdrop-blur-sm">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-semibold text-white text-lg">
                  URLs de Imágenes
                </h3>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <AlertCircle className="w-5 h-5 text-slate-500 cursor-help hover:text-slate-400 transition-colors" />
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs bg-slate-800 border-slate-700">
                      <p className="font-semibold mb-2 text-white">
                        Ingresa URLs de imágenes:
                      </p>
                      <p className="text-xs mb-1 text-slate-300">
                        📷 Logo: Imagen cuadrada (256x256 recomendado)
                      </p>
                      <p className="text-xs text-slate-300">
                        🖼️ Fondo: Imagen horizontal (1200x600 recomendado)
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>

              <div className="space-y-5">
                <div>
                  <label htmlFor="logoUrl" className="block text-sm font-medium text-slate-300 mb-2">
                    URL del Logo
                  </label>
                  <input
                    id="logoUrl"
                    name="logoUrl"
                    type="url"
                    value={formData.logoUrl}
                    onChange={handleInputChange}
                    placeholder="https://ejemplo.com/logo.png"
                    className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>

                <div>
                  <label htmlFor="backgroundUrl" className="block text-sm font-medium text-slate-300 mb-2">
                    URL de Imagen de Fondo
                  </label>
                  <input
                    id="backgroundUrl"
                    name="backgroundUrl"
                    type="url"
                    value={formData.backgroundUrl}
                    onChange={handleInputChange}
                    placeholder="https://ejemplo.com/fondo.png"
                    className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>
            </div>
          </Card>

          {/* Información básica */}
          <Card className="bg-slate-900/50 border-slate-800 backdrop-blur-sm">
            <div className="p-6">
              <h3 className="font-semibold text-white text-lg mb-6">
                Información del Restaurante
              </h3>

              <div className="space-y-5">
                <div>
                  <label htmlFor="nombre" className="block text-sm font-medium text-slate-300 mb-2">
                    Nombre del Menú *
                  </label>
                  <input
                    id="nombre"
                    name="nombre"
                    type="text"
                    value={formData.nombre}
                    onChange={handleInputChange}
                    placeholder="Ej: Restaurante El Buen Sabor"
                    className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>

                <div>
                  <label htmlFor="pos" className="block text-sm font-medium text-slate-300 mb-2">
                    Ubicación / Puntos de Venta
                  </label>
                  <input
                    id="pos"
                    name="pos"
                    type="text"
                    value={formData.pos}
                    onChange={handleInputChange}
                    placeholder="Ej: Av. Principal 123, Centro"
                    className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>
            </div>
          </Card>

          {/* Colores */}
          <Card className="bg-slate-900/50 border-slate-800 backdrop-blur-sm">
            <div className="p-6">
              <h3 className="font-semibold text-white text-lg mb-6">
                Personalización de Colores
              </h3>

              <div className="grid md:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="colorPrincipal" className="block text-sm font-medium text-slate-300 mb-3">
                    Color Principal
                  </label>
                  <div className="flex gap-3">
                    <div className="relative">
                      <input
                        id="colorPrincipal"
                        name="colorPrincipal"
                        type="color"
                        value={formData.colorPrincipal}
                        onChange={handleInputChange}
                        className="h-12 w-14 rounded-xl border-2 border-slate-700 cursor-pointer bg-slate-800"
                      />
                    </div>
                    <input
                      type="text"
                      value={formData.colorPrincipal}
                      onChange={handleInputChange}
                      name="colorPrincipal"
                      className="flex-1 px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all font-mono text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="colorSecundario" className="block text-sm font-medium text-slate-300 mb-3">
                    Color Secundario
                  </label>
                  <div className="flex gap-3">
                    <div className="relative">
                      <input
                        id="colorSecundario"
                        name="colorSecundario"
                        type="color"
                        value={formData.colorSecundario}
                        onChange={handleInputChange}
                        className="h-12 w-14 rounded-xl border-2 border-slate-700 cursor-pointer bg-slate-800"
                      />
                    </div>
                    <input
                      type="text"
                      value={formData.colorSecundario}
                      onChange={handleInputChange}
                      name="colorSecundario"
                      className="flex-1 px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all font-mono text-sm"
                    />
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Categorías y Platos */}
          <div className="bg-slate-900/50 border border-slate-800 backdrop-blur-sm rounded-xl overflow-hidden">
            <div className="bg-slate-800/50 px-4 sm:px-6 py-4 border-b border-slate-700">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-white text-base sm:text-lg">
                  Categorías y Platos
                </h3>
                <button
                  onClick={addCategory}
                  className="flex items-center gap-2 px-3 sm:px-4 py-2.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white rounded-xl text-sm font-semibold shadow-lg shadow-blue-500/20 transition-all"
                >
                  <Plus className="w-4 h-4" />
                  <span className="hidden sm:inline">Nueva Categoría</span>
                  <span className="sm:hidden">Nueva</span>
                </button>
              </div>
            </div>

            <div className="p-3 sm:p-6 space-y-4">
              {categories.map((category) => (
                <div
                  key={category.id}
                  className="bg-slate-800/40 backdrop-blur rounded-2xl border border-slate-700 overflow-hidden"
                >
                  <div className="bg-slate-800/50 px-4 py-3 flex items-center gap-3 border-b border-slate-700">
                    <GripVertical className="w-5 h-5 text-slate-500 flex-shrink-0" />
                    <input
                      type="text"
                      value={category.title}
                      onChange={(e) => updateCategoryTitle(category.id, e.target.value)}
                      placeholder="Ej: Entradas, Postres..."
                      className="flex-1 bg-transparent text-white font-semibold text-base placeholder-slate-500 focus:outline-none"
                    />
                    <button
                      onClick={() => deleteCategory(category.id)}
                      className="p-2 text-red-400 hover:bg-red-950/30 rounded-lg active:scale-95 transition-all flex-shrink-0"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="p-3 space-y-3">
                    {category.items.map((item) => (
                      <div
                        key={item.id}
                        className="bg-slate-900/50 rounded-xl p-3 border border-slate-700/50"
                      >
                        <input
                          type="text"
                          value={item.title}
                          onChange={(e) => updateItem(category.id, item.id, 'title', e.target.value)}
                          placeholder="Nombre del plato"
                          className="w-full bg-slate-700/50 text-white font-medium px-3 py-2.5 rounded-lg placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-slate-700 transition-all text-sm"
                        />

                        <textarea
                          value={item.description}
                          onChange={(e) => updateItem(category.id, item.id, 'description', e.target.value)}
                          placeholder="Descripción (ingredientes, detalles...)"
                          rows={2}
                          className="w-full mt-2 bg-slate-700/50 text-white px-3 py-2.5 rounded-lg placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-slate-700 resize-none transition-all text-sm"
                        />

                        <div className="mt-2">
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-medium text-sm">
                              $
                            </span>
                            <input
                              type="text"
                              value={item.price}
                              onChange={(e) => updateItem(category.id, item.id, 'price', e.target.value)}
                              placeholder="Precio"
                              className="w-full bg-slate-700/50 text-white font-semibold pl-7 pr-3 py-2.5 rounded-lg placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-slate-700 transition-all text-sm"
                            />
                          </div>
                        </div>

                        <div className="mt-2">
                          <div className="flex items-center gap-2 bg-slate-700/30 rounded-lg p-2 border border-slate-700 border-dashed">
                            <input
                              type="url"
                              value={item.images[0]?.url || ''}
                              onChange={(e) => updateItemImage(category.id, item.id, e.target.value)}
                              placeholder="Pega URL de imagen..."
                              className="flex-1 bg-transparent text-white text-sm placeholder-slate-500 focus:outline-none"
                            />
                          </div>
                        </div>

                        <button
                          onClick={() => deleteItem(category.id, item.id)}
                          className="w-full mt-3 py-2 text-red-400 hover:bg-red-950/30 rounded-lg transition-all text-sm font-medium flex items-center justify-center gap-2"
                        >
                          <Trash2 className="w-4 h-4" />
                          Eliminar plato
                        </button>
                      </div>
                    ))}

                    <button
                      onClick={() => addItem(category.id)}
                      className="w-full py-3 border-2 border-dashed border-slate-700 text-slate-400 hover:text-blue-400 hover:border-blue-600 rounded-xl transition-all text-sm font-medium flex items-center justify-center gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      Agregar Plato
                    </button>
                  </div>
                </div>
              ))}

              {categories.length === 0 && (
                <div className="text-center py-16 px-6">
                  <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Plus className="w-8 h-8 text-slate-600" />
                  </div>
                  <p className="text-slate-400 text-base font-medium mb-2">
                    No hay categorías aún
                  </p>
                  <p className="text-slate-500 text-sm">
                    Toca "Nueva Categoría" para comenzar a crear tu menú
                  </p>
                </div>
              )}
            </div>
          </div>
          <button
  onClick={() => handleDeleteMenu(Number(menuId))}
  className="mt-4 flex items-center justify-center gap-2 w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded transition-colors"
>
  <Trash2 size={18} />
  Eliminar Menú
</button>
        </div>
      </main>

      {/* Botones flotantes */}
      <div className="fixed bottom-0 left-0 right-0 p-6 bg-slate-950/95 backdrop-blur-lg border-t border-slate-800 shadow-2xl">
        <div className="max-w-4xl mx-auto flex gap-4">
          <Button
            onClick={() => setShowPreview(true)}
            className="flex-1 h-14 bg-slate-800 hover:bg-slate-700 text-white rounded-2xl font-semibold text-base transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] border border-slate-700"
          >
            Vista Previa
          </Button>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex-1">
                  <Button
                    onClick={handleSave}
                    disabled={!canSave() || isSaving}
                    className={`w-full h-14 rounded-2xl font-semibold text-base transition-all duration-300 ${
                      canSave() && !isSaving
                        ? "bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700 text-white shadow-lg shadow-blue-500/20 hover:scale-[1.02] active:scale-[0.98]"
                        : "bg-slate-800 text-slate-600 cursor-not-allowed border border-slate-700"
                    }`}
                  >
                    {isSaving ? "Guardando..." : isCreating ? "Crear Menú" : "Guardar Cambios"}
                  </Button>
                </div>
              </TooltipTrigger>
              {!canSave() && !isSaving && (
                <TooltipContent className="bg-slate-800 border-slate-700">
                  <p className="text-xs text-slate-300">
                    Completa el nombre y URLs válidas
                  </p>
                </TooltipContent>
              )}
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      {/* Modal de Preview */}
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

          <div className="min-h-screen" style={{ backgroundColor: formData.colorPrincipal }}>
            <div className="relative h-72 overflow-hidden">
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{
                  backgroundImage: formData.backgroundUrl
                    ? `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.6)), url(${formData.backgroundUrl})`
                    : `linear-gradient(135deg, ${formData.colorPrincipal}, ${formData.colorSecundario})`,
                }}
              />

              <div className="relative h-full flex flex-col items-center justify-center px-6">
                {formData.logoUrl && (
                  <div className="w-28 h-28 mb-4 bg-white rounded-3xl flex items-center justify-center shadow-2xl overflow-hidden ring-4 ring-white/50">
                    <img src={formData.logoUrl} alt="Logo" className="w-full h-full object-cover" />
                  </div>
                )}

                <h1 className="text-white text-4xl font-bold text-center drop-shadow-lg mb-2">
                  {formData.nombre || "Nombre del Menú"}
                </h1>
                <h2 className="text-white text-lg">{formData.pos || "Ubicación / Puntos de Venta"}</h2>
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
                      <h2 className="text-2xl font-bold mb-6" style={{ color: formData.colorSecundario }}>
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
                                  <p className="text-xl font-bold" style={{ color: formData.colorSecundario }}>
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
                                      e.target.style.display = 'none';
                                      e.target.parentElement.classList.add('bg-gradient-to-br', 'from-slate-200', 'to-slate-300', 'flex', 'items-center', 'justify-center');
                                      e.target.parentElement.innerHTML = '<span class="text-slate-400 text-xs font-medium">Sin imagen</span>';
                                    }}
                                  />
                                ) : (
                                  <div className="w-full h-full bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center">
                                    <span className="text-slate-400 text-xs font-medium">Sin imagen</span>
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

const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
      <p className="mt-4 text-gray-600">Cargando editor...</p>
    </div>
  </div>
);

const MenuEditor = () => {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <MenuEditorContent />
    </Suspense>
  );
};

export default MenuEditor;
