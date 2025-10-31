"use client"

import React, { useEffect,useState } from "react";
import { Card } from "@/common/components/ui/card";

interface ImagesEditorProps {
  onImagesSubmit?: (images: { logo: string; backgroundImage: string }) => void;
}

const ImagesEditor = ({ onImagesSubmit }: ImagesEditorProps) => {
  // Estados locales para los inputs
  const [logo, setLogo] = useState("");
  const [backgroundImage, setBackgroundImage] = useState("");
  // Estados para debounce (espera antes de enviar)
  const [debouncedLogo, setDebouncedLogo] = useState("");
  const [debouncedBackgroundImage, setDebouncedBackgroundImage] = useState("");

  // Debounce: espera 500ms después de que el usuario deja de escribir
useEffect(() => {
  const timer = setTimeout(() => {
    setDebouncedLogo(logo);
    setDebouncedBackgroundImage(backgroundImage);
  }, 500);

  return () => clearTimeout(timer);
}, [logo, backgroundImage]);

  // Enviar valores al padre cuando cambien los valores debounced
  useEffect(() => {
  if (debouncedLogo && debouncedBackgroundImage) {
    onImagesSubmit?.({ 
        logo: debouncedLogo,
        backgroundImage: debouncedBackgroundImage
      });
  }
}, [debouncedLogo, debouncedBackgroundImage, onImagesSubmit]);

  return (
    <Card className="bg-white/70 backdrop-blur-xl border border-white/40 rounded-2xl p-5 shadow-lg">
      {/* Header con Tooltip */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <h3 className="font-bold text-slate-900 text-lg">URLs de Imágenes</h3>
          
        </div>
      </div>
      {/* Inputs */}
      <div className="space-y-5">
        <div>
          <label
            htmlFor="logo"
            className="block text-sm font-medium text-slate-700 mb-2"
          >
            URL del Logo
          </label>
          <input
            id="logo"
            name="logo"
            type="url"
            value={logo}
            onChange={(e) => setLogo(e.target.value)}
            placeholder="https://ejemplo.com/logo.png"
            className="w-full px-4 py-2 border border-slate-300 rounded-lg placeholder:text-slate-400 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
          />
        </div>

        <div>
          <label
            htmlFor="backgroundImage"
            className="block text-sm font-medium text-slate-700 mb-2"
          >
            URL de Imagen de Fondo
          </label>
          <input
            id="backgroundImage"
            name="backgroundImage"
            type="url"
            value={backgroundImage}
            onChange={(e) => setBackgroundImage(e.target.value)}
            placeholder="https://ejemplo.com/fondo.png"
            className="w-full px-4 py-2 border border-slate-300 rounded-lg placeholder:text-slate-400 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
          />
        </div>
      </div>
    </Card>
  );
};

export default ImagesEditor;
