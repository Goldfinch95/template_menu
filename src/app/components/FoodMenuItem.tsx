import React from "react";
import Image from "next/image";
import { MenuItem } from "@/interfaces/menu";

const FoodMenuItem: React.FC<MenuItem> = ({
  title,
  description,
  price,
  images,
}) => {
  // Obtener la primera imagen activa, ordenada por sortOrder
  const firstImage = images
    ?.filter((img) => img.active)
    ?.sort((a, b) => a.sortOrder - b.sortOrder)[0];

  const imageSrc = firstImage?.url || "/food_template.webp";
  const imageAlt = firstImage?.alt || title;

  // Convertir price de string a number para mostrar
  const priceNumber = parseFloat(price);

  //funcion para detectar color claro o oscuro para el borde
  
  return (
    <div className="border border-black rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-center gap-4">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-800 mb-1">{title}</h3>
          <p className="text-sm text-gray-600 mb-2 line-clamp-3">{description}</p>
          <p className="text-lg font-bold text-black">
            ${priceNumber.toFixed(2)}
          </p>
        </div>
        <div className="w-20 h-20 flex-shrink-0">
          <Image
            src={imageSrc}
            alt={imageAlt}
            width={80}
            height={80}
            className="w-full h-full object-cover rounded-full"
          />
        </div>
      </div>
    </div>
  );
};

export default FoodMenuItem;
