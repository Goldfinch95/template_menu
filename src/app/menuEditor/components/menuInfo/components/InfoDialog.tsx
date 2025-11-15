"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
  DialogFooter,
  DialogTitle,
} from "@/common/components/ui/dialog";

import { Input } from "@/common/components/ui/input";
import { Label } from "@/common/components/ui/label";
import { Button } from "@/common/components/ui/button";
import Image from "next/image";
import { ImageIcon, Upload } from "lucide-react";
import { HexColorPicker } from "react-colorful";

interface InfoDialogProps {
  trigger?: React.ReactNode;
  defaultTitle?: string;
  defaultPos?: string;
  defaultLogo?: string;
  defaultBackground?: string;
  onSubmit: (data: {
    title: string;
    pos: string;
    logo: File | null;
    background: File | null;
  }) => void;
}

const InfoDialog = ({
  trigger,
  defaultTitle = "",
  defaultPos = "",
  defaultLogo,
  defaultBackground,
  onSubmit,
}: InfoDialogProps) => {
  //estados para el titulo,direccion
  const [title, setTitle] = useState(defaultTitle);
  const [pos, setPos] = useState(defaultPos);
  //estado para los archivos logo y background
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [backgroundFile, setBackgroundFile] = useState<File | null>(null);
  //estados para mostrar el preview de logo y background
  const [logoPreview, setLogoPreview] = useState(defaultLogo || null);
  const [backgroundPreview, setBackgroundPreview] = useState(
    defaultBackground || null
  );

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

  //disparar los alert cuando faltan los campos obligatorios.

  //subir los datos al back
  const handleSubmit = () => {
    console.log("este es el", title);
    console.log("esta es la direccion", pos);
    console.log("esta es el logo", logoFile);
    console.log("este es el background", backgroundFile);
    /*onSubmit({
      title,
      pos,
      logo: logoFile,
      background: backgroundFile,
    });*/
  };

  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>

      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-black">
            Editar información
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-5 py-4">
          {/* Título */}
          <div className="flex flex-col space-y-1">
            <Label className="text-black" htmlFor="title">
              Título
            </Label>
            <Input
              id="title"
              placeholder="Ej: La Pizzería de Mario"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="text-black"
            />
          </div>

          {/* POS */}
          <div className="flex flex-col space-y-1">
            <Label className="text-black" htmlFor="pos">
              Dirección
            </Label>
            <Input
              id="pos"
              placeholder="Ej: Av. Siempre Viva 123"
              value={pos}
              onChange={(e) => setPos(e.target.value)}
              className="text-black"
            />
          </div>

          {/* Logo */}
          <div className="flex flex-col space-y-2">
            <Label className="text-black">Logo</Label>
            <input
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
              className="w-24 h-24 rounded-full bg-slate-100 border border-slate-300 flex items-center justify-center overflow-hidden cursor-pointer hover:ring-2 hover:ring-orange-400 transition-all"
            >
              {logoPreview ? (
                <Image
                  src={logoPreview}
                  alt="Logo preview"
                  width={100}
                  height={100}
                  className="object-cover w-full h-full"
                />
              ) : (
                <Upload className="w-6 h-6 text-slate-500" />
              )}
            </Label>
          </div>

          {/* Background */}
          <div className="flex flex-col space-y-2">
            <Label className="text-black">Imagen de fondo</Label>
            <input
              type="file"
              accept="image/*"
              id="backgroundInput"
              className="hidden"
              onChange={(e) =>
                handleImageChange(e, setBackgroundFile, setBackgroundPreview)
              }
            />

            <Label
              htmlFor="backgroundInput"
              className="w-full h-32 bg-slate-100 border border-slate-300 rounded-xl flex items-center justify-center overflow-hidden cursor-pointer hover:ring-2 hover:ring-orange-400 transition-all"
            >
              {backgroundPreview ? (
                <Image
                  src={backgroundPreview}
                  alt="Background preview"
                  width={600}
                  height={320}
                  className="object-cover w-full h-full"
                />
              ) : (
                <div className="flex items-center gap-2 text-slate-500">
                  <ImageIcon className="w-5 h-5" />
                  Subir imagen
                </div>
              )}
            </Label>
          </div>
        </div>

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
};

export default InfoDialog;
