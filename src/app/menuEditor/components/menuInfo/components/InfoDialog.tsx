"use client";

import React, { useState, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
  DialogFooter,
  DialogTitle,
} from "@/common/components/ui/dialog";

import { Input } from "@/common/components/ui/input";
import { Label } from "@/common/components/ui/label";
import { Button } from "@/common/components/ui/button";
import Image from "next/image";
import { ImageIcon, Upload, X } from "lucide-react";
import { HexColorPicker } from "react-colorful";
import { motion } from "framer-motion";
import { cn } from "@/common/utils/utils";
import { DialogClose } from "@radix-ui/react-dialog";
import { createMenu, updateMenu } from "@/common/utils/api";
import { Menu, newMenu } from "@/interfaces/menu";

interface InfoDialogProps {
  trigger?: React.ReactNode;
  menuId?: number;
  defaultTitle?: string;
  defaultPos?: string;
  defaultLogo?: string;
  defaultBackground?: string;
  onUpdated?: () => void;
}

const InfoDialog = ({
  trigger,
  menuId,
  defaultTitle = "",
  defaultPos = "",
  defaultLogo,
  defaultBackground,
  onUpdated,
}: InfoDialogProps) => {
  //estados para el titulo,direccion
  const [title, setTitle] = useState(defaultTitle);
  const [pos, setPos] = useState(defaultPos);
  //estado para los archivos logo y background
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [backgroundFile, setBackgroundFile] = useState<File | null>(null);
  //estados para mostrar el preview de logo y background
  const [logoPreview, setLogoPreview] = useState(defaultLogo || null);
  const [backgroundPreview, setBackgroundPreview] = useState(
    defaultBackground || null
  );

  // estado de los colores primario y secundario y su activacion
  const [primaryColor, setPrimaryColor] = useState("#d4d4d4");
  const [secondaryColor, setSecondaryColor] = useState("#262626");
  const [activeColorInput, setActiveColorInput] = useState<
    "primary" | "secondary"
  >("primary");

  // estado de color SELECCIONADO
  const [color, setColor] = useState("#ffffff");

  // Agregar refs para los inputs
  const primaryInputRef = useRef<HTMLInputElement>(null);
  const secondaryInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setterFile: (f: File | null) => void,
    setterPreview: (src: string | null) => void
  ) => {
    const file = e.target.files?.[0] || null;
    setterFile(file);

    if (file) {
      const reader = new FileReader();
      reader.onload = () => setterPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  //disparar los alert cuando faltan los campos obligatorios.

  // validación y formato del input
  const formatHex = (value: string) => {
    if (!value.startsWith("#")) value = "#" + value;
    return value.replace(/[^#0-9A-Fa-f]/g, "").slice(0, 7);
  };

  // manejo de cambios de input
  const handleInputChange = (type: "primary" | "secondary", value: string) => {
    const formatted = formatHex(value);
    // ver en consola para testeo
    //console.log(`[Input ${type}] Cambió a:`, formatted);
    if (type === "primary") {
      setPrimaryColor(formatted);
      setColor(formatted);
      setActiveColorInput("primary");
    } else {
      setSecondaryColor(formatted);
      setColor(formatted);
      setActiveColorInput("secondary");
    }
  };

  // foco en input -> actualiza picker también
  const handleInputFocus = (type: "primary" | "secondary") => {
    setActiveColorInput(type);
    const selectedColor = type === "primary" ? primaryColor : secondaryColor;
    setColor(selectedColor);
  };

  // click en preview -> activa picker y enfoca input
  const handlePreviewClick = (type: "primary" | "secondary") => {
    setActiveColorInput(type);
    const selectedColor = type === "primary" ? primaryColor : secondaryColor;
    setColor(selectedColor);
    if (type === "primary") primaryInputRef.current?.focus();
    else secondaryInputRef.current?.focus();
  };

  // cambio desde el picker
  const detectColorChange = (newColor: string) => {
    setColor(newColor);
    if (activeColorInput === "primary") setPrimaryColor(newColor);
    else setSecondaryColor(newColor);
  };

  //subir los datos al back
  const handleSubmit = async () => {
    console.log("🧪 menuId recibido:", menuId);
    try {
      // si es un menu nuevo
      if (!menuId) {
        const payload: newMenu = {
          title: title.trim(),
          pos: pos.trim(),
          userId: 1,
          logo: logoFile ?? null,
          backgroundImage: backgroundFile ?? null,
          color: {
            primary: primaryColor,
            secondary: secondaryColor,
          },
          categories: [],
        };
        //crear BD
        const createdMenu = await createMenu(payload);
        console.log("✅ Menú creado:", createdMenu);
        //notificar
        onUpdated?.();
        
        return;
      }

      // editar un menu
      else {
        const payload: Partial<Menu> = {
          title: title.trim(),
          pos: pos.trim(),
          color: {
            primary: primaryColor,
            secondary: secondaryColor,
          },
        };

        // Logo
        if (logoFile) payload.logo = logoFile;
        else payload.logo = defaultLogo ?? "";

        // Background
        if (backgroundFile) payload.backgroundImage = backgroundFile;
        else payload.backgroundImage = defaultBackground ?? "";

        console.log("📤 Enviando actualización:", payload);
        //editar BD
        const updated = await updateMenu(menuId, payload);
        console.log("✅ Menú actualizado:", updated);
        //notificar
        onUpdated?.();
      }
    } catch (error) {
      console.error("❌ Error al guardar:", error);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>

      <DialogContent className="max-w-md  max-h-[80vh] overflow-y-auto">
        {/* Botón de cerrar */}
        <DialogClose className="absolute right-4 top-4 rounded-full p-2 hover:bg-white/70 transition-colors z-50">
          <X className="h-5 w-5 text-orange-400" />
        </DialogClose>

        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-black">
            Editar información
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-5 py-4">
          {/* Título */}
          <div className="flex flex-col space-y-2">
            <Label
              className="text-slate-600 text-sm font-medium"
              htmlFor="title"
            >
              Nombre del Menú
            </Label>
            <Input
              id="title"
              placeholder="Ej: La Pizzería de Mario"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="h-11 pr-10 text-black bg-white/80 border-slate-200 focus-visible:ring-orange-400 text-sm placeholder:text-slate-400"
            />
          </div>

          {/* POS */}
          <div className="flex flex-col space-y-1">
            <Label className="text-slate-600 text-sm font-medium" htmlFor="pos">
              Ubicación / Puntos de Venta
            </Label>
            <Input
              id="pos"
              placeholder="Ej: Av. Principal 123, Centro"
              value={pos}
              onChange={(e) => setPos(e.target.value)}
              className="h-11 pr-10 text-black bg-white/80 border-slate-200 focus-visible:ring-orange-400 text-sm placeholder:text-slate-400"
            />
          </div>

          {/* Logo */}
          <div className="flex flex-col justify-center space-y-2">
            <Label className="text-slate-600 text-sm font-medium">Logo</Label>
            <input
              type="file"
              accept="image/*"
              id="logoInput"
              className="hidden"
              onChange={(e) =>
                handleImageChange(e, setLogoFile, setLogoPreview)
              }
            />
            <div className="flex flex-col justify-center items-center">
              <Label
                htmlFor="logoInput"
                className="w-24 h-24 rounded-full bg-slate-100 border border-slate-300 flex items-center justify-center overflow-hidden cursor-pointer hover:ring-2 hover:ring-orange-400 transition-all"
              >
                {logoPreview ? (
                  <Image
                    src={logoPreview}
                    alt="Logo preview"
                    width={100}
                    height={100}
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <Upload className="w-6 h-6 text-slate-500" />
                )}
              </Label>
            </div>
          </div>

          {/* Background */}
          <div className="flex flex-col justify-center space-y-3">
            <Label className="text-slate-600 text-sm font-medium">
              Imagen de fondo
            </Label>
            <input
              type="file"
              accept="image/*"
              id="backgroundInput"
              className="hidden"
              onChange={(e) =>
                handleImageChange(e, setBackgroundFile, setBackgroundPreview)
              }
            />

            <Label
              htmlFor="backgroundInput"
              className="w-full h-32 bg-slate-100 border border-slate-300 rounded-xl flex items-center justify-center overflow-hidden cursor-pointer hover:ring-2 hover:ring-orange-400 transition-all"
            >
              {backgroundPreview ? (
                <Image
                  src={backgroundPreview}
                  alt="Background preview"
                  width={600}
                  height={320}
                  className="object-cover w-full h-full"
                />
              ) : (
                <div className="flex items-center gap-2 text-slate-500">
                  <ImageIcon className="w-5 h-5" />
                  Subir imagen
                </div>
              )}
            </Label>
          </div>
          {/* color picker */}
          <div className="flex flex-col justify-center space-y-1">
            <Label className="text-slate-600 text-sm font-medium">
              Selector de colores
            </Label>
            <HexColorPicker
              color={color}
              onChange={detectColorChange}
              style={{
                width: "100%",
                height: "220px",
                borderRadius: "1rem",
              }}
            />
          </div>
          {/* inputs del color picker */}
          <div className="space-y-3">
            <Label className="text-slate-700 text-sm font-medium">
              Color Base
            </Label>
            <div className="flex items-center gap-4">
              {/* preview del input primario con animación */}
              <motion.div
                layoutId="color-preview-primary"
                onClick={() => handlePreviewClick("primary")}
                className={cn(
                  "w-10 h-10 rounded-lg border shadow-inner cursor-pointer",
                  activeColorInput === "primary"
                    ? "ring-2 ring-orange-400"
                    : "border-white/50"
                )}
                style={{ backgroundColor: primaryColor }}
                animate={{
                  scale: activeColorInput === "primary" ? 1.1 : 1,
                  boxShadow:
                    activeColorInput === "primary"
                      ? "0 0 10px rgba(251,146,60,0.4)"
                      : "0 0 0px rgba(0,0,0,0)",
                }}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 20,
                }}
              />

              {/* input primario */}
              <Input
                ref={primaryInputRef}
                type="text"
                value={primaryColor}
                onChange={(e) => handleInputChange("primary", e.target.value)}
                onFocus={() => handleInputFocus("primary")}
                className="font-mono text-black text-sm bg-white/80 border-slate-200 focus-visible:ring-orange-400"
                placeholder="Color base"
              />
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex flex-col gap-2 mt-2">
              <Label className="text-slate-700 text-sm font-medium">
                Color Secundario
              </Label>
              <div className="flex items-center gap-4">
                {/* preview del input secundario con animación */}
                <motion.div
                  layoutId="color-preview-secondary"
                  onClick={() => handlePreviewClick("secondary")}
                  className={cn(
                    "w-10 h-10 rounded-lg border shadow-inner cursor-pointer",
                    activeColorInput === "secondary"
                      ? "ring-2 ring-orange-400"
                      : "border-white/50"
                  )}
                  style={{ backgroundColor: secondaryColor }}
                  animate={{
                    scale: activeColorInput === "secondary" ? 1.1 : 1,
                    boxShadow:
                      activeColorInput === "secondary"
                        ? "0 0 10px rgba(251,146,60,0.4)"
                        : "0 0 0px rgba(0,0,0,0)",
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 20,
                  }}
                />

                <Input
                  ref={secondaryInputRef}
                  type="text"
                  value={secondaryColor}
                  onChange={(e) =>
                    handleInputChange("secondary", e.target.value)
                  }
                  onFocus={() => handleInputFocus("secondary")}
                  className="font-mono text-black text-sm bg-white/80 border-slate-200 focus-visible:ring-orange-400"
                  placeholder="Color secundario"
                />
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button
              className="bg-orange-500 hover:bg-orange-600"
              onClick={handleSubmit}
            >
              Guardar
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default InfoDialog;
