"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogClose,
  DialogHeader,
  DialogDescription,
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

import { X } from "lucide-react";
import { Button } from "@/common/components/ui/button";
import { newCategory } from "@/interfaces/menu";
import { createCategory } from "@/common/utils/api";

interface CatDialogProps {
  trigger?: React.ReactNode;
  menuId?: number;
  onCategoryCreated?: () => void;
}

const CatDialog = ({ trigger, menuId, onCategoryCreated }: CatDialogProps) => {
  // Estado para almacenar el título de la categoría
  const [title, setTitle] = useState("");
  //estado de alerta
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  // Estado para controlar la apertura/cierre del Dialog
  const [isOpen, setIsOpen] = useState(false);

  

  // VALIDACIÓN DE DATOS (acumulativa)
  const validateFields = () => {
    const errors: string[] = [];

    if (title.trim().length < 3) {
      errors.push("El título debe tener más de 3 caracteres.");
    }
    // Si hay errores → mostrarlos
    if (errors.length > 0) {
      setAlertMessage(errors.join("\n")); // <-- convierte array a texto con saltos de línea
      return false;
    }

    // Si pasa todas las validaciones → limpiar alerta
    setAlertMessage(null);
    return true;
  };

  //funcion de guardado a la BD
  const handleSave = async () => {
    const isValid = validateFields();
    //console.log("el titulo es",title)
    if (!isValid) return;
    try {
      // Aquí debes reemplazar el URL de la API y el menúId por el adecuado

      const payload: newCategory = {
        title: title.trim(),
        menuId: Number(menuId),
      };
      //console.log("el payload es", payload)
      const response = await createCategory(payload);
      //console.log("categoria creada,reiniciando input")
      if (response) {
        setTitle("");
        if (onCategoryCreated) {
          onCategoryCreated();
        }
        setIsOpen(false); // Limpiar el campo
      }
    } catch (error) {
      console.error("❌ Error al crear la categoría:", error); // 👈 ¡Usamos la variable 'error'!
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto [&>button]:hidden">
        <DialogHeader>
          <div className="relative flex items-center justify-center">
            <DialogTitle className="text-xl font-semibold text-black text-center">
              Crear Categoria
            </DialogTitle>
            <DialogClose className="absolute right-0">
              <X className="h-5 w-5 text-orange-400" />
            </DialogClose>
          </div>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <div className="space-y-5 py-4">
          {alertMessage && (
            <Alert className="mb-4 bg-red-100 border border-red-400 p-4 rounded-xl flex items-start gap-3">
              <div>
                <AlertDescription className="whitespace-pre-line mt-1 text-gray-600 text-sm font-semibold">
                  {alertMessage}
                </AlertDescription>
              </div>
            </Alert>
          )}
          <div className="flex flex-col space-y-2">
            <Label className="text-slate-700 text-sm font-semibold" htmlFor="categoryTitle">
              Título de la Categoría
            </Label>
            <Input
              type="text"
              id="categoryTitle"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ingresa el título de la categoría"
              
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            onClick={handleSave}
            className="bg-orange-500 hover:bg-orange-600"
          >
            Guardar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CatDialog;
