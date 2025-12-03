"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion } from "framer-motion";
import { cn } from "@/common/utils/utils";
import { HexColorPicker } from "react-colorful";

import { createMenu, updateMenu } from "@/common/utils/api";
import { Menu, newMenu } from "@/interfaces/menu";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTrigger,
  DialogFooter,
  DialogTitle,
} from "@/common/components/ui/dialog";
import { DialogClose } from "@radix-ui/react-dialog";
import { Alert, AlertDescription } from "@/common/components/ui/alert";
import { Label } from "@/common/components/ui/label";
import { Input } from "@/common/components/ui/input";
import { Button } from "@/common/components/ui/button";

import { ImageIcon, Upload, X } from "lucide-react";

// -----PROPS DEL COMPONENTE-----

interface InfoDialogProps {
  trigger?: React.ReactNode;
  menuId?: number;
  menuTitle?: string;
  menuPos?: string;
  menuLogo?: string;
  menuBackground?: string;
  menuPrimary?: string;
  menuSecondary?: string;
  onCreated?: (newMenuId: number) => void;
  onUpdated?: (menuId: number) => void;
}

export default function InfoDialog({
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
}: InfoDialogProps) {
  const router = useRouter();

  // ---------- Estados ----------
  // titulo del menú
  const [title, setTitle] = useState(menuTitle);
  // ubicación / puntos de venta
  const [pos, setPos] = useState(menuPos || "");
  // logo
  const [logoFile, setLogoFile] = useState<File | null>(null);
  // imagen de fondo
  const [backgroundFile, setBackgroundFile] = useState<File | null>(null);
  // preview de logo
  const [logoPreview, setLogoPreview] = useState(menuLogo || null);
  // preview de fondo
  const [backgroundPreview, setBackgroundPreview] = useState(
    menuBackground || null
  );
  // color primario
  const [primaryColor, setPrimaryColor] = useState(menuPrimary || "#d4d4d4");
  // color secundario
  const [secondaryColor, setSecondaryColor] = useState(
    menuSecondary || "#262626"
  );
  // color actual del picker
  const [color, setColor] = useState(primaryColor);
  // input de color activo
  const [activeColorInput, setActiveColorInput] = useState<
    "primary" | "secondary"
  >("primary");
  // mensaje de alerta / error
  const [alertMessage, setAlertMessage] = useState<string | null>(null);

  // ---------- Refs ----------
  // refs para inputs de color primario
  const primaryInputRef = useRef<HTMLInputElement>(null);
  // refs para inputs de color secundario
  const secondaryInputRef = useRef<HTMLInputElement>(null);
  // ref para el scroll del dialog
  const dialogScrollRef = useRef<HTMLDivElement>(null);

  // -----UseEffects-----
  // inicializar / actualizar estados cuando cambian las props
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

  //  scroll al tope cuando hay un mensaje de alerta
  useEffect(() => {
    if (alertMessage && dialogScrollRef.current) {
      dialogScrollRef.current.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [alertMessage]);

  // -----Handlers-------
  // Lee imágenes y genera preview
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

  // Normalizar formato HEX
  const formatHex = (value: string) => {
    if (!value.startsWith("#")) value = "#" + value;
    return value.replace(/[^#0-9A-Fa-f]/g, "").slice(0, 7);
  };

  // Maneja cambios en los inputs de color
  const handleInputChange = (type: "primary" | "secondary", value: string) => {
    const formatted = formatHex(value);

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

  // Actualiza picker en foco
  const handleInputFocus = (type: "primary" | "secondary") => {
    setActiveColorInput(type);
    const selectedColor = type === "primary" ? primaryColor : secondaryColor;
    setColor(selectedColor);
  };

  // Click en preview
  const handlePreviewClick = (type: "primary" | "secondary") => {
    setActiveColorInput(type);
    const selectedColor = type === "primary" ? primaryColor : secondaryColor;
    setColor(selectedColor);

    if (type === "primary") primaryInputRef.current?.focus();
    else secondaryInputRef.current?.focus();
  };

  // Sincronización del picker
  const detectColorChange = (newColor: string) => {
    setColor(newColor);
    if (activeColorInput === "primary") setPrimaryColor(newColor);
    else setSecondaryColor(newColor);
  };

  // ---------- Validación ----------
  const validateFields = () => {
    const errors: string[] = [];

    if (title.trim().length <= 3) {
      errors.push("El título debe tener más de 3 caracteres.");
    }

    // Validar pos solo si el usuario ingresó algo
    const posTrimmed = pos.trim();
    if (posTrimmed.length > 0 && posTrimmed.length <= 3) {
      errors.push(
        "La ubicación debe tener más de 3 caracteres o dejarse vacía."
      );
    }

    if (errors.length > 0) {
      setAlertMessage(errors.join("\n"));
      return false;
    }

    setAlertMessage(null);
    return true;
  };

  // Función para validar si un color HEX es válido
  const isValidHex = (value: string) => /^#[0-9A-Fa-f]{6}$/.test(value);

  // ---------- Submit ----------
  const handleSubmit = async () => {
    // Validar campos
    const isValid = validateFields();
    if (!isValid) {
      // Hacer scroll al tope para mostrar el mensaje de alerta
      if (dialogScrollRef.current) {
        dialogScrollRef.current.scrollTo({ top: 0, behavior: "smooth" });
      }
      return;
    }
    // Validar colores y asignar valores por defecto si es necesario
    const primary =
      isValidHex(primaryColor.trim()) && primaryColor.trim() !== "#"
        ? primaryColor.trim()
        : menuPrimary || "#d4d4d4";

    const secondary =
      isValidHex(secondaryColor.trim()) && secondaryColor.trim() !== "#"
        ? secondaryColor.trim()
        : menuSecondary || "#262626";

    try {
      // Crear menú
      if (!menuId) {
        const payload: newMenu = {
          title: title.trim(),
          pos: pos.trim(),
          userId: 1,
          logo: logoFile ?? null,
          backgroundImage: backgroundFile ?? null,
          color: {
            primary: primary.trim(),
            secondary: secondary.trim(),
          },
          categories: [],
        };

        //console.log(payload);
        // Crear menú via API
        const createdMenu = await createMenu(payload);
        onCreated?.(createdMenu.id);
        // Redirigir a menus
        router.push(`/menuShowcase?menuCreated=true`);
      }

      // Editar menú existente
      else {
        const payload: Partial<Menu> = {
          title: title.trim(),
          pos: pos ? pos.trim() : "",
          color: {
            primary: primary,
            secondary: secondary,
          },
        };
        // Adjuntar imágenes si se actualizaron
        if (logoFile) payload.logo = logoFile as unknown as string;
        // si no, mantener la existente
        else if (menuLogo) payload.logo = menuLogo;
        // adjuntar imagen de fondo si se actualizó
        if (backgroundFile)
          payload.backgroundImage = backgroundFile as unknown as string;
        // si no, mantener la existente
        else if (menuBackground) payload.backgroundImage = menuBackground;

        //console.log("📤 Payload enviado:", payload);
        //console.log("📍 Valor de pos:", `"${payload.pos}"`);

        // Actualizar menú via API
        await updateMenu(menuId, payload);
        onUpdated?.(menuId);
      }
    } catch (err) {
      console.error("❌ Error al guardar", err);
    }
  };

  // ----- Render -----
  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>

      <DialogContent
        ref={dialogScrollRef}
        className="max-w-md max-h-[80vh] overflow-y-auto [&>button]:hidden"
      >
        <DialogHeader>
          <div className="relative flex items-center justify-center">
            <DialogTitle className="text-xl font-semibold text-black">
              {menuId ? "Editar menú" : "Crear menú"}
            </DialogTitle>
            <DialogClose className="absolute right-0 top-1/2 -translate-y-1/2 p-2 rounded-full hover:bg-white/70">
              <X className="h-5 w-5 text-orange-400" />
            </DialogClose>
          </div>
          <DialogDescription></DialogDescription>
        </DialogHeader>

        <div className="space-y-5 py-4">
          {alertMessage && (
            <Alert className="bg-red-100 border border-red-400 p-4 rounded-xl">
              <AlertDescription className="whitespace-pre-line text-gray-600 text-sm font-semibold">
                {alertMessage}
              </AlertDescription>
            </Alert>
          )}

          {/* Título */}
          <div className="flex flex-col space-y-2">
            <Label className="text-slate-700 text-sm font-semibold">
              Nombre del Menú
            </Label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>

          {/* POS */}
          <div className="flex flex-col space-y-2">
            <Label className="text-slate-700 text-sm font-semibold">
              Ubicación / Puntos de Venta
            </Label>
            <Input value={pos} onChange={(e) => setPos(e.target.value)} />
          </div>

          {/* LOGO */}

          <div className="flex flex-col space-y-2">
            <Label className="text-slate-700 text-sm font-semibold">Logo</Label>

            <Input
              type="file"
              accept="image/*"
              id="logoInput"
              className="hidden"
              onChange={(e) =>
                handleImageChange(e, setLogoFile, setLogoPreview)
              }
            />

            <Label
              htmlFor="logoInput"
              className={cn(
                " text-slate-700 text-sm font-semibold w-24 h-24 rounded-full bg-slate-100 flex items-center justify-center overflow-hidden cursor-pointer transition-all self-center",
                logoPreview ? "" : "border-2 border-dashed border-slate-300"
              )}
            >
              {logoPreview ? (
                <Image
                  src={logoPreview}
                  alt="Logo preview"
                  width={
                    logoPreview ===
                    "https://undevcode-menus.s3.sa-east-1.amazonaws.com/defaults/menu/default_menu.png"
                      ? 70
                      : 100 // Si no es la URL predeterminada, será 100
                  }
                  height={
                    logoPreview ===
                    "https://undevcode-menus.s3.sa-east-1.amazonaws.com/defaults/menu/default_menu.png"
                      ? 70
                      : 100 // Si no es la URL predeterminada, será 100
                  }
                  className={
                    logoPreview ===
                    "https://undevcode-menus.s3.sa-east-1.amazonaws.com/defaults/menu/default_menu.png"
                      ? "object-contain" // Si es la URL predeterminada, usaremos object-contain
                      : "object-cover" // Si no es la URL predeterminada, usaremos object-cover
                  }
                  priority
                />
              ) : (
                <Upload className="w-6 h-6 text-gray-500" />
              )}
            </Label>
            <p className="text-base text-center text-slate-400 mt-2">
              PNG, JPG hasta 4MB
            </p>
          </div>

          {/* BACKGROUND */}
          <div className="flex flex-col space-y-2">
            <Label className="text-slate-700 text-sm font-semibold">
              Imagen de fondo
            </Label>
            <Input
              type="file"
              accept="image/*"
              id="bgInput"
              className="hidden"
              onChange={(e) =>
                handleImageChange(e, setBackgroundFile, setBackgroundPreview)
              }
            />
            <Label
              htmlFor="bgInput"
              className={cn(
                " text-slate-700 text-sm font-semibold w-full h-32 bg-slate-100 rounded-xl flex items-center justify-center overflow-hidden cursor-pointer transition-all",
                backgroundPreview
                  ? ""
                  : "border-2 border-dashed border-slate-300"
              )}
            >
              {backgroundPreview ? (
                <Image
                  src={backgroundPreview}
                  alt="background"
                  width={600}
                  height={300}
                  className="object-cover w-full h-full"
                />
              ) : (
                <div className="flex items-center gap-2 text-gray-500">
                  <ImageIcon className="w-5 h-5" />
                  Subir imagen
                </div>
              )}
            </Label>
            <p className="text-base text-center text-slate-400 mt-2">
              PNG, JPG hasta 4MB
            </p>
          </div>

          {/* COLOR PICKER */}
          <div className="flex flex-col space-y-2">
            <Label className="text-slate-700 text-sm font-semibold">
              Selector de colores
            </Label>
            <HexColorPicker
              color={color}
              onChange={detectColorChange}
              style={{ width: "100%", height: 220, borderRadius: "1rem" }}
            />
          </div>

          {/* INPUT COLOR PRIMARIO */}
          <div className="space-y-2">
            <Label className="text-slate-700 text-sm font-semibold">
              Color Base
            </Label>
            <div className="flex items-center gap-4">
              <motion.div
                onClick={() => handlePreviewClick("primary")}
                className={cn(
                  "w-10 h-10 rounded-lg border shadow-inner cursor-pointer",
                  activeColorInput === "primary" ? "ring-2 ring-orange-400" : ""
                )}
                style={{ backgroundColor: primaryColor }}
              />
              <Input
                ref={primaryInputRef}
                value={primaryColor}
                onChange={(e) => handleInputChange("primary", e.target.value)}
                onFocus={() => handleInputFocus("primary")}
              />
            </div>
          </div>

          {/* INPUT COLOR SECUNDARIO */}
          <div className="space-y-2">
            <Label className="text-slate-700 text-sm font-semibold">
              Color Secundario
            </Label>
            <div className="flex items-center gap-4">
              <motion.div
                onClick={() => handlePreviewClick("secondary")}
                className={cn(
                  "w-10 h-10 rounded-lg border shadow-inner cursor-pointer",
                  activeColorInput === "secondary"
                    ? "ring-2 ring-orange-400"
                    : ""
                )}
                style={{ backgroundColor: secondaryColor }}
              />
              <Input
                ref={secondaryInputRef}
                value={secondaryColor}
                onChange={(e) => handleInputChange("secondary", e.target.value)}
                onFocus={() => handleInputFocus("secondary")}
              />
            </div>
          </div>
        </div>

        {/* BOTÓN GUARDAR */}
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
}
