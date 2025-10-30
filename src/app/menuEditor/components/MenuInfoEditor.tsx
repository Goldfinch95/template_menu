"use client"

import React from "react";
import { Card } from "@/common/components/ui/card";
import { Menues } from "@/interfaces/menu";

interface MenuInfoEditorProps {
  menuData: Partial<Menues>;
  onMenuDataChange: (data: Partial<Menues>) => void;
}

const MenuInfoEditor = ({ menuData, onMenuDataChange }: MenuInfoEditorProps) => {
  const handleChange = (field: string, value: string) => {
    if (field.startsWith("color.")) {
      const colorField = field.split(".")[1];
      onMenuDataChange({
        ...menuData,
        color: {
          ...menuData.color,
          [colorField]: value
        }
      });
    } else {
      onMenuDataChange({
        ...menuData,
        [field]: value
      });
    }
  };

  return (
    <Card className="bg-white/70 backdrop-blur-xl border border-white/40 rounded-2xl p-6 shadow-lg">
      <div className="space-y-6">
        {/* Título */}
        <h3 className="font-semibold text-slate-800 text-lg">
          Información del Menú
        </h3>

        {/* Inputs */}
        <div className="space-y-5">
          {/* Nombre del Menú */}
          <div>
            <label
              htmlFor="menu-title"
              className="block text-sm font-medium text-slate-700 mb-2"
            >
              Nombre del Menú *
            </label>
            <input
              id="menu-title"
              name="title"
              type="text"
              value={menuData.title || ""}
              onChange={(e) => handleChange("title", e.target.value)}
              placeholder="Ej: Restaurante El Buen Sabor"
              className="w-full px-4 py-2 border border-slate-300 rounded-lg placeholder:text-slate-400 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>

          {/* Ubicación / Puntos de Venta */}
          <div>
            <label
              htmlFor="menu-pos"
              className="block text-sm font-medium text-slate-700 mb-2"
            >
              Ubicación / Puntos de Venta
            </label>
            <input
              id="menu-pos"
              name="pos"
              type="text"
              value={menuData.pos || ""}
              onChange={(e) => handleChange("pos", e.target.value)}
              placeholder="Ej: Av. Principal 123, Centro"
              className="w-full px-4 py-2 border border-slate-300 rounded-lg placeholder:text-slate-400 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>

          {/* Logo */}
          <div>
            <label
              htmlFor="menu-logo"
              className="block text-sm font-medium text-slate-700 mb-2"
            >
              Logo (URL)
            </label>
            <input
              id="menu-logo"
              name="logo"
              type="url"
              value={menuData.logo || ""}
              onChange={(e) => handleChange("logo", e.target.value)}
              placeholder="https://ejemplo.com/logo.png"
              className="w-full px-4 py-2 border border-slate-300 rounded-lg placeholder:text-slate-400 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
            {menuData.logo && (
              <div className="mt-2">
                <img
                  src={menuData.logo}
                  alt="Logo preview"
                  className="h-16 w-16 object-cover rounded-lg border border-slate-200"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
              </div>
            )}
          </div>

          {/* Imagen de Fondo */}
          <div>
            <label
              htmlFor="menu-background"
              className="block text-sm font-medium text-slate-700 mb-2"
            >
              Imagen de Fondo (URL)
            </label>
            <input
              id="menu-background"
              name="backgroundImage"
              type="url"
              value={menuData.backgroundImage || ""}
              onChange={(e) => handleChange("backgroundImage", e.target.value)}
              placeholder="https://ejemplo.com/fondo.jpg"
              className="w-full px-4 py-2 border border-slate-300 rounded-lg placeholder:text-slate-400 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
            {menuData.backgroundImage && (
              <div className="mt-2">
                <img
                  src={menuData.backgroundImage}
                  alt="Background preview"
                  className="h-24 w-full object-cover rounded-lg border border-slate-200"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
              </div>
            )}
          </div>

          {/* Colores */}
          <div className="grid grid-cols-2 gap-4">
            {/* Color Primario */}
            <div>
              <label
                htmlFor="menu-color-primary"
                className="block text-sm font-medium text-slate-700 mb-2"
              >
                Color Primario
              </label>
              <div className="flex gap-2">
                <input
                  id="menu-color-primary"
                  name="color-primary"
                  type="color"
                  value={menuData.color?.primary || "#FF6B35"}
                  onChange={(e) => handleChange("color.primary", e.target.value)}
                  className="h-10 w-16 rounded cursor-pointer border border-slate-300"
                />
                <input
                  type="text"
                  value={menuData.color?.primary || "#FF6B35"}
                  onChange={(e) => handleChange("color.primary", e.target.value)}
                  placeholder="#FF6B35"
                  className="flex-1 px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Color Secundario */}
            <div>
              <label
                htmlFor="menu-color-secondary"
                className="block text-sm font-medium text-slate-700 mb-2"
              >
                Color Secundario
              </label>
              <div className="flex gap-2">
                <input
                  id="menu-color-secondary"
                  name="color-secondary"
                  type="color"
                  value={menuData.color?.secondary || "#FFB830"}
                  onChange={(e) => handleChange("color.secondary", e.target.value)}
                  className="h-10 w-16 rounded cursor-pointer border border-slate-300"
                />
                <input
                  type="text"
                  value={menuData.color?.secondary || "#FFB830"}
                  onChange={(e) => handleChange("color.secondary", e.target.value)}
                  placeholder="#FFB830"
                  className="flex-1 px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default MenuInfoEditor;
