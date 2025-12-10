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
interface Props {
  item: Items;
  onClose: () => void;
}

export default function ItemCardDialog({ item, onClose }: Props) {
  return (
    <Dialog open={!!item} onOpenChange={onClose}>
      <DialogContent className="max-w-md w-full rounded-2xl p-0 overflow-hidden">
        <DialogHeader className="p-4"></DialogHeader>
        {/* Imagen principal */}
        <div className="w-full h-50 flex-shrink-0 overflow-hidden rounded-2xl shadow-md shadow-black/20 relative">
          <Image
            src={item.images?.[0]?.url || "/placeholder.png"}
            width={500}
            height={250}
            alt={item.title}
            className="object-contain w-full h-full"
          />
          <DialogClose></DialogClose>
        </div>

        {/* Información */}
        <div className="flex justify-between items-start gap-4 p-4">
          <div className="flex-1 min-w-0">
            <DialogTitle className="font-semibold text-lg leading-tight drop-shadow-sm">
              {item.title}
            </DialogTitle>
            <DialogDescription className="text-sm  mt-1">
              {item.description}
            </DialogDescription>
            <p className="text-xl font-bold mt-2 drop-shadow">${item.price}</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
