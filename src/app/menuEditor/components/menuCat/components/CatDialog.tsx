"use client";

import React, { useState, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogClose,
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

import { X } from "lucide-react";
import { Button } from "@/common/components/ui/button";
import { newCategory, Categories } from "@/interfaces/menu";
import { number } from "framer-motion";
import { createCategory } from "@/common/utils/api";

interface CatDialogProps {
  trigger?: React.ReactNode;
  menuId?: number;
}

const CatDialog = ({ trigger, menuId }: CatDialogProps) => {
  // Estado para almacenar el título de la categoría
  const [title, setTitle] = useState("");
  //estado de alerta
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  // Estado para controlar la apertura/cierre del Dialog
  const [isOpen, setIsOpen] = useState(false);

   //Agrega ref para el alerta
    const alertRef = useRef<HTMLDivElement>(null);

  // VALIDACIÓN DE DATOS (acumulativa)
  const validateFields = () => {
    const errors: string[] = [];

    if (title.trim().length < 3) {
      errors.push("• El título debe tener más de 3 caracteres.");
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
        title: title,
        menuId: menuId,
      };
      //console.log("el payload es", payload)
      const response = await createCategory(payload);
      //console.log("categoria creada,reiniciando input")
      if (response) {
        setTitle("");
        setIsOpen(false); // Limpiar el campo
      }
    } catch (error) {
      console.log("No se pudo crear la categoría");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
        <DialogClose className="absolute right-4 top-4 rounded-full p-2 hover:bg-white/70 transition-colors z-50">
          <X className="h-5 w-5 text-orange-400" />
        </DialogClose>
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-black">
            Crear Categoria
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-5 py-4">
          {alertMessage && (
            <Alert
              ref={alertRef}
              className="mb-4 bg-red-100 border border-red-400 text-red-700 p-4 rounded-md flex items-start gap-3"
            >
              <X className="w-6 h-6" />
              <div className="font-semibold">
                <AlertTitle>Error:</AlertTitle>
                <AlertDescription className="whitespace-pre-line mt-1">
                  {alertMessage}
                </AlertDescription>
              </div>
            </Alert>
          )}
          <div className="flex flex-col">
            <label
              className="text-sm font-medium text-gray-700"
              htmlFor="categoryTitle"
            >
              Título de la Categoría
            </label>
            <input
              type="text"
              id="categoryTitle"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ingresa el título de la categoría"
              className="text-black mt-2 p-3 border border-slate-300 rounded-xl w-full text-sm"
            />
          </div>
        </div>
        <DialogFooter>
            <DialogClose>
                <Button
            onClick={handleSave}
            className="bg-orange-500 hover:bg-orange-600"
          >
            Guardar
          </Button>
            </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CatDialog;
