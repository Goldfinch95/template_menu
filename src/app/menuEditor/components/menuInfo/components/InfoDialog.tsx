"use client";

import React, { useState, useRef, useEffect } from "react";
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
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/common/components/ui/alert";
import { useRouter } from "next/navigation";

interface InfoDialogProps {
  trigger?: React.ReactNode;
  menuId?: number;
  menuTitle?: string;
  menuPos?: string;
  menuLogo?: string;
  menuBackground?: string;
  menuPrimary?: string;
  menuSecondary?: string;
  onCreated?: (newMenuId: number) => void; // 🔥 Para cuando se crea
  onUpdated?: (menuId: number) => void;
}

const InfoDialog = ({
  trigger,
  menuId,
  menuTitle = "",
  menuPos = "",
  menuLogo,
  menuBackground,
  menuPrimary,
  menuSecondary,
  onCreated,
  onUpdated,
}: InfoDialogProps) => {

  //RUTA
    const router = useRouter();
    
  //estados para el titulo,direccion
  const [title, setTitle] = useState(menuTitle);
  const [pos, setPos] = useState(menuPos);
  //estado para los archivos logo y background
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [backgroundFile, setBackgroundFile] = useState<File | null>(null);
  //estados para mostrar el preview de logo y background
  const [logoPreview, setLogoPreview] = useState(menuLogo || null);
  const [backgroundPreview, setBackgroundPreview] = useState(
    menuBackground || null
  );

  // estado de los colores primario y secundario y su activacion
  const [primaryColor, setPrimaryColor] = useState(menuPrimary || "#d4d4d4");
  const [secondaryColor, setSecondaryColor] = useState(
    menuSecondary || "#262626"
  );
  const [activeColorInput, setActiveColorInput] = useState<
    "primary" | "secondary"
  >("primary");

  //estado de alerta
  const [alertMessage, setAlertMessage] = useState<string | null>(null);

  // estado de color SELECCIONADO
  const [color, setColor] = useState(primaryColor);

  //Agrega refs para el alerta
  const alertRef = useRef<HTMLDivElement>(null);

  // Agregar refs para los inputs
  const primaryInputRef = useRef<HTMLInputElement>(null);
  const secondaryInputRef = useRef<HTMLInputElement>(null);

  // 🔥 CAMBIO 2: Actualizar los estados cuando cambien las props
  useEffect(() => {
    setTitle(menuTitle);
    setPos(menuPos);
    setLogoPreview(menuLogo || null);
    setBackgroundPreview(menuBackground || null);
    setPrimaryColor(menuPrimary || "#d4d4d4");
    setSecondaryColor(menuSecondary || "#262626");
    setColor(menuPrimary || "#d4d4d4");
  }, [
    menuTitle,
    menuPos,
    menuLogo,
    menuBackground,
    menuPrimary,
    menuSecondary,
  ]);

  // Desplazarse a la alerta cuando se establece un mensaje de error
  useEffect(() => {
    if (alertMessage && alertRef.current) {
      alertRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [alertMessage]);

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

  //VALIDACION DE DATOS
  // VALIDACIÓN DE DATOS (acumulativa)
  const validateFields = () => {
    const errors: string[] = [];

    if (title.trim().length < 3) {
      errors.push("• El título debe tener más de 3 caracteres.");
    }

    if (!/^#[0-9A-Fa-f]{6}$/.test(primaryColor)) {
      errors.push("• El color primario debe ser un código HEX válido.");
    }

    if (!/^#[0-9A-Fa-f]{6}$/.test(secondaryColor)) {
      errors.push("• El color secundario debe ser un código HEX válido.");
    }

    // Si hay errores → mostrarlos
    if (errors.length > 0) {
      setAlertMessage(errors.join("\n")); // <-- convierte array a texto con saltos de línea
      return false;
    }

    // Si pasa todas las validaciones → limpiar alerta
    setAlertMessage(null);
    return true;
  };

  //subir los datos al back
  const handleSubmit = async () => {
    //console.log("🧪 menuId recibido:", menuId);
    const isValid = validateFields();
    // Si la validación falla, no continuamos con el submit
    if (!isValid) return;
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
            primary: primaryColor.trim(),
            secondary: secondaryColor.trim(),
          },
          categories: [],
        };
        
        //crear BD
        const createdMenu = await createMenu(payload);
        //console.log("✅ Menú creado:", createdMenu);

        //notificar
        //console.log("🔄 Notificando al padre con el nuevo ID:", createdMenu.id);
        onCreated?.(createdMenu.id);
        router.push(`/menuShowcase?menuCreated=true`); // Pasamos el nuevo `menuId` al padre
      }
      // editar un menu
      else {
        const payload: Partial<Menu> = {
          title: title ? title.trim() : "",
          pos: pos ? pos.trim() : "",
          color: {
            primary: primaryColor.trim(),
            secondary: secondaryColor.trim(),
          },
        };

        // Logo
        if (logoFile) payload.logo = logoFile;
        else payload.logo = menuLogo ?? "";

        // Background
        if (backgroundFile) payload.backgroundImage = backgroundFile;
        else payload.backgroundImage = menuBackground ?? "";

        //console.log("📤 Enviando actualización:", payload);
        //editar BD
        await updateMenu(menuId, payload);
        //console.log("✅ Menú actualizado:", payload);
        //notificar
        onUpdated?.(menuId);
      }
    } catch (error) {
      console.error("❌ Error al guardar:", error);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>

      <DialogContent className="max-w-md  max-h-[80vh] overflow-y-auto [&>button]:hidden">
        {/* Botón de cerrar */}

        <DialogHeader>
          <div className="relative flex items-center justify-center">
            <DialogTitle className="text-xl font-semibold text-black text-center">
              Editar información
            </DialogTitle>

            <DialogClose className="absolute right-0 top-1/2 -translate-y-1/2 rounded-full p-2 hover:bg-white/70 transition-colors">
              <X className="h-5 w-5 text-orange-400" />
            </DialogClose>
          </div>
        </DialogHeader>

        <div className="space-y-5 py-4">
          {/*mostrar alertas */}
          {alertMessage && (
            <Alert className="mb-4 bg-red-100 border border-red-400 text-red-700 p-4 rounded-xl flex items-start gap-3">
              <X className="w-5 h-5 mt-1" />
              <div>
                <AlertDescription className="whitespace-pre-line mt-1">
                  {alertMessage}
                </AlertDescription>
              </div>
            </Alert>
          )}
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
              className="bg-white border-slate-300 shadow-sm text-base
                focus-visible:border-orange-400
                focus-visible:ring-2 focus-visible:ring-orange-200/70
                rounded-xl transition-all duration-200"
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
              className="bg-white border-slate-300 shadow-sm text-base
                focus-visible:border-orange-400
                focus-visible:ring-2 focus-visible:ring-orange-200/70
                rounded-xl transition-all duration-200"
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
                className={`w-24 h-24 rounded-full bg-slate-100 flex items-center justify-center overflow-hidden cursor-pointer hover:ring-2 hover:ring-orange-400 transition-all ${
                  logoPreview
                    ? "border-none"
                    : "border-2 border-dashed border-slate-300"
                }`}
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
              <p className="text-base text-slate-400 mt-2">
                PNG, JPG hasta 10MB
              </p>
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
              className={`w-full h-32 bg-slate-100 rounded-xl flex items-center justify-center overflow-hidden cursor-pointer hover:ring-2 hover:ring-orange-400 transition-all ${
                backgroundPreview
                  ? "border-none"
                  : "border-2 border-dashed border-slate-300"
              }`}
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
            <p className="flex justify-center text-base text-slate-400 mt-2">
              PNG, JPG hasta 10MB
            </p>
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
                className="bg-white border-slate-300 shadow-sm text-base
                focus-visible:border-orange-400
                focus-visible:ring-2 focus-visible:ring-orange-200/70
                rounded-xl transition-all duration-200"
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
                  className="bg-white border-slate-300 shadow-sm text-base
                focus-visible:border-orange-400
                focus-visible:ring-2 focus-visible:ring-orange-200/70
                rounded-xl transition-all duration-200"
                  placeholder="Color secundario"
                />
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button
            className="bg-orange-500 hover:bg-orange-600"
            onClick={handleSubmit}
          >
            Guardar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default InfoDialog;
