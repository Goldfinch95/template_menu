"use client";

import React, { useMemo } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Items } from "@/interfaces/menu";

type Props = Items & {
  primaryColor?: string;
};

// Convert HEX or RGB to luminance
function getLuminance(color: string): number {
  let r, g, b;

  if (color.startsWith("#")) {
    const hex = color.replace("#", "");
    const bigint = parseInt(hex.length === 3
      ? hex.split("").map((x) => x + x).join("")
      : hex, 16);

    r = (bigint >> 16) & 255;
    g = (bigint >> 8) & 255;
    b = bigint & 255;
  } else if (color.startsWith("rgb")) {
    const values = color.match(/\d+/g);
    if (!values) return 255;
    [r, g, b] = values.map(Number);
  } else {
    return 255; // fallback if color invalid
  }

  // luminance formula
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

const FoodMenuItem: React.FC<Props> = ({
  title,
  description,
  price,
  images,
  primaryColor
}) => {

  const firstImage = images
    ?.filter((img) => img.active)
    ?.sort((a, b) => a.sortOrder - b.sortOrder)[0];

  const imageSrc = firstImage?.url || "/food_template.webp";
  const imageAlt = firstImage?.alt || title;

  const priceNumber = typeof price === "string" ? parseFloat(price) : price;

  // 🧠 Detect automatically if dark or light
  const isDark = useMemo(() => {
    if (!primaryColor) return false;
    return getLuminance(primaryColor) < 140;
  }, [primaryColor]);

  const textColorClass = isDark ? "text-white/90" : "text-black/80";
  const titleColorClass = isDark ? "text-white" : "text-black";
  const priceColorClass = isDark ? "text-white" : "text-black";

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.25 }}
      className="flex items-center gap-4"
    >
      {/* Left info */}
      <div className="flex-1 min-w-0">
        <h3 className={`font-semibold text-lg leading-tight drop-shadow-sm ${titleColorClass}`}>
          {title}
        </h3>

        <p className={`text-sm line-clamp-2 mt-1 ${textColorClass}`}>
          {description}
        </p>

        <p className={`text-xl font-bold mt-2 drop-shadow ${priceColorClass}`}>
          ${priceNumber.toFixed(2)}
        </p>
      </div>

      {/* Image */}
      <div className="w-24 h-24 flex-shrink-0 overflow-hidden rounded-xl shadow-sm">
        <Image
          src={imageSrc}
          alt={imageAlt}
          width={96}
          height={96}
          className="object-cover w-full h-full"
        />
      </div>
    </motion.div>
  );
};

export default FoodMenuItem;
