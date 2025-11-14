"use client";

import React, { useEffect, useState } from "react";
import { Input } from "@/common/components/ui/input";
import { Label } from "@radix-ui/react-label";
import { Card } from "@/common/components/ui/card";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
} from "@/common/components/ui/dialog";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/common/components/ui/alert";
import Image from "next/image";
import { BookImage } from "lucide-react";
import { Spinner } from "@/common/components/ui/spinner";
import { Button } from "@/common/components/ui/button";
import { motion } from "framer-motion";
import { Edit3, X, Check } from "lucide-react";

interface ImagesEditorProps {
  title: string;
  logo?: string;
  background?: string;
  onImagesSubmit?: (images: {
    logo: File | null;
    backgroundImage: File | null;
  }) => void;
}

const ImagesEditor = ({
  title,
  logo,
  background,
  onImagesSubmit,
}: ImagesEditorProps) => {
  // estado para el preview de logo
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  // estado de carga del logo
  const [loadingLogo, setLoadingLogo] = useState(false);

  useEffect(() => {
    if (logo) setLoadingLogo(true);
    const timer = setTimeout(() => {
      if (logo) {
        setLogoPreview(logo);
        setLoadingLogo(false);
      }
    }, 700);
    return () => clearTimeout(timer);
  }, [logo]);
  /* // Estados para el logo y la imagen de fondo
  const [logoFile, setLogoFile] = useState<File | null>(logo || null);
  const [backgroundFile, setBackgroundFile] = useState<File | null>(
    background || null
  );
  //estados para el PREVIEW del logo y la imagen de fondo
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [backgroundPreview, setBackgroundPreview] = useState<string | null>(
    null
  );

  //estados de CARGA de logo y la imagen de fondo.
  const [loadingLogo, setLoadingLogo] = useState(false);
  const [loadingBackground, setLoadingBackground] = useState(false);

  //cargar logo y imagen de fondo.
  useEffect(() => {
    // Si existe alguno, activar los estados de carga
    if (logo) setLoadingLogo(true);
    if (background) setLoadingBackground(true);

    // Espera al menos 0.7s antes de mostrarlos.
    const timer = setTimeout(() => {
      if (logo) {
        setLogoPreview(logo);
        setLoadingLogo(false);
      }
      if (background) {
        setBackgroundPreview(background);
        setLoadingBackground(false);
      }
    }, 700);

    return () => clearTimeout(timer);
  }, [logo, background]);

  //al cargar, detectar si cambiaron los archivos y enviar los cambios al componente padre.
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
  };*/

  return (
    // card informacion del restaurante animado
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Card className="max-w-md w-full bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-slate-200/50 overflow-hidden">
        <div className="px-8 py-8">
          {/* Título */}
          <div className="text-center mb-6">
            <p className="text-sm font-medium text-slate-500 uppercase tracking-wider mb-4">
              Información del menú
            </p>
            <h2 className="text-2xl font-bold text-slate-800 tracking-tight">{title}</h2>
          </div>
          {/* Logo */}
          <div className="flex flex-col items-center space-y-4 mb-6">
            <Label
              htmlFor="logo"
              className={`w-32 h-32 rounded-full overflow-hidden flex items-center justify-center cursor-pointer
                  transition-all duration-300 transform hover:scale-105
                ${logoPreview ? "ring-4 ring-slate-200 shadow-xl" : "border-4 border-dashed border-slate-300 bg-slate-50 shadow-lg"}
                bg-slate-50 hover:border-orange-500 transition-all`}
            >
              {loadingLogo ? (
                <Spinner className="w-8 h-8 text-orange-500" />
              ) : logoPreview ? (
                <Image src={logoPreview} alt="Logo preview" width={100} height={100} className="w-full h-full object-cover" />
              ) : (
                <BookImage className="w-8 h-8 text-slate-400" />
              )}
            </Label>
          </div>

          {/* Botón de Editar */}
          <Dialog>
            <DialogTrigger asChild>
              <Button className="w-full mt-6 bg-gradient-to-r from-orange-400 to-orange-500 py-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 font-semibold text-base group">
                Editar
              </Button>
            </DialogTrigger>

            <DialogContent>
              <DialogHeader>Editar Información</DialogHeader>
              <div className="p-4">
                <p>Aquí puedes editar la información del restaurante.</p>
              </div>
              <DialogFooter>
                <Button variant="outline" className="mr-2">
                  Cerrar
                </Button>
                <Button>Guardar</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </Card>
    </motion.div>
  );
};

export default ImagesEditor;

// card imagenes del menú
{
  /*<Card
      className="bg-white/80 backdrop-blur-xl border border-white/30 rounded-2xl 
        p-5 shadow-lg max-w-md mx-auto space-y-6"
    >
      <h3 className="text-lg font-bold text-slate-900 text-center mb-2">
        Imágenes del Menú
      </h3>
      {/* Logo 
      <div className="flex flex-col items-center text-center space-y-3">
        <input
          id="logo"
          type="file"
          accept="image/*"
          onChange={handleLogoChange}
          className="hidden"
        />
        <Label
          htmlFor="logo"
          className={`w-28 h-28 rounded-full overflow-hidden 
            ${
              logoPreview
                ? "border-0"
                : "border-2 border-dashed border-slate-300"
            } 
            bg-slate-50 flex items-center justify-center cursor-pointer hover:border-orange-500 transition-all`}
        >
          {/* carga del logo 
          {loadingLogo ? (
            <Spinner className="w-6 h-6 text-orange-500" />
          ) : logoPreview ? (
            <Image
              src={logoPreview}
              alt="Logo preview"
              width={100}
              height={100}
              className="w-full h-full object-cover"
              priority
            />
          ) : (
            <Upload className="w-8 h-8 text-slate-400" />
          )}
        </Label>
        {/* titulo y subtitulo sin logo 
        <p className="text-sm text-slate-600 font-medium">
          {logoPreview ? "Toca la imagen para cambiarlo" : "Carga tu imagen"}
        </p>
        <p className="text-xs text-slate-400">PNG, JPG, SVG hasta 10MB</p>
      </div>
      {/* fondo 
      <div className="flex flex-col items-center text-center space-y-3">
        <input
          id="background"
          type="file"
          accept="image/*"
          onChange={handleBackgroundChange}
          className="hidden"
        />
        <Label
          htmlFor="background"
          className={`w-full aspect-[16/9] rounded-2xl overflow-hidden 
            ${
              backgroundPreview
                ? "border-0"
                : "border-2 border-dashed border-slate-300"
            } 
            bg-slate-50 flex items-center justify-center cursor-pointer hover:border-orange-500 transition-all`}
        >
          {/* carga del fondo 
          {loadingBackground ? (
            <Spinner className="w-6 h-6 text-orange-500" />
          ) : backgroundPreview ? (
            <Image
              src={backgroundPreview}
              alt="Background preview"
              width={600} 
              height={340} 
              className="w-full h-full object-cover"
              priority
            />
          ) : (
            <div className="flex flex-col items-center">
              <Upload className="w-8 h-8 text-slate-400 mb-1" />
              {/* titulo sin fondo *
              <p className="text-sm text-slate-500">
                {" "}
                Carga la imagen de fondo
              </p>
            </div>
          )}
        </Label>
        {/* titulo con fondo 
        {backgroundPreview && (
          <p className="text-sm text-slate-600 font-medium">
            Toca la imagen para cambiarlo
          </p>
        )}
        {/* subtitulo con/sin fondo 
        <p className="text-xs text-slate-400">PNG, JPG hasta 10MB</p>
      </div>
    </Card>*/
}
