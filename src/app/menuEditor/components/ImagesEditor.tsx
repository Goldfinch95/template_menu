"use client"

import React, { useState } from "react";
import { Card } from "@/common/components/ui/card";

interface ImagesEditorProps {
  onImagesSubmit?: (images: { logo: string; backgroundImage: string }) => void;
}

const ImagesEditor = ({ onImagesSubmit }: ImagesEditorProps) => {
  const [logo, setLogo] = useState("");
  const [backgroundImage, setBackgroundImage] = useState("");

  // comprobar valores
  const showValues = () => {
    const values = {
      logo,
      backgroundImage
    };
    
    if(onImagesSubmit){
      onImagesSubmit(values);
    }
  };

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
      {/* Botón de Control */}
      <button
        onClick={showValues}
        className="mt-5 w-full bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
      >
        Ver Valores
      </button>
    </Card>
  );
};

export default ImagesEditor;
