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

import { HexColorPicker } from "react-colorful";

import { X } from "lucide-react";

interface ColorEditorProps {
  primary: string;
  secondary: string;
  onColorsChange?: (colors: { primary: string; secondary: string }) => void;
}

const ColorEditor = ({ primary, secondary, onColorsChange }: ColorEditorProps) => {
  const [color, setColor] = useState("#fffff");
  const [primaryColor, setPrimaryColor] = useState("#000000");
  const [secondaryColor, setSecondaryColor] = useState("#000000");
  const [activeColorInput, setActiveColorInput] = useState<
    "primary" | "secondary"
  >("primary");

  // Agregar refs para los inputs
  const primaryInputRef = useRef<HTMLInputElement>(null);
  const secondaryInputRef = useRef<HTMLInputElement>(null);

  // Inicializar con los valores del padre cuando lleguen
      useEffect(() => {
        if (primary) setPrimaryColor(primary);
        if (secondary) setSecondaryColor(secondary);
      }, [primary, secondary]);

  // maneja los cambios del input primario
  const selectPrimaryColor = (e: React.ChangeEvent<HTMLInputElement>) => {
    const primaryColor = e.target.value;
    setPrimaryColor(primaryColor);
    setActiveColorInput("primary");
    setColor(primaryColor);
    // Validar que sea un hex válido antes de actualizar el picker
    /*if (/^#[0-9A-Fa-f]{6}$/.test(primaryColor)) {
    setColor(primaryColor);
  }*/
  };

  // maneja los cambios del input secundario

  const selectSecondaryColor = (e: React.ChangeEvent<HTMLInputElement>) => {
    const secondaryColor = e.target.value;
    setSecondaryColor(secondaryColor);
    setActiveColorInput("secondary");
    setColor(secondaryColor);
  };

  //detecta el cambio de color en consola.
  const detectColorChange = (newColor: string) => {
    setColor(newColor);

    // Detectar cuál input tiene el foco
    if (document.activeElement === primaryInputRef.current) {
      setPrimaryColor(newColor);
      setActiveColorInput("primary");
    } else if (document.activeElement === secondaryInputRef.current) {
      setSecondaryColor(newColor);
      setActiveColorInput("secondary")
    } else {
      // Si ningún input tiene foco, usar el último activo
      if (activeColorInput === "primary") {
        setPrimaryColor(newColor);
      } else {
        setSecondaryColor(newColor);
      }
      
    }
  };

  // Función para enviar colores al padre
  const handleApplyColors = () => {
    if (onColorsChange) {
      onColorsChange({ primary: primaryColor, secondary: secondaryColor });
    }
  };

  return (
    <>
      <div className="bg-white/70 backdrop-blur-xl border border-white/40 rounded-2xl p-5 shadow-lg">
        <Dialog>
          {/* boton principal */}
          <DialogTrigger asChild>
            <Button
              className="w-full bg-gradient-to-br from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600
            text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              Personalización de Colores
            </Button>
          </DialogTrigger>
          {/* contenido del dialogo */}
          <DialogContent className="bg-gradient-to-b from-white via-[#FFF6EF] to-[#FFE8D8] border border-white/40 rounded-2xl shadow-2xl sm:max-w-md overflow-hidden">
            {/* Botón de cerrar */}
            <DialogClose className="absolute right-4 top-4 rounded-full p-2 hover:bg-white/60 transition-colors z-50">
              <X className="h-5 w-5 text-orange-400" />
            </DialogClose>
            {/* Header */}
            <DialogHeader className="px-6 pt-6 pb-4 border-b border-white/40 backdrop-blur-sm">
              <DialogTitle className="text-xl font-bold text-slate-800 text-center">
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
                  height: "240px",
                  borderRadius: "1rem",
                }}
                  />
                </div>
              </div>
            
            {/* Input de color primario */}
            <div className="space-y-2">
              <Label className="block text-sm font-medium text-slate-700">
                Color Base
              </Label>

              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-lg border border-white/50 shadow-inner"
                  style={{ backgroundColor: primaryColor }}
                />
                <Input
                  ref={primaryInputRef}
                  type="text"
                  onChange={selectPrimaryColor}
                  onFocus={() => {
                    setActiveColorInput("primary");
                    setColor(primaryColor);
                    console.log("Focus en input PRIMARY");
                  }}
                  value={primaryColor}
                  className="font-mono text-sm text-black bg-white"
                  placeholder={color}
                />
              </div>
            </div>
            {/* Input de color secundario */}
            <div className="space-y-2">
              <Label className="block text-sm font-medium text-slate-700">
                Color Secundario
              </Label>
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-lg border border-white/50 shadow-inner"
                  style={{ backgroundColor: secondaryColor }}
                />
                <Input
                  ref={secondaryInputRef}
                  type="text"
                  onChange={selectSecondaryColor}
                  onFocus={() => {
                    setActiveColorInput("secondary");
                    setColor(secondaryColor);
                    console.log("Focus en input SECONDARY");
                  }}
                  value={secondaryColor}
                  className="font-mono text-sm text-black bg-white"
                  placeholder={color}
                />
              </div>
            </div>
            <div className="border-t border-white/30 p-6 pt-4">
            <DialogClose asChild>
              <Button
                onClick={handleApplyColors}
                className="w-full bg-gradient-to-br from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600
                text-white font-semibold shadow-lg hover:shadow-xl transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                Aplicar Colores
              </Button>
            </DialogClose>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
};

export default ColorEditor;
