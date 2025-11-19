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
import { Input } from "@/common/components/ui/input";
import { Label } from "@/common/components/ui/label";
import { Button } from "@/common/components/ui/button";
import { createItem, updateItem } from "@/common/utils/api";

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

  const [images, setImages] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
      // Las imágenes existentes no se cargan como File[], 
      // pero podrías mostrarlas de otra forma si lo necesitas
    } else {
      // Limpiar el formulario si no hay item (modo crear)
      setTitle("");
      setDescription("");
      setPrice("");
      setImages([]);
    }
  }, [item]);

  const handleSave = async () => {
    setError(null);

    if (!title.trim()) {
      setError("El título es obligatorio");
      return;
    }
    if (!price || isNaN(Number(price))) {
      setError("El precio es obligatorio y debe ser un número");
      return;
    }

    setLoading(true);
    console.log(categoryId)

    try {
      //si estamos editando
      if(isEditMode){
        const payload: Partial<Items> = {
          title: title,
          description: description || undefined,
          price: Number(price),
          //images: images
        };
        console.log("🔄 Actualizando item:", item.id, payload);
        await updateItem(item.id, payload);

      }
      else{
        const payload: newItem = {
        categoryId: Number(categoryId),
        title: title,
        description: description,
        price: Number(price),
        //images: images,
      };
      console.log("✅ payload:", payload);
      await createItem(payload);
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
            onChange={(e) => {
              const fileList = e.target.files;
              if (fileList) setImages(Array.from(fileList));
            }}
          />
          <Label
            htmlFor="image-upload-input"
            className="w-full h-64 rounded-2xl overflow-hidden bg-slate-50 flex items-center justify-center cursor-pointer hover:border-orange-500 transition-all"
          >
            {images.length > 0 ? (
              <span className="text-slate-600">
                {images.length} imagen seleccionada
              </span>
            ) : (
              <span className="text-slate-400">Subir imagen</span>
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
