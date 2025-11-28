"use client";

import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Items, newItem } from "@/interfaces/menu";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTrigger,
  DialogFooter,
  DialogTitle,
} from "@/common/components/ui/dialog";
import {
  Alert,
  AlertDescription,
} from "@/common/components/ui/alert";
import { Input } from "@/common/components/ui/input";
import { Label } from "@/common/components/ui/label";
import { Button } from "@/common/components/ui/button";
import { createItem, updateItem, upsertItemImages } from "@/common/utils/api";
import Image from "next/image"; // Importa Image desde next/image

interface ItemDialogProps {
  trigger: React.ReactNode;
  categoryId: number;
  item?: Items;
  onItemSaved?: () => void;
}

const ItemDialog = ({
  trigger,
  item,
  categoryId,
  onItemSaved,
}: ItemDialogProps) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState<string>("");
  const [price, setPrice] = useState<string | "">("");

  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);

  const isEditMode = !!item;

  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (item) {
      setTitle(item.title || "");
      setDescription(item.description || "");
      setPrice(item.price?.toString() || "");

      if (item.images && item.images.length > 0) {
        setPreviewUrl(item.images[0].url);
      }
    } else {
      setTitle("");
      setDescription("");
      setPrice("");
      setSelectedImage(null);
      setPreviewUrl("");
    }
  }, [item]);

  useEffect(() => {
    return () => {
      if (previewUrl && previewUrl.startsWith("blob:")) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setPrice("");
    setSelectedImage(null);
    if (previewUrl && previewUrl.startsWith("blob:")) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl("");
    setAlertMessage(null);
  };

  const validateFields = () => {
    const errors: string[] = [];

    if (title.trim().length < 3) {
      errors.push("• El título debe tener al menos 3 caracteres.");
    }

    if (errors.length > 0) {
      setAlertMessage(errors.join("\n"));
      return false;
    }

    setAlertMessage(null);
    return true;
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        setAlertMessage("La imagen no puede superar los 10MB");
        return;
      }

      if (!file.type.startsWith("image/")) {
        setAlertMessage("Solo se permiten imágenes");
        return;
      }

      setSelectedImage(file);

      if (previewUrl && previewUrl.startsWith("blob:")) {
        URL.revokeObjectURL(previewUrl);
      }
      const newPreviewUrl = URL.createObjectURL(file);
      setPreviewUrl(newPreviewUrl);
      setAlertMessage(null);
    }
  };

  const handleSave = async () => {
    setAlertMessage(null);

    const isValid = validateFields();
    if (!isValid) return;
    setLoading(true);

    try {
      let savedItemId = item?.id;

      if (isEditMode) {
        const payload: Partial<Items> = {
          title: title.trim(),
          description: description.trim() || undefined,
          price: Number(price),
        };
        await updateItem(item.id, payload);
        savedItemId = item.id;

        if (selectedImage) {
          const existingImageId = item.images?.[0]?.id;
          const images = [
            {
              ...(existingImageId && { id: existingImageId }),
              fileField: "file_0",
              alt: title,
              sortOrder: 0,
              active: true,
            },
          ];
          await upsertItemImages(savedItemId, images, [selectedImage]);
        }
      } else {
        const payload: newItem = {
          categoryId: Number(categoryId),
          title: title.trim(),
          description: description.trim(),
          price: Number(price),
        };
        const newItem = await createItem(payload);
        savedItemId = newItem.id;

        if (selectedImage) {
          const images = [
            {
              fileField: "file_0",
              alt: title,
              sortOrder: 0,
              active: true,
            },
          ];
          await upsertItemImages(savedItemId, images, [selectedImage]);
        }
      }

      onItemSaved?.();

      if (!isEditMode) {
        resetForm();
      }

      document.querySelector<HTMLButtonElement>("[data-dialog-close]")?.click();
      setIsOpen(false);
    } catch (err: any) {
      setAlertMessage(err.message || "Error al guardar el ítem");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="rounded-2xl max-w-md bg-white/90 backdrop-blur-xl border border-white/30 [&>button]:hidden">
        <DialogHeader>
          <div className="relative flex justify-center items-center py-2 w-full">
            <DialogTitle className="text-slate-800 text-lg font-semibold">
              {isEditMode ? "Editar plato" : "Crear plato"}
            </DialogTitle>

            <DialogClose className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full hover:bg-white/70 transition-colors">
              <X className="h-5 w-5 text-orange-400" />
            </DialogClose>
          </div>
        </DialogHeader>
        {alertMessage && (
          <Alert className="bg-red-100 border border-red-400 text-red-700 p-4 rounded-xl flex items-start gap-3">
            <X className="w-5 h-5 mt-1" />
            <div>
              <AlertDescription className="whitespace-pre-line mt-1">
                {alertMessage}
              </AlertDescription>
            </div>
          </Alert>
        )}
        <div className="flex flex-col space-y-2">
          <Label className="text-slate-700 text-base" htmlFor="categoryTitle">
            Titulo del plato
          </Label>
          <Input
            placeholder="Plato, Bebida, Postre"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="bg-white border-slate-300 shadow-sm text-base
                focus-visible:border-orange-400
                focus-visible:ring-2 focus-visible:ring-orange-200/70
                rounded-xl transition-all duration-200"
          />
          <Label className="text-slate-700 text-base" htmlFor="categoryTitle">
            Descripción
          </Label>
          <Input
            placeholder="Descripción"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="bg-white border-slate-300 shadow-sm text-base
                focus-visible:border-orange-400
                focus-visible:ring-2 focus-visible:ring-orange-200/70
                rounded-xl transition-all duration-200"
          />
          <Label className="text-slate-700 text-base" htmlFor="categoryTitle">
            Precio
          </Label>
          <Input
            placeholder="$1200.00"
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="bg-white border-slate-300 shadow-sm text-base
                focus-visible:border-orange-400
                focus-visible:ring-2 focus-visible:ring-orange-200/70
                rounded-xl transition-all duration-200"
          />
        </div>
        <div className="relative w-full h-full group">
          <Input
            type="file"
            accept="image/*"
            className="mt-4 hidden"
            id="image-upload-input"
            onChange={handleImageChange}
          />
          <Label
            htmlFor="image-upload-input"
            className="block w-full h-64 rounded-2xl overflow-hidden bg-slate-50 border-2 border-dashed border-slate-300 hover:border-orange-500 transition-all cursor-pointer"
          >
            {previewUrl ? (
              <div className="relative w-full h-full">
                <Image
                  src={previewUrl}
                  alt="Preview"
                  className="w-full h-full object-cover"
                  layout="fill"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="text-white font-medium">Cambiar imagen</span>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full">
                <span className="text-slate-400">
                  {selectedImage ? "1 imagen seleccionada" : "Subir imagen"}
                </span>
              </div>
            )}
          </Label>
          <p className="text-base text-slate-400 mt-2">PNG, JPG hasta 10MB</p>
          <DialogFooter className="mt-5">
            <Button
              onClick={handleSave}
              disabled={loading}
              className="bg-gradient-to-br from-orange-400 to-orange-500 text-white"
            >
              {loading
                ? "Guardando..."
                : isEditMode
                ? "Guardar cambios"
                : "Crear plato"}
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ItemDialog;
