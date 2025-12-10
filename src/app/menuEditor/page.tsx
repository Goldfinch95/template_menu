"use client";

import React, { useCallback, useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Menu } from "@/interfaces/menu";
import { deleteMenu, getMenu } from "@/common/utils/api";
// subcomponentes
import NavbarEditor from "@/app/menuEditor/components/NavbarEditor";
import MenuInfo from "./components/menuInfo/page";
import MenuCatPage from "./components/menuCat/page";

import { Trash2, X, AlertTriangle } from "lucide-react";

import { motion } from "framer-motion";


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
import { Button } from "@/common/components/ui/button";

const MenuEditorContent = () => {

  // ---------- Router ----------
    const router = useRouter();
    const searchParams = useSearchParams();

  // Estado para el menú
  const [menu, setMenu] = useState<Menu>({} as Menu);
  // Cargar menú existente si hay id en los parámetros
  const fetchMenuData = useCallback(async (menuId: string) => {
    try {
      const menuData = await getMenu(menuId);
      setMenu(menuData);
      //console.log(menuData);
      // console.log("✅ Menú y categorías cargadas:", menuData.categories.length);
    } catch (err: unknown) {
      console.error("❌ Error al cargar el menú:", err);
    }
  }, []); // Dependencias vacías, ya que menuId viene del useEffect.

  // Cargar menú existente si hay id en los parámetros
  useEffect(() => {
    const menuId = searchParams.get("id");
    if (!menuId) return;

    // Llamamos a la función de carga
    fetchMenuData(menuId);
  }, [searchParams, fetchMenuData]);

  // Función que elimina el menú
  const handleDeleteMenu = async () => {
    const menuId = searchParams.get("id");
    if (!menuId) {
      alert("No se encontró el ID del menú");
      return;
    }

    try {
      await deleteMenu(menuId);
      router.push("/menuShowcase?menuDeleted=true");
    } catch {
      alert("Error al eliminar el menú");
    }
  };

  return (
    <main className="min-h-screen w-full bg-gradient-to-b from-white via-[#FFF3EC] to-[#FFE6D3] flex flex-col">
      {/* Navbar */}
      <NavbarEditor />
      {/* Contenido principal */}
      <motion.section
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="flex-1 w-full max-w-3xl mx-auto px-5 sm:px-6 lg:px-8 pt-6 pb-24 space-y-8"
      >
        <div className="space-y-8">
          {/* Sección de imágenes del menú */}
          <MenuInfo
            menuId={menu.id}
            onMenuCreated={(newMenuId) => {
              console.log("🔔 Abuelo notificado - Nuevo menú creado con ID:", newMenuId);
              // Actualiza
              router.push(`/menuEditor?id=${newMenuId}`);
              // Recarga
              fetchMenuData(String(newMenuId));
            }}
          />
          <MenuCatPage
            menuId={menu.id}
            menuCategories={menu.categories}
            onCategoryChange={() => fetchMenuData(String(menu.id))}
          />
          {/* Eliminar menú */}
          {menu?.id && (
            <div className="px-4 w-full">
              <Dialog>
                <DialogTrigger asChild>
                  <button className="w-full py-4 mt-8 flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 active:bg-red-700 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg shadow-red-500/25 max-w-sm mx-auto">
                    <Trash2 size={18} />
                    Eliminar Menú
                  </button>
                </DialogTrigger>

                <DialogContent className="max-w-sm rounded-2xl p-6 shadow-xl [&>button]:hidden">
                  <DialogClose className="absolute right-6 top-6 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground !flex items-center justify-center">
                    <X className="h-5 w-5 text-red-600" />
                  </DialogClose>

                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-red-600">
                      <AlertTriangle className="w-5 h-5" />
                      Eliminar menú
                    </DialogTitle>
                  </DialogHeader>

                  <DialogDescription className="text-base text-slate-600">
                    ¿Estás seguro de que deseas eliminar este menú? Esta acción no se puede deshacer.
                  </DialogDescription>

                  <DialogFooter className="flex justify-end gap-2 mt-4">
                    <DialogClose asChild>
                      <Button variant="outline">Cancelar</Button>
                    </DialogClose>

                    <Button
                      className="bg-red-600 hover:bg-red-700 text-white"
                      onClick={handleDeleteMenu}
                    >
                      Eliminar
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          )}
        </div>
      </motion.section>
    </main>
  );
};

// Componente wrapper con Suspense
export default function MenuEditor() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen w-full bg-gradient-to-b from-white via-[#FFF3EC] to-[#FFE6D3] flex items-center justify-center">
          <p className="text-lg text-gray-600">Cargando editor...</p>
        </div>
      }
    >
      <MenuEditorContent />
    </Suspense>
  );
}

