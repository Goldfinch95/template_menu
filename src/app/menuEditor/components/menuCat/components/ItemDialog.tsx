"use client";

import React, { useState, useEffect } from "react";
import { Utensils, Pencil, Trash2, Plus, X, Upload } from "lucide-react";
import { Items } from "@/interfaces/menu";
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

interface ItemDialogProps {
  trigger: React.ReactNode;
  categoryId: number;
  item?: any; // Tu interfaz Items si la tenés
  onItemSaved?: () => void;
}

const ItemDialog = ({
  trigger,
  item,
  categoryId,
  onItemSaved,
}: ItemDialogProps) => {
  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="rounded-2xl max-w-md bg-white/90 backdrop-blur-xl border border-white/30">
        <DialogClose className="absolute right-4 top-4 rounded-full p-2 hover:bg-white/70 transition-colors z-50">
          <X className="h-5 w-5 text-orange-400" />
        </DialogClose>
        <DialogHeader>
          <DialogTitle className="text-slate-800 text-lg font-semibold">
            Editar plato
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 mt-3">
          <Input placeholder="Título del plato *" className="text-black" />
          <Input placeholder="Descripción" className="text-black" />
          <Input placeholder="Precio (ej: 1200.00)" className="text-black" />
        </div>
        <div className="relative w-full h-full group">
          <Input
            type="file"
            accept="image/*"
            className="mt-4 hidden"
            id="image-upload-input"
          />
          <Label
            htmlFor="image-upload-input"
            className={`w-full h-64 rounded-2xl overflow-hidden 
                                
                                bg-slate-50 flex items-center justify-center cursor-pointer hover:border-orange-500 transition-all`}
          ></Label>
          <p className="text-base text-slate-400 mt-2">PNG, JPG hasta 10MB</p>
          <DialogFooter className="mt-5">
            <Button variant="outline" className="text-black">
              Cancelar
            </Button>
            <Button className="bg-gradient-to-br from-orange-400 to-orange-500 text-white">
              Guardar cambios
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ItemDialog;
