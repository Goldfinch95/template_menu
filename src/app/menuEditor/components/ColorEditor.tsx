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

import { HexColorPicker } from "react-colorful";

import { X } from "lucide-react";

interface ColorEditorProps {
  onColorsChange?: (colors: { primary: string; secondary: string }) => void;
}

const ColorEditor = ({ onColorsChange }: ColorEditorProps) => {
  const [color, setColor] = useState("#fffff");
  const [primaryColor, setPrimaryColor] = useState("#000000");
  const [secondaryColor, setSecondaryColor] = useState("#000000");
  const [activeColorInput, setActiveColorInput] = useState<
    "primary" | "secondary"
  >("primary");

  // Agregar refs para los inputs
  const primaryInputRef = useRef<HTMLInputElement>(null);
  const secondaryInputRef = useRef<HTMLInputElement>(null);

  // maneja los cambios del input primario
  const selectPrimaryColor = (e: React.ChangeEvent<HTMLInputElement>) => {
    const primaryColor = e.target.value;
    setPrimaryColor(primaryColor);
    setActiveColorInput("primary");
    setColor(primaryColor);
    console.log("Input seleccionado: PRIMARY", primaryColor);
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
    console.log("Input seleccionado: SECONDARY", secondaryColor);
  };

  //detecta el cambio de color en consola.
  const detectColorChange = (newColor: string) => {
    setColor(newColor);

    // Detectar cuál input tiene el foco
    if (document.activeElement === primaryInputRef.current) {
      setPrimaryColor(newColor);
      setActiveColorInput("primary");
      console.log("Picker usado - Input PRIMARIO activo:", newColor);
    } else if (document.activeElement === secondaryInputRef.current) {
      setSecondaryColor(newColor);
      setActiveColorInput("secondary");
      console.log("Picker usado - Input SECUNDARIO activo:", newColor);
    } else {
      // Si ningún input tiene foco, usar el último activo
      if (activeColorInput === "primary") {
        setPrimaryColor(newColor);
      } else {
        setSecondaryColor(newColor);
      }
      console.log(
        `Picker usado - Último activo (${activeColorInput}):`,
        newColor
      );
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
        {/* Dialog de shadcn/ui */}
        <Dialog>
          <DialogTrigger asChild>
            <button
              className="w-full py-3 px-4 bg-gradient-to-br from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600
                text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              Personalización de Colores
            </button>
          </DialogTrigger>

          <DialogContent className="bg-gradient-to-b from-white via-[#FFF6EF] to-[#FFE8D8] border border-white/40 rounded-2xl shadow-2xl sm:max-w-md p-0 overflow-hidden">
            {/* Botón de cerrar */}
            <DialogClose className="absolute right-4 top-5 rounded-full p-2 hover:bg-white/50 transition-colors z-50">
              <X className="h-5 w-5 text-orange-400" />
            </DialogClose>
            {/* Header */}
            <DialogHeader className="p-6 pb-4 border-b border-white/40 backdrop-blur-xl text-black">
              <DialogTitle className="text-xl font-bold text-slate-800 text-center ">
                Selector de Color
              </DialogTitle>
            </DialogHeader>
            {/* Aquí puedes agregar el contenido del diálogo */}
            <div className="p-6  space-y-6">
              <div className="flex justify-center">
                <div className="w-full h-full">
                  <HexColorPicker
                    color={color}
                    onChange={detectColorChange}
                    style={{ width: "100%", height: "300px" }}
                  />
                </div>
              </div>
            </div>
            {/* Input de color primario */}
            <div className="space-y-3">
              <label className="block pl-5 text-sm font-semibold text-slate-700">
                Color Primario
              </label>

              <div className="flex items-center gap-3 px-4">
                <div
                  className="w-12 h-12 rounded-lg border-2 border-white/60 shadow-md flex-shrink-0"
                  style={{ backgroundColor: primaryColor }}
                />
                <input
                  ref={primaryInputRef}
                  type="text"
                  onChange={selectPrimaryColor}
                  onFocus={() => {
                    setActiveColorInput("primary");
                    setColor(primaryColor);
                    console.log("Focus en input PRIMARY");
                  }}
                  value={primaryColor}
                  className="flex-1 px-4 py-3 rounded-lg border border-white/40 bg-white/50 backdrop-blur-sm text-slate-700 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                  placeholder={color}
                />
              </div>
            </div>
            {/* Input de color secundario */}
            <div className="space-y-3">
              <label className="block pl-5 text-sm font-semibold text-slate-700">
                Color Secundario
              </label>
              <div className="flex items-center gap-3 px-4 pb-4">
                <div
                  className="w-12 h-12 rounded-lg border-2 border-white/60 shadow-md flex-shrink-0"
                  style={{ backgroundColor: secondaryColor }}
                />
                <input
                  ref={secondaryInputRef}
                  type="text"
                  onChange={selectSecondaryColor}
                  onFocus={() => {
                    setActiveColorInput("secondary");
                    setColor(secondaryColor);
                    console.log("Focus en input SECONDARY");
                  }}
                  value={secondaryColor}
                  className="flex-1 px-4 py-3 rounded-lg border border-white/40 bg-white/50 backdrop-blur-sm text-slate-700 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                  placeholder={color}
                />
              </div>
            </div>
            <DialogClose asChild>
              <button
                onClick={handleApplyColors}
                className="w-full py-3 px-4 bg-gradient-to-br from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600
      text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                Aplicar Colores
              </button>
            </DialogClose>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
};

export default ColorEditor;
