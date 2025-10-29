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
    <Card className="bg-slate-900/50 border-slate-800 backdrop-blur-sm">
      <div className="p-6">
        <h3 className="font-semibold text-white text-lg mb-6">
          Personalización de Colores
        </h3>

        <div className="grid md:grid-cols-2 gap-5">
          {/* Color principal */}
          <div>
            <label
              htmlFor="colorPrimary"
              className="block text-sm font-medium text-slate-300 mb-3"
            >
              Color Principal
            </label>
            <div className="flex gap-3">
              <input
                id="colorPrimary"
                name="colorPrimary"
                type="color"
                value={formData.color.primary}
                onChange={handleInputChange}
                className="h-12 w-14 rounded-xl border-2 border-slate-700 cursor-pointer bg-slate-800"
              />
              <input
                type="text"
                name="colorPrimary"
                value={formData.color.primary}
                onChange={handleInputChange}
                className="flex-1 px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all font-mono text-sm"
              />
            </div>
          </div>

          {/* Color secundario */}
          <div>
            <label
              htmlFor="colorSecondary"
              className="block text-sm font-medium text-slate-300 mb-3"
            >
              Color Secundario
            </label>
            <div className="flex gap-3">
              <input
                id="colorSecondary"
                name="colorSecondary"
                type="color"
                value={formData.color.secondary}
                onChange={handleInputChange}
                className="h-12 w-14 rounded-xl border-2 border-slate-700 cursor-pointer bg-slate-800"
              />
              <input
                type="text"
                name="colorSecondary"
                value={formData.color.secondary}
                onChange={handleInputChange}
                className="flex-1 px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all font-mono text-sm"
              />
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ColorEditor;