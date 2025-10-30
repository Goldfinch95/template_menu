"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { NewCategoryPayload, Menues, Category } from "@/interfaces/menu";
import {
  getMenu,
  createCategory,
  updateMenu,
} from "@/common/utils/api";
import { Alert, AlertDescription } from "@/common/components/ui/alert";
import NavbarEditor from "@/app/menuEditor/components/NavbarEditor";
import CategoryEditor from "./components/CategoryEditor";
import MenuInfoEditor from "./components/MenuInfoEditor";
import ExistingCategoriesView from "./components/ExistingCategoriesView";
import { AlertCircle } from "lucide-react";

const MenuEditorContent = () => {
  const searchParams = useSearchParams();
  const menuId = searchParams.get("id");

  // Estado para datos del menú
  const [menuData, setMenuData] = useState<Partial<Menues>>({
    title: "",
    pos: "",
    logo: "",
    backgroundImage: "",
    color: {
      primary: "#FF6B35",
      secondary: "#FFB830"
    }
  });

  // Estado para categorías existentes
  const [existingCategories, setExistingCategories] = useState<Category[]>([]);

  // Estado para acumular categorías nuevas
  const [accumulatedCategories, setAccumulatedCategories] = useState<NewCategoryPayload[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [saveError, setSaveError] = useState("");

  const handleCategorySubmit = (category: NewCategoryPayload) => {
    // Acumular categorías para guardar después
    setAccumulatedCategories(prev => [...prev, category]);
    console.log("Categoría agregada:", category);
    console.log("Total de categorías acumuladas:", accumulatedCategories.length + 1);
  };

  // Cargar datos del menú
  useEffect(() => {
    if (!menuId) return;

    const loadMenu = async () => {
      setIsLoading(true);
      try {
        const menu = await getMenu(menuId);
        console.log("Menú cargado:", menu);

        // Cargar datos del menú en el estado
        setMenuData({
          title: menu.title,
          pos: menu.pos,
          logo: menu.logo,
          backgroundImage: menu.backgroundImage,
          color: {
            primary: menu.color?.primary || "#FF6B35",
            secondary: menu.color?.secondary || "#FFB830"
          }
        });

        // Cargar categorías existentes
        if (menu.categories && menu.categories.length > 0) {
          setExistingCategories(menu.categories);
          console.log(`📋 ${menu.categories.length} categoría(s) existente(s) cargadas`);
        }

        setSaveError("");
      } catch (error) {
        console.error("Error al cargar el menú:", error);
        setSaveError("No se pudo cargar el menú. Verifica que el ID sea correcto.");
      } finally {
        setIsLoading(false);
      }
    };

    loadMenu();
  }, [menuId]);

  const handleSaveAll = async () => {
    if (!menuId) {
      alert("No se encontró el ID del menú");
      return;
    }

    try {
      console.log("Guardando cambios del menú y categorías...");

      // 1. Actualizar datos del menú
      await updateMenu(menuId, menuData);
      console.log("✅ Menú actualizado");

      // 2. Guardar categorías nuevas
      if (accumulatedCategories.length > 0) {
        for (const category of accumulatedCategories) {
          await createCategory(category);
        }
        console.log(`✅ ${accumulatedCategories.length} categoría(s) creadas`);
      }

      alert(`✅ Cambios guardados exitosamente!\n- Menú actualizado\n- ${accumulatedCategories.length} categoría(s) creada(s)`);

      // Limpiar el estado de categorías después de guardar
      setAccumulatedCategories([]);
    } catch (error) {
      console.error("Error al guardar:", error);
      alert("❌ Error al guardar los cambios. Ver consola para más detalles.");
    }
  };

  // Estado de loading
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white via-[#FFF3EC] to-[#FFE6D3] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-slate-600">Verificando menú...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-[#FFF3EC] to-[#FFE6D3] w-full pb-25">
      {/* Navbar */}
      <NavbarEditor />

      {/* Contenido principal */}
      <main className="max-w-3xl mx-auto w-full px-5 sm:px-6 lg:px-8 py-10 space-y-8">
        <div className="space-y-6">
          {/* Alert de error */}
          {saveError && (
            <Alert
              variant="destructive"
              className="bg-red-950/50 border border-red-900/70 backdrop-blur-sm"
            >
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{saveError}</AlertDescription>
            </Alert>
          )}

          {menuId ? (
            <>
              {/* Información del Menú */}
              <MenuInfoEditor
                menuData={menuData}
                onMenuDataChange={setMenuData}
              />

              {/* Categorías Existentes */}
              <ExistingCategoriesView categories={existingCategories} />

              {/* Agregar Nuevas Categorías */}
              <CategoryEditor
                onCategorySubmit={handleCategorySubmit}
                menuId={Number(menuId)}
              />
            </>
          ) : (
            <div className="text-center py-12 text-slate-600">
              <p>No se encontró un ID de menú válido</p>
            </div>
          )}

          {/* Botón Guardar Todo */}
          {menuId && (
            <div className="mt-6">
              <button
                onClick={handleSaveAll}
                className="w-full bg-gradient-to-br from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold py-3 px-6 rounded-xl transition-colors shadow-lg"
              >
                {accumulatedCategories.length > 0
                  ? `Guardar Todo (Menú + ${accumulatedCategories.length} categoría${accumulatedCategories.length !== 1 ? 's' : ''})`
                  : 'Guardar Cambios del Menú'
                }
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default MenuEditorContent;
