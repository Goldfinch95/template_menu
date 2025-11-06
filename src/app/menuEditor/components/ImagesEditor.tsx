"use client";

import React, { useEffect, useState } from "react";
import { Card } from "@/common/components/ui/card";

interface ImagesEditorProps {
  logo?: File | null;
  background?: File | null;
  onImagesSubmit?: (images: { logo: File | null; backgroundImage: File | null }) => void;
}

const ImagesEditor = ({
  logo,
  background,
  onImagesSubmit,
}: ImagesEditorProps) => {
  // Estados locales para los inputs
  const [logoFile, setLogoFile] = useState<File | null>(logo || null);
  const [backgroundFile, setBackgroundFile] = useState<File | null>(background || null);

  // Enviar valores al padre cuando cambien los archivos
  useEffect(() => {
    onImagesSubmit?.({
      logo: logoFile,
      backgroundImage: backgroundFile,
    });
  }, [logoFile, backgroundFile, onImagesSubmit]);


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
            type="file"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                setLogoFile(file);
              }
            }}
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
            type="file"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                setBackgroundFile(file);
              }
            }}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg placeholder:text-slate-400 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
          />
        </div>
      </div>
    </Card>
  );
};

export default ImagesEditor;
