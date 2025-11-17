"use client";

import React, { useEffect, useState, useCallback } from "react";
import { Card } from "@/common/components/ui/card";
import Image from "next/image";
import { BookImage } from "lucide-react";
import { Spinner } from "@/common/components/ui/spinner";
import { Button } from "@/common/components/ui/button";
import { motion } from "framer-motion";
import { ImageIcon } from "lucide-react";
import InfoDialog from "./components/InfoDialog";
import { getMenu } from "@/common/utils/api";
import { Menu } from "@/interfaces/menu";

interface InfoEditorProps {
  menuId: number;
}

const MenuInfoPage = ({ menuId }: InfoEditorProps) => {
  // estado del menuId seleccionado
  const [currentMenuId, setCurrentMenuId] = useState<number | undefined>(
    menuId
  );
  // estado para el menú
  const [menu, setMenu] = useState<Menu>({} as Menu);
  // estado de carga
  const [loading, setLoading] = useState(true);
  // estado para determinar si es un menú vacío (nuevo)
  const [isEmpty, setIsEmpty] = useState<boolean>(false);

  /*const [newMenuTitle, setNewMenuTitle] = useState<string>(""); // Título del nuevo menú
  const [newMenuLogo, setNewMenuLogo] = useState<string>("");*/

  // 🔥 Función para cargar/recargar el menú desde la API
  const fetchMenuData = useCallback(async (id?: number) => {
    console.log("📥 Intentando cargar menu con ID:", id);

    //si no hay menu
    if (!id) {
      setIsEmpty(true);
      setLoading(false);
      return;
    }

    setLoading(true);
    //si hay menu
    try {
      const [menuData] = await Promise.all([
        getMenu(id),
        new Promise((resolve) => setTimeout(resolve, 2000)), // Delay de 2 segundos
      ]);
      console.log("📥 Menú cargado:", menuData);
      setMenu(menuData);
      setIsEmpty(false);
    } catch (error) {
      console.error("❌ Error al obtener el menú", error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Llamada inicial a la API para obtener el menú
  useEffect(() => {
    console.log("🔍 Menu ID recibido:", menuId);
    setCurrentMenuId(menuId);
    fetchMenuData(menuId);
  }, [menuId, fetchMenuData]);

  //Crea el menu y lo actualiza

  const handleMenuCreated = (newId: number) => {
    console.log("🎉 Menú creado con ID:", newId);
    setCurrentMenuId(newId);
    fetchMenuData(newId);
  };

  // 🎯 Función que se pasa al hijo para que notifique cambios
  const handleMenuUpdated = () => {
    console.log("🔄 Menú actualizado, recargando...");
    fetchMenuData(currentMenuId); // Vuelve a hacer la petición GET
  };

  if (loading) {
    return (
      <div className="w-full flex justify-center items-center">
        <Spinner className="w-12 h-12 text-orange-500" />
      </div>
    );
  }
  // si NO hay menu en la BD, renderiza esto:
  if (isEmpty) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="w-full px-4"
      >
        <Card className="bg-white/80 backdrop-blur-sm border border-slate-200/50 rounded-2xl shadow-md p-6 w-full max-w-sm mx-auto">
          <div className="flex flex-col items-center text-center py-10 space-y-4">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.35 }}
            >
              <ImageIcon className="w-16 h-16 text-slate-300" />
            </motion.div>

            <h3 className="text-lg font-semibold text-slate-800">
              Sin información
            </h3>

            <p className="text-sm text-slate-500 max-w-[260px] leading-relaxed">
              Todavía no cargaste un logo ni un título. Podés configurarlos
              desde el botón editar.
            </p>

            <InfoDialog
              menuId={currentMenuId}
              onCreated={handleMenuCreated}
              trigger={
                <Button className="w-full mt-3 bg-orange-500 text-white py-6 rounded-xl">
                  Editar
                </Button>
              }
            />
          </div>
        </Card>
      </motion.div>
    );
  }
  // renderizado NORMAL
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="w-full px-4"
    >
      <Card className="bg-white/80 backdrop-blur-sm border border-slate-200/50 rounded-2xl shadow-md p-6 w-full max-w-sm mx-auto">
        <div className="text-center mb-4">
          <p className="text-sm font-medium text-slate-500 uppercase tracking-wider mb-2">
            Información del menú
          </p>
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight">
            {menu.title}
          </h2>
        </div>

        {/* Logo */}
        <div className="flex flex-col items-center space-y-4 mb-3">
          <div
            className={`w-32 h-32 rounded-full overflow-hidden flex items-center justify-center 
              transition-all duration-300 transform
              ${
                menu.logo
                  ? "ring-4 ring-slate-200 shadow-xl"
                  : "border-4 border-dashed border-slate-300 bg-slate-50 shadow-lg"
              }`}
          >
            {menu.logo ? (
              <Image
                src={menu.logo}
                alt="Logo preview"
                width={100}
                height={100}
                className="w-full h-full object-cover"
              />
            ) : (
              <BookImage className="w-8 h-8 text-slate-400" />
            )}
          </div>
        </div>
        {/* Botón Editar */}
        <InfoDialog
          menuId={currentMenuId}
          menuTitle={menu.title}
          menuPos={menu.pos}
          menuLogo={menu.logo}
          menuBackground={menu.backgroundImage}
          menuPrimary={menu.color?.primary}
          menuSecondary={menu.color?.secondary}
          onUpdated={handleMenuUpdated}
          trigger={
            <Button className="w-full mt-3 bg-orange-500 text-white py-6 rounded-xl">
              Editar
            </Button>
          }
        />
      </Card>
    </motion.div>
  );
};

export default MenuInfoPage;
