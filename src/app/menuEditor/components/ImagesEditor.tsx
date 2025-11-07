"use client";

import React, { useEffect, useState } from "react";
import { Card } from "@/common/components/ui/card";
import { Upload, Info } from "lucide-react";
import { Spinner } from "@/common/components/ui/spinner";

interface ImagesEditorProps {
  logo?: string;
  background?: string;
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

  //estados de carga de logo e inputs
  const [loadingLogo, setLoadingLogo] = useState(true);
  const [loadingBackground, setLoadingBackground] = useState(true);

  //preview del logo y backgound
  useEffect(() => {
    setLoadingLogo(true);
    setLoadingBackground(true);

    const timer = setTimeout(() => {
      if (logo) {
        setLogoPreview(logo);
      }
      if (background) {
        setBackgroundPreview(background);
      }
      setLoadingLogo(false);
      setLoadingBackground(false);
    }, 700); // ⏱️ 2 segundos de “carga”

    return () => clearTimeout(timer);
  }, [logo, background]);

  // Enviar valores al padre cuando cambien los archivos
  useEffect(() => {
    onImagesSubmit?.({
      logo: logoFile,
      backgroundImage: backgroundFile,
    });
  }, [logoFile, backgroundFile, onImagesSubmit]);

  // cambiar logo
  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  //cambiar el background
  const handleBackgroundChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setBackgroundFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setBackgroundPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Card className="bg-white/80 backdrop-blur-xl border border-white/30 rounded-2xl p-5 shadow-lg max-w-md mx-auto space-y-6">
      <h3 className="text-lg font-bold text-slate-900 text-center mb-2">
        Imágenes del Menú
      </h3>
      {/* Logo */}
      <div className="flex flex-col items-center text-center space-y-3">
        <input
          id="logo"
          type="file"
          accept="image/*"
          onChange={handleLogoChange}
          className="hidden"
        />
        <label
          htmlFor="logo"
          className="w-28 h-28 rounded-full overflow-hidden border-2 border-dashed border-slate-300 bg-slate-50 flex items-center justify-center cursor-pointer hover:border-orange-500 transition-all"
        >
          {loadingLogo ? (
            <Spinner className="w-6 h-6 text-orange-500" />
          ) : logoPreview ? (
            <img
              src={logoPreview}
              alt="Logo preview"
              className="w-full h-full object-cover"
            />
          ) : (
            <Upload className="w-8 h-8 text-slate-400" />
          )}
        </label>
        <p className="text-sm text-slate-600 font-medium">Sube tu logo</p>
        <p className="text-xs text-slate-400">PNG, JPG, SVG hasta 10MB</p>
      </div>
      {/* imagen de fondo */}
      <div className="flex flex-col items-center text-center space-y-3">
        <input
          id="background"
          type="file"
          accept="image/*"
          onChange={handleBackgroundChange}
          className="hidden"
        />
        <label
          htmlFor="background"
          className="w-full aspect-[16/9] rounded-2xl overflow-hidden border-2 border-dashed border-slate-300 bg-slate-50 flex items-center justify-center cursor-pointer hover:border-orange-500 transition-all"
        >
          {loadingBackground ? (
            <Spinner className="w-6 h-6 text-orange-500" />
          ) : backgroundPreview ? (
            <img
              src={backgroundPreview}
              alt="Background preview"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="flex flex-col items-center">
              <Upload className="w-8 h-8 text-slate-400 mb-1" />
              <p className="text-sm text-slate-500">Sube tu imagen de fondo</p>
            </div>
          )}
        </label>
        <p className="text-xs text-slate-400">PNG, JPG hasta 10MB</p>
      </div>
    </Card>
  );
};

export default ImagesEditor;
