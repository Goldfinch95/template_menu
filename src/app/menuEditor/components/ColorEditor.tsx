"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/common/components/ui/dialog";
import { Input } from "@/common/components/ui/input";
import { Button } from "@/common/components/ui/button";
import { Label } from "@/common/components/ui/label";
import { Card } from "@/common/components/ui/card";
import { HexColorPicker } from "react-colorful";
import { X } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/common/utils/utils";

interface ColorEditorProps {
  primary: string;
  secondary: string;
  onColorsChange?: (colors: { primary: string; secondary: string }) => void;
}

const ColorEditor = ({
  primary,
  secondary,
  onColorsChange,
}: ColorEditorProps) => {
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

  // Sincroniza con valores iniciales
  useEffect(() => {
    // ver en consola para testeo
    /*if (primary || secondary) {
      console.log("color primario:",primary,"color secundario:",secondary)
    }*/
    if (primary)
      setPrimaryColor(primary.startsWith("#") ? primary : `#${primary}`);
    if (secondary)
      setSecondaryColor(
        secondary.startsWith("#") ? secondary : `#${secondary}`
      );
  }, [primary, secondary]);

  // el picker refleja el activo
  useEffect(() => {
    if (activeColorInput === "primary") setColor(primaryColor);
    else setColor(secondaryColor);
  }, [primaryColor, secondaryColor, activeColorInput]);

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

  // foco en input -> actualiza picker también
  const handleInputFocus = (type: "primary" | "secondary") => {
    setActiveColorInput(type);
    const selectedColor = type === "primary" ? primaryColor : secondaryColor;
    setColor(selectedColor);
  };

  // Función para enviar colores al padre
  const handleApplyColors = () => {
    // ver en consola para testeo
    /*const colors = { primary: primaryColor, secondary: secondaryColor };
    console.log(
      colors
    );*/
    onColorsChange?.({ primary: primaryColor, secondary: secondaryColor });
  };
  return (
    // Card de colores animado con dialogo
    <motion.div
  initial={{ opacity: 0, y: 6 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.35 }}
>
  <Card className="bg-white/70 backdrop-blur-xl border border-white/40 rounded-3xl p-5 shadow-md hover:shadow-lg transition-all duration-300">
    <Dialog>
      <DialogTrigger asChild>
        {/* boton principal */}
        <Button
          className="w-full bg-gradient-to-br from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600
          text-white font-semibold shadow-md hover:shadow-lg transition-all hover:scale-[1.02] active:scale-[0.97] flex items-center justify-center gap-2"
        >
          Personalización de Colores
        </Button>
      </DialogTrigger>

      {/* contenido del dialogo */}
      <DialogContent className=" bg-gradient-to-b from-white via-[#FFF6EF] to-[#FFE8D8] border border-white/40 rounded-3xl shadow-2xl w-[92vw] max-w-sm mx-auto p-4 sm:p-6 overflow-y-auto max-h-[90vh]">
        {/* Botón de cerrar */}
        <DialogClose className="absolute right-4 top-4 rounded-full p-2 hover:bg-white/70 transition-colors z-50">
          <X className="h-5 w-5 text-orange-400" />
        </DialogClose>

        {/* Header */}
        <DialogHeader className="px-6 pt-6 pb-4 border-b border-white/30">
          <DialogTitle className="text-lg font-semibold text-slate-800 text-center">
            Selector de Colores
          </DialogTitle>
        </DialogHeader>

        <div className="px-6 py-6 space-y-6">
          <div className="flex justify-center">
            {/* color picker */}
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
        </div>

        {/* inputs */}
        <div className="space-y-3">
          {/* titulo del input primario */}
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

        {/* Input de color secundario */}
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

        <div className="pt-4">
          <DialogClose asChild>
            <Button
              onClick={handleApplyColors}
              className="w-full bg-gradient-to-br from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600
                text-white font-semibold shadow-md hover:shadow-lg transition-all hover:scale-[1.02] active:scale-[0.97]"
            >
              Aplicar Colores
            </Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  </Card>
</motion.div>

  );
};

export default ColorEditor;
