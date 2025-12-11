"use client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/common/components/ui/dialog";
import Image from "next/image";
import { Items } from "@/interfaces/menu";
import { Inter } from "next/font/google";

// Cargar Inter con los pesos que necesitas
const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"], // normal, medium, semibold, bold
});

interface Props {
  item: Items | null;
  onClose: () => void;
}

export default function ItemCardDialog({ item, onClose }: Props) {
  if (!item) return null;
  
  const hasImage = item.images?.[0]?.url;
  const isAvailable = item.active; // Se asume que `active` es un booleano

  return (
    <Dialog open={!!item} onOpenChange={onClose}>
      <DialogContent className="max-w-md w-full rounded-xl p-0 overflow-hidden bg-white shadow-xl border border-gray-100">
        {/* Imagen principal */}
        {hasImage ? (
          <div className="w-full h-60 overflow-hidden rounded-xl relative">
            <Image
              src={item.images?.[0]?.url || "/placeholder.png"}
              width={500}
              height={250}
              alt={item.title}
              className="object-contain w-full h-full"
            />
            <DialogClose className="absolute top-4 right-4 text-white text-lg opacity-70 hover:opacity-100 transition-opacity">
              &times;
            </DialogClose>
          </div>
        ) : null}

        {/* Información */}
        <div className={`flex flex-col p-6 gap-2 ${hasImage ? 'mt-4' : 'mt-0'}  ${inter.className}`}>
          <DialogTitle className="font-semibold text-xl text-gray-900 tracking-tight">
            {item.title}
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-600 mt-1 leading-relaxed">
            {item.description}
          </DialogDescription>
          
          {/* Precio o mensaje de no disponible */}
          {isAvailable ? (
            <p className="text-xl font-bold mt-2 tracking-tight text-gray-900">
              ${item.price}
            </p>
          ) : (
            <div className="mt-3">
              <span
                className={`text-base px-2 py-1 rounded-md font-medium
                  ${isAvailable
                    ? "text-gray-900"
                    : "bg-red-500/10 text-red-700 border border-red-500/20"
                  }`}
              >
                No disponible
              </span>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
