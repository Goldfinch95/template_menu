"use client";

import React, { useEffect, useState } from "react";
import { Card } from "@/common/components/ui/card";
import { Upload, Info } from "lucide-react";

interface ImagesEditorProps {
  logo?: File | null;
  background?: File | null;
  onImagesSubmit?: (images: {
    logo: File | null;
    backgroundImage: File | null;
  }) => void;
}

const ImagesEditor = ({
  logo,
  background,
  onImagesSubmit,
}: ImagesEditorProps) => {
  // Estados locales para los inputs
  const [logoFile, setLogoFile] = useState<File | null>(logo || null);
  const [logoPreview, setLogoPreview] = useState(null);
  const [backgroundFile, setBackgroundFile] = useState<File | null>(
    background || null
  );
  const [backgroundPreview, setBackgroundPreview] = useState(null);

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
          <div className="relative">
            <input
              id="logo"
              name="logo"
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  setLogoFile(file);
                  const reader = new FileReader();
                  reader.onloadend = () => {
                    setLogoPreview(reader.result);
                  };
                  reader.readAsDataURL(file);
                }
              }}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg placeholder:text-slate-400 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
            />
          </div>
          {/* Preview del Logo */}
          {logoPreview && (
            <div className="mt-3 p-3 bg-slate-50 rounded-lg border border-slate-200">
              <p className="text-xs text-slate-600 mb-2 font-medium">
                Vista previa:
              </p>
              <div className="flex justify-center">
                <img
                  src={logoPreview}
                  alt="Preview del logo"
                  className="max-h-32 rounded-lg shadow-sm object-contain"
                />
              </div>
              <p className="text-xs text-slate-500 mt-2 text-center">
                {logoFile?.name}
              </p>
            </div>
          )}

          {/* Placeholder cuando no hay imagen */}
          {!logoPreview && (
            <div className="mt-3 p-8 bg-slate-50 rounded-lg border-2 border-dashed border-slate-300 flex flex-col items-center justify-center text-center">
              <Upload className="w-8 h-8 text-slate-400 mb-2" />
              <p className="text-sm text-slate-500">Sube tu logo aquí</p>
              <p className="text-xs text-slate-400 mt-1">
                PNG, JPG, SVG hasta 10MB
              </p>
            </div>
          )}
        </div>

        <div>
          <label
            htmlFor="backgroundImage"
            className="block text-sm font-medium text-slate-700 mb-2"
          >
            URL de Imagen de Fondo
          </label>
          <div className="relative">
            <input
              id="backgroundImage"
              name="backgroundImage"
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  setBackgroundFile(file);
                  const reader = new FileReader();
                  reader.onloadend = () => {
                    setBackgroundPreview(reader.result as any);
                  };
                  reader.readAsDataURL(file);
                }
              }}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg placeholder:text-slate-400 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
            />
          </div>
          {/* Preview del Fondo */}
          {backgroundPreview && (
            <div className="mt-3 p-3 bg-slate-50 rounded-lg border border-slate-200">
              <p className="text-xs text-slate-600 mb-2 font-medium">
                Vista previa:
              </p>
              <div className="flex justify-center">
                <img
                  src={backgroundPreview}
                  alt="Preview de imagen de fondo"
                  className="max-h-48 w-full rounded-lg shadow-sm object-cover"
                />
              </div>
              <p className="text-xs text-slate-500 mt-2 text-center">
                {backgroundFile?.name}
              </p>
            </div>
          )}

          {/* Placeholder cuando no hay imagen */}
          {!backgroundPreview && (
            <div className="mt-3 p-8 bg-slate-50 rounded-lg border-2 border-dashed border-slate-300 flex flex-col items-center justify-center text-center">
              <Upload className="w-8 h-8 text-slate-400 mb-2" />
              <p className="text-sm text-slate-500">
                Sube tu imagen de fondo aquí
              </p>
              <p className="text-xs text-slate-400 mt-1">PNG, JPG hasta 10MB</p>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

export default ImagesEditor;
