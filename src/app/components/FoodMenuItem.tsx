"use client";

import React, { useMemo } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Items } from "@/interfaces/menu";
import { Inter } from "next/font/google";

// Importar Inter
const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"], // normal, medium, semibold, bold
});

type Props = Items & {
  primaryColor?: string;
};

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
  } else if (color.startsWith("rgb")) {
    const values = color.match(/\d+/g);
    if (!values) return 255;
    [r, g, b] = values.map(Number);
  } else {
    return 255;
  }

  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

const FoodMenuItem: React.FC<Props> = ({
  title,
  description,
  price,
  images,
  primaryColor,
  active,
}) => {
  const firstImage = images?.[0]; // Accedemos directamente a la primera imagen en el array
  const imageSrc = firstImage?.url; // Usamos la URL de la primera imagen o una imagen por defecto
  const imageAlt = firstImage?.alt || title; // Usamos el alt de la imagen o el título como fallback

  const isAvailable = active !== false;

  const priceNumber = typeof price === "string" ? parseFloat(price) : price;

  // Detecta si el color primario es claro u oscuro
  const isDark = useMemo(() => {
    if (!primaryColor) return false;
    return getLuminance(primaryColor) < 140;
  }, [primaryColor]);

  // Clases adaptativas de borde
  const ringClass = isDark
    ? "ring-1 ring-white/10 shadow-lg"
    : "ring-1 ring-black/10 shadow-sm";

  const textColorClass = isDark ? "text-white/90" : "text-black/80";
  const titleColorClass = isDark ? "text-white" : "text-black";
  const priceColorClass = isDark ? "text-white" : "text-black";

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.25 }}
      className={`flex items-center gap-4 ${inter.className}`}
    >
      {/* Left text */}
      <div className="flex-1 min-w-0">
        <h3
          className={`font-semibold text-2xl leading-tight tracking-tight ${titleColorClass}`}
        >
          {title}
        </h3>

        <p className={`text-base line-clamp-2 mt-1 ${textColorClass}`}>
          {description}
        </p>

        {/* Si está disponible, mostrar precio normal */}
        {isAvailable ? (
          <p
            className={`text-xl font-bold mt-2 tracking-tight ${priceColorClass}`}
          >
            ${priceNumber.toFixed(2)}
          </p>
        ) : (
          /* Si NO está disponible, mostrar badge suave */
          <div className="mt-3">
            <span
              className={`
      text-base px-2 py-1 rounded-md font-medium
      ${
        isDark
          ? "bg-red-400/20 text-red-200 border border-red-400/30"
          : "bg-red-500/10 text-red-700 border border-red-500/20"
      }
    `}
            >
              No disponible
            </span>
          </div>
        )}
      </div>

      {/* Renderizar imagen SOLO si existe una imagen activa */}

      <div
        className={`
      w-24 h-24 flex-shrink-0 
      rounded-2xl overflow-hidden 
      flex items-center justify-center
      bg-transparent ring-1
      ${ringClass}
    `}
      >
        <Image
          src={imageSrc}
          alt={imageAlt}
          width={96}
          height={96}
          className="object-contain w-full h-full"
        />
      </div>
    </motion.div>
  );
};

export default FoodMenuItem;
