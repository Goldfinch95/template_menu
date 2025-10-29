"use client";

import React from "react";
import { Card } from "@/common/components/ui/card";

interface ColorSettingsCardProps {
  formData: {
    color: {
      primary: string;
      secondary: string;
    };
  };
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const ColorEditor: React.FC<ColorSettingsCardProps> = ({
  formData,
  handleInputChange,
}) => {
   return (
    <Card className="bg-white/70 backdrop-blur-xl border border-white/40 rounded-2xl p-6 shadow-lg">
  <div className="space-y-6">
    <h3 className="font-semibold text-slate-800 text-lg">
      Personalización de Colores
    </h3>

    <div className="grid md:grid-cols-2 gap-5">
      {/* Color principal */}
      <div>
        <label
          htmlFor="colorPrimary"
          className="block text-sm font-medium text-slate-700 mb-3"
        >
          Color Principal
        </label>
        <div className="flex gap-3 items-center">
          <div className="relative h-10 w-14 rounded-lg overflow-hidden border border-slate-300 shadow-sm">
            <input
              id="colorPrimary"
              name="colorPrimary"
              type="color"
              value={formData.color.primary}
              onChange={handleInputChange}
              className="absolute inset-0 w-full h-full cursor-pointer
      appearance-none border-none p-0 m-0 bg-transparent
      [&::-webkit-color-swatch-wrapper]:p-0
      [&::-webkit-color-swatch]:border-none
      [&::-webkit-color-swatch]:rounded-none"
            />
          </div>
          <input
            type="text"
            name="colorPrimary"
            value={formData.color.primary}
            onChange={handleInputChange}
            placeholder={formData.color.primary || "#ffffff"}
            className="flex-1 px-4 py-2 border border-slate-300 rounded-lg placeholder:text-slate-400 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all font-mono text-sm"
          />
        </div>
      </div>

      {/* Color secundario */}
      <div>
        <label
          htmlFor="colorSecondary"
          className="block text-sm font-medium text-slate-700 mb-3"
        >
          Color Secundario
        </label>
        <div className="flex gap-3 items-center">
          <div className="relative h-10 w-14 rounded-lg overflow-hidden border border-slate-300 shadow-sm">
            <input
              id="colorSecondary"
              name="colorSecondary"
              type="color"
              value={formData.color.secondary}
              onChange={handleInputChange}
              className="absolute inset-0 w-full h-full cursor-pointer
      appearance-none border-none p-0 m-0 bg-transparent
      [&::-webkit-color-swatch-wrapper]:p-0
      [&::-webkit-color-swatch]:border-none
      [&::-webkit-color-swatch]:rounded-none"
            />
          </div>
          <input
            type="text"
            name="colorSecondary"
            value={formData.color.secondary}
            onChange={handleInputChange}
            placeholder={formData.color.secondary || "#ffffff"}
            className="flex-1 px-4 py-2 border border-slate-300 rounded-lg placeholder:text-slate-400 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all font-mono text-sm"
          />
        </div>
      </div>
    </div>
  </div>
</Card>
  );
};

export default ColorEditor;