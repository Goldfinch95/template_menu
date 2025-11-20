"use client";

import React, { useState, useEffect } from "react";
import { Utensils, Pencil, Trash2, Plus, X, Upload } from "lucide-react";
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
  AlertTitle,
} from "@/common/components/ui/alert";
import { Input } from "@/common/components/ui/input";
import { Label } from "@/common/components/ui/label";
import { Button } from "@/common/components/ui/button";
import { createItem, updateItem, upsertItemImages } from "@/common/utils/api";

interface ItemDialogProps {
  trigger: React.ReactNode;
  categoryId: number;
  item?: Items; // Tu interfaz Items si la tenés
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
  const [error, setError] = useState<string | null>(null);

  const [alertMessage, setAlertMessage] = useState<string | null>(null);

  // Detectar si estamos en modo EDITAR
  const isEditMode = !!item;

  // Estado para controlar la apertura/cierre del Dialog
  const [isOpen, setIsOpen] = useState(false);

  // Cargar datos del item cuando estamos editando
  useEffect(() => {
    if (item) {
      setTitle(item.title || "");
      setDescription(item.description || "");
      setPrice(item.price?.toString() || "");

      // Mostrar imagen existente si hay
      if (item.images && item.images.length > 0) {
        setPreviewUrl(item.images[0].url);
      }
    } else {
      // Limpiar el formulario si no hay item (modo crear)
      setTitle("");
      setDescription("");
      setPrice("");
      setSelectedImage(null);
      setPreviewUrl("");
    }
  }, [item]);

  // Limpiar preview URL cuando se desmonta
  useEffect(() => {
    return () => {
      if (previewUrl && previewUrl.startsWith("blob:")) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  //validacion
  const validateFields = () => {
    const errors: string[] = [];

    // Validación título
    if (title.trim().length < 3) {
      errors.push("• El título debe tener al menos 3 caracteres.");
    }

    // Validación precio
    if (!price || isNaN(Number(price)) || Number(price) <= 0) {
      errors.push("• El precio debe ser un número mayor a 0.");
    }

    // Validación imagen (si querés que sea obligatoria)
    if (!isEditMode && !previewUrl) {
      errors.push("• Debes subir una imagen del plato.");
    }

    // Si HAY errores → mostrar alerta
    if (errors.length > 0) {
      setAlertMessage(errors.join("\n"));
      return false;
    }

    // Si está todo OK → limpiar alerta
    setAlertMessage(null);
    return true;
  };
  //cambio de imagen visual
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validar tamaño (10MB)
      if (file.size > 10 * 1024 * 1024) {
        setError("La imagen no puede superar los 10MB");
        return;
      }

      // Validar tipo
      if (!file.type.startsWith("image/")) {
        setError("Solo se permiten imágenes");
        return;
      }

      setSelectedImage(file);

      // Crear preview
      if (previewUrl && previewUrl.startsWith("blob:")) {
        URL.revokeObjectURL(previewUrl);
      }
      const newPreviewUrl = URL.createObjectURL(file);
      setPreviewUrl(newPreviewUrl);
      setError(null);
    }
  };

  //guardar item en la BD
  const handleSave = async () => {
    setError(null);

    const isValid = validateFields();
    if (!isValid) return;

    if (!title.trim()) {
      setError("El título es obligatorio");
      return;
    }
    if (!price || isNaN(Number(price)) || Number(price) <= 0) {
      setError("El precio es obligatorio y debe ser mayor a 0");
      return;
    }

    setLoading(true);
    console.log(categoryId);

    try {
      let savedItemId = item?.id;
      //si estamos editando item

      if (isEditMode) {
        const payload: Partial<Items> = {
          title: title,
          description: description || undefined,
          price: Number(price),
          //images: images
        };
        console.log("🔄 Actualizando item:", item.id, payload);
        await updateItem(item.id, payload);
        savedItemId = item.id;
        // Si hay una nueva imagen seleccionada, subirla
        const existingImageId = item.images?.[0]?.id;

        if (selectedImage) {
          console.log("📸 Subiendo nueva imagen para item existente");

          // Si ya existía una imagen, la actualizamos; si no, la creamos
          const existingImageId = item.images?.[0]?.id;

          const images = [
            {
              ...(existingImageId && { id: existingImageId }), // Si existe, incluir el ID
              fileField: "file_0",
              alt: title,
              sortOrder: 0,
              active: true,
            },
          ];

          await upsertItemImages(savedItemId, images, [selectedImage]);
        }
      }
      //si estamos creando item
      else {
        const payload: newItem = {
          categoryId: Number(categoryId),
          title: title,
          description: description,
          price: Number(price),
          //images: images,
        };
        console.log("✅ payload:", payload);
        const newItem = await createItem(payload);
        savedItemId = newItem.id;
        // Si hay una imagen seleccionada subirla al ítem recién creado

        // Si hay una imagen seleccionada, subirla al ítem recién creado
        if (selectedImage) {
          console.log("📸 Subiendo imagen del nuevo ítem:", {
            itemId: savedItemId,
            fileName: selectedImage.name,
            fileSize: selectedImage.size,
            fileType: selectedImage.type,
          });

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
      //notificar
      onItemSaved?.();
      // Cierra el dialog automáticamente (Shadcn)
      document.querySelector<HTMLButtonElement>("[data-dialog-close]")?.click();
      setIsOpen(false);
    } catch (err: any) {
      setError(err.message || "Error al guardar el ítem");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="rounded-2xl max-w-md bg-white/90 backdrop-blur-xl border border-white/30">
        <DialogClose className="absolute right-4 top-4 rounded-full p-2 hover:bg-white/70 transition-colors z-50">
          <X className="h-5 w-5 text-orange-400" />
        </DialogClose>
        <DialogHeader>
          <DialogTitle className="text-slate-800 text-lg font-semibold">
            {isEditMode ? "Editar plato" : "Crear plato"}
          </DialogTitle>
        </DialogHeader>
        {alertMessage && (
          <Alert className="mb-4 bg-red-100 border border-red-400 text-red-700 p-4 rounded-xl flex items-start gap-3">
            <X className="w-5 h-5 mt-1" />
            <div>
              <AlertTitle className="font-semibold">Error:</AlertTitle>
              <AlertDescription className="whitespace-pre-line mt-1">
                {alertMessage}
              </AlertDescription>
            </div>
          </Alert>
        )}
        <div className="space-y-4 mt-3">
          <Input
            placeholder="Título del plato"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="text-black"
          />
          <Input
            placeholder="Descripción"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="text-black"
          />
          <Input
            placeholder="Precio (ej: 1200.00)"
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="text-black"
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
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="w-full h-full object-cover"
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
            <Button variant="outline" className="text-black">
              Cancelar
            </Button>
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
