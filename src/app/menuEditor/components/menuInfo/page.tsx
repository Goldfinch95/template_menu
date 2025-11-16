//este componente debe:
//1. mostrar el nombre y logo del menu
//2.abrir un modal (InfoDialog)
//3. RECIBIR DEL PADRE los datos del menu.

"use client";

import React, { useEffect, useState, useCallback } from "react";
import { Input } from "@/common/components/ui/input";
import { Label } from "@radix-ui/react-label";
import { Card } from "@/common/components/ui/card";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
} from "@/common/components/ui/dialog";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/common/components/ui/alert";
import Image from "next/image";
import { BookImage } from "lucide-react";
import { Spinner } from "@/common/components/ui/spinner";
import { Button } from "@/common/components/ui/button";
import { motion } from "framer-motion";
import { ImageIcon, Edit3, X, Check } from "lucide-react";
import InfoDialog from "./components/InfoDialog";
import { getMenu } from "@/common/utils/api";
import { Menu } from "@/interfaces/menu";

interface InfoEditorProps {
  menuId: number;
}

const MenuInfoPage = ({ menuId }: InfoEditorProps) => {
  // estado para el menú
  const [menu, setMenu] = useState<Menu>({} as Menu);
  // estado para el preview de logo
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  // estado de carga del logo
  const [loadingLogo, setLoadingLogo] = useState(false);
  // estado de carga
  const [loading, setLoading] = useState(true);
  // estado para determinar si es un menú vacío (nuevo)
  const [isEmpty, setIsEmpty] = useState<boolean>(false);

  const [newMenuTitle, setNewMenuTitle] = useState<string>(""); // Título del nuevo menú
  const [newMenuLogo, setNewMenuLogo] = useState<string>("");

  // 🔥 Función para cargar/recargar el menú desde la API
  const fetchMenuData = useCallback(async () => {
    console.log("el menu es", menuId);
    //si no hay menu
    if (!menuId) {
      setIsEmpty(true);
      setLoading(false);
      return;
    }

    setLoading(true);
    //si hay menu
    try {
      const [menuData] = await Promise.all([
        getMenu(menuId),
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
  }, [menuId]);

  // Llamada inicial a la API para obtener el menú
  useEffect(() => {
    console.log("🔍 Menu ID recibido:", menuId);
    fetchMenuData();
  }, [menuId, fetchMenuData]);

  const handleMenuCreated = (menuTitle: string, menuLogo: string) => {
    console.log(menuTitle);
    setNewMenuTitle(menuTitle);
    setNewMenuLogo(menuLogo);
    setIsEmpty(false);
  };

  // 🎯 Función que se pasa al hijo para que notifique cambios
  const handleMenuUpdated = () => {
    console.log("🔄 Hijo notificó cambios, recargando menú...");
    fetchMenuData(); // Vuelve a hacer la petición GET
  };

  if (loading) {
    return (
      <div className="w-full flex justify-center items-center">
        <Spinner className="w-12 h-12 text-orange-500" />
      </div>
    );
  }

  /* // Estados para el logo y la imagen de fondo
  const [logoFile, setLogoFile] = useState<File | null>(logo || null);
  const [backgroundFile, setBackgroundFile] = useState<File | null>(
    background || null
  );
  //estados para el PREVIEW del logo y la imagen de fondo
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [backgroundPreview, setBackgroundPreview] = useState<string | null>(
    null
  );

  //estados de CARGA de logo y la imagen de fondo.
  const [loadingLogo, setLoadingLogo] = useState(false);
  const [loadingBackground, setLoadingBackground] = useState(false);

  //cargar logo y imagen de fondo.
  useEffect(() => {
    // Si existe alguno, activar los estados de carga
    if (logo) setLoadingLogo(true);
    if (background) setLoadingBackground(true);

    // Espera al menos 0.7s antes de mostrarlos.
    const timer = setTimeout(() => {
      if (logo) {
        setLogoPreview(logo);
        setLoadingLogo(false);
      }
      if (background) {
        setBackgroundPreview(background);
        setLoadingBackground(false);
      }
    }, 700);

    return () => clearTimeout(timer);
  }, [logo, background]);

  //al cargar, detectar si cambiaron los archivos y enviar los cambios al componente padre.
  useEffect(() => {
    onImagesSubmit?.({
      logo: logoFile,
      backgroundImage: backgroundFile,
    });
  }, [logoFile, backgroundFile, onImagesSubmit]);

  // cambiar logo
  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  //cambiar el background
  const handleBackgroundChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setBackgroundFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setBackgroundPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };*/

  // ---------------------------------------------------------------------
  // 1) RETURN DEL EMPTY STATE (cuando no hay logo ni título)
  // ---------------------------------------------------------------------
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
              menuId={menu.id}
              menuTitle={menu.title}
              menuPos={menu.pos}
              menuLogo={menu.logo}
              menuBackground={menu.backgroundImage}
              menuPrimary={menu.color?.primary}
              menuSecondary={menu.color?.secondary}
              onUpdated={handleMenuCreated}
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

  // ---------------------------------------------------------------------
  // 2) RETURN NORMAL (cuando el padre SÍ devuelve title y/o logo)
  // ---------------------------------------------------------------------
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
            {menuId === undefined ? newMenuTitle : menu.title}
          </h2>
        </div>

        {/* Logo */}
        <div className="flex flex-col items-center space-y-4 mb-3">
          <Label
            htmlFor="logo"
            className={`w-32 h-32 rounded-full overflow-hidden flex items-center justify-center 
  cursor-pointer transition-all duration-300 transform hover:scale-105
  ${
    menu.logo || isEmpty
      ? "ring-4 ring-slate-200 shadow-xl"
      : "border-4 border-dashed border-slate-300 bg-slate-50 shadow-lg"
  }`}
          >
            {loading ? (
              <Spinner className="w-8 h-8 text-orange-500" />
            ) : menuId === undefined ? ( // Verificar si menuId es undefined
              newMenuLogo ? (
                <Image
                  src={newMenuLogo}
                  alt="Logo preview"
                  width={100}
                  height={100}
                  className="w-full h-full object-cover"
                />
              ) : (
                <BookImage className="w-8 h-8 text-slate-400" />
              )
            ) : menu.logo ? ( // Si menuId tiene un valor, mostrar logo del menú cargado
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
          </Label>
        </div>
        {/* Botón Editar */}
        <InfoDialog
          menuId={menu.id}
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

// card imagenes del menú
{
  /*<Card
      className="bg-white/80 backdrop-blur-xl border border-white/30 rounded-2xl 
        p-5 shadow-lg max-w-md mx-auto space-y-6"
    >
      <h3 className="text-lg font-bold text-slate-900 text-center mb-2">
        Imágenes del Menú
      </h3>
      {/* Logo 
      <div className="flex flex-col items-center text-center space-y-3">
        <input
          id="logo"
          type="file"
          accept="image/*"
          onChange={handleLogoChange}
          className="hidden"
        />
        <Label
          htmlFor="logo"
          className={`w-28 h-28 rounded-full overflow-hidden 
            ${
              logoPreview
                ? "border-0"
                : "border-2 border-dashed border-slate-300"
            } 
            bg-slate-50 flex items-center justify-center cursor-pointer hover:border-orange-500 transition-all`}
        >
          {/* carga del logo 
          {loadingLogo ? (
            <Spinner className="w-6 h-6 text-orange-500" />
          ) : logoPreview ? (
            <Image
              src={logoPreview}
              alt="Logo preview"
              width={100}
              height={100}
              className="w-full h-full object-cover"
              priority
            />
          ) : (
            <Upload className="w-8 h-8 text-slate-400" />
          )}
        </Label>
        {/* titulo y subtitulo sin logo 
        <p className="text-sm text-slate-600 font-medium">
          {logoPreview ? "Toca la imagen para cambiarlo" : "Carga tu imagen"}
        </p>
        <p className="text-xs text-slate-400">PNG, JPG, SVG hasta 10MB</p>
      </div>
      {/* fondo 
      <div className="flex flex-col items-center text-center space-y-3">
        <input
          id="background"
          type="file"
          accept="image/*"
          onChange={handleBackgroundChange}
          className="hidden"
        />
        <Label
          htmlFor="background"
          className={`w-full aspect-[16/9] rounded-2xl overflow-hidden 
            ${
              backgroundPreview
                ? "border-0"
                : "border-2 border-dashed border-slate-300"
            } 
            bg-slate-50 flex items-center justify-center cursor-pointer hover:border-orange-500 transition-all`}
        >
          {/* carga del fondo 
          {loadingBackground ? (
            <Spinner className="w-6 h-6 text-orange-500" />
          ) : backgroundPreview ? (
            <Image
              src={backgroundPreview}
              alt="Background preview"
              width={600} 
              height={340} 
              className="w-full h-full object-cover"
              priority
            />
          ) : (
            <div className="flex flex-col items-center">
              <Upload className="w-8 h-8 text-slate-400 mb-1" />
              {/* titulo sin fondo *
              <p className="text-sm text-slate-500">
                {" "}
                Carga la imagen de fondo
              </p>
            </div>
          )}
        </Label>
        {/* titulo con fondo 
        {backgroundPreview && (
          <p className="text-sm text-slate-600 font-medium">
            Toca la imagen para cambiarlo
          </p>
        )}
        {/* subtitulo con/sin fondo 
        <p className="text-xs text-slate-400">PNG, JPG hasta 10MB</p>
      </div>
    </Card>*/
}
