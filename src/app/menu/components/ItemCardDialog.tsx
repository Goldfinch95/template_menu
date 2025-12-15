"use client";

import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/common/components/ui/dialog";
import Image from "next/image";
import { Items } from "@/interfaces/menu";
import { Inter } from "next/font/google";
import { useMemo } from "react";

// Inter
const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

interface Props {
  item: Items | null;
  primaryColor?: string;
  onClose: () => void;
}

/* -----------------------------
   Luminancia
----------------------------- */
function getLuminance(color: string): number {
  let r, g, b;

  if (color.startsWith("#")) {
    const hex = color.replace("#", "");
    const bigint = parseInt(
      hex.length === 3
        ? hex
            .split("")
            .map((x) => x + x)
            .join("")
        : hex,
      16
    );
    r = (bigint >> 16) & 255;
    g = (bigint >> 8) & 255;
    b = bigint & 255;
  } else {
    return 255;
  }

  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export default function ItemCardDialog({ item, primaryColor, onClose }: Props) {

  const isDark = useMemo(() => {
    if (!primaryColor) return false;
    return getLuminance(primaryColor) < 140;
  }, [primaryColor]);
  
  if (!item) return null;

  const firstImage = item.images?.find((img) => img.active);
  const isAvailable = item.active !== false;

  

  /* -----------------------------
     Clases dinámicas
  ----------------------------- */
  const dialogBg = isDark
    ? "bg-neutral-900 border-neutral-700"
    : "bg-white border-neutral-200";

  const titleColor = isDark ? "text-white" : "text-black";
  const textColor = isDark ? "text-white/80" : "text-black/70";
  const priceColor = isDark ? "text-white" : "text-black";

  

  return (
    <Dialog open={!!item} onOpenChange={onClose}>
      <DialogContent
        className={`
           w-[95vw] pt-4 max-w-lg sm:max-w-xl
    p-0 overflow-hidden
    rounded-3xl
    border shadow-2xl
          ${dialogBg}
          [&>button]:hidden
        `}
      >
        {/* Imagen */}
        {firstImage && (
  <div className="relative w-full h-72 sm:h-80"> {/* Se añade mt-8 para moverlo hacia abajo */}
    <div
      className={`w-full h-full flex items-center justify-center`}
    >
      <Image
        src={firstImage.url}
        alt={firstImage.alt || item.title}
        width={800}
        height={600}
        className="object-contain w-full h-full"
      />
    </div>

    <DialogClose
      className={`
        absolute top-4 right-4
        flex items-center justify-center
        ${isDark ? "text-white" : "text-black"}
        text-3xl
      `}
    >
      &times;
    </DialogClose>
  </div>
)}
        {/* Info */}
        <div className={`flex flex-col gap-4 p-6 sm:p-8 ${inter.className}`}>
          <DialogTitle
            className={`text-2xl sm:text-3xl font-semibold tracking-tight ${titleColor}`}
          >
            {item.title}
          </DialogTitle>

          <DialogDescription
            className={`text-base sm:text-lg leading-relaxed ${textColor}`}
          >
            {item.description}
          </DialogDescription>

          {isAvailable ? (
            <p
              className={`text-2xl font-semibold tracking-tight ${priceColor}`}
            >
              ${item.price}
            </p>
          ) : (
            <span
              className={`
          inline-block text-sm px-3 py-1 rounded-md font-medium
          ${
            isDark
              ? "bg-red-400/20 text-red-200 border border-red-400/30"
              : "bg-red-500/10 text-red-700 border border-red-500/20"
          }
        `}
            >
              No disponible
            </span>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
