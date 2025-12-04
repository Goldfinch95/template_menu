"use client";

import React, { useEffect, useState, useCallback } from "react";
import { Card, CardHeader, CardContent } from "@/common/components/ui/card";
import Image from "next/image";
import { BookImage, Edit, QrCode } from "lucide-react";
import { Spinner } from "@/common/components/ui/spinner";
import { Button } from "@/common/components/ui/button";
import { motion } from "framer-motion";
import { ImageIcon } from "lucide-react";
import InfoDialog from "./components/InfoDialog";
import { getMenu } from "@/common/utils/api";
import { Menu } from "@/interfaces/menu";

interface InfoEditorProps {
  menuId: number;
  onMenuCreated: (newMenuId: number) => void;
}

const MenuInfoPage = ({ menuId, onMenuCreated }: InfoEditorProps) => {
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
    //console.log("📥 Intentando cargar menu con ID:", id);

    //si no hay menu
    if (!id) {
      setIsEmpty(true);
      setLoading(false);
      return;
    }

    setLoading(true);
    //si hay menu
    try {
      const [menuData] = await Promise.all([getMenu(id)]);
      //console.log("📥 Menú cargado:", menuData);
      setMenu(menuData);
      setIsEmpty(false);
    } catch {
      console.error("❌ Error al obtener el menú");
    } finally {
      setLoading(false);
    }
  }, []);

  // Llamada inicial a la API para obtener el menú
  useEffect(() => {
    //console.log("🔍 Menu ID recibido:", menuId);
    setCurrentMenuId(menuId);
    fetchMenuData(menuId);
  }, [menuId, fetchMenuData]);

  //Crea el menu y lo actualiza

  const handleMenuCreated = (newMenuId: number) => {
    //console.log("🎉 Menú creado con ID:", newMenuId);
    onMenuCreated(newMenuId);

    setCurrentMenuId(newMenuId);
    fetchMenuData(newMenuId);
  };

  // 🎯 Función que se pasa al hijo para que notifique cambios
  const handleMenuUpdated = () => {
    //console.log("🔄 Menú actualizado, recargando...");
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
              Todavía no creaste un menú. Podés empezar desde el botón Crear.
            </p>

            <InfoDialog
              menuId={currentMenuId}
              onCreated={handleMenuCreated}
              trigger={
                <Button className="w-full mt-3 bg-orange-500 text-white py-6 rounded-xl">
                  Crear
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
  <Card className="bg-white/80 backdrop-blur-sm border border-slate-200/50 rounded-2xl shadow-md pt-0 w-full max-w-sm mx-auto">
    <CardHeader className="bg-gradient-to-r from-orange-500 to-orange-600 text-white pt-6 pb-6 relative">
      <div className="text-left">
        <p className="text-xs font-semibold uppercase tracking-wider opacity-90 mb-1">
          Información del menú
        </p>
        <h2 className="text-3xl font-bold tracking-tight">{menu.title}</h2>
      </div>
      {/* Círculo blanco con icono centrado */}
      <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2">
        <div className="w-28 h-28 bg-white rounded-full flex items-center justify-center border-4 border-white">
          {/* logo */}
          <div
            className={`w-28 h-28 rounded-full overflow-hidden flex items-center justify-center 
              ${menu.logo ? "ring-2 ring-slate-200" : "border-2 border-dashed border-slate-300"}`}
          >
            {menu.logo ? (
              <Image
                src={menu.logo}
                alt="Logo preview"
                width={80}
                height={80}
                className="object-cover"
                priority
              />
            ) : (
              <BookImage className="w-12 h-12 text-slate-400" />
            )}
          </div>
        </div>
      </div>
    </CardHeader>
    <CardContent className="pt-10 pb-6 px-6">
      {/* Botones */}
      <div className="flex gap-4 pt-8">
  <div className="flex flex-col w-full">
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
        <Button className="w-full flex-col  h-25 bg-orange-500 text-white py-3 rounded-xl flex items-center justify-center">
          <Edit className="w-6 h-6" />
          Editar
        </Button>
      }
    />
  </div>
  <div className="flex flex-col w-full">
    <Button className=" flex-col w-full h-25 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-xl shadow-md transition-all duration-200 hover:shadow-lg flex items-center justify-center">
      <QrCode className="w-6 h-6" />
      Generar QR
    </Button>
  </div>
</div>
    </CardContent>
  </Card>
</motion.div>
  );
};

export default MenuInfoPage;

