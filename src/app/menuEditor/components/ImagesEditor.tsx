import React from "react";
import { Card } from "@/common/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/common/components/ui/tooltip";
import { AlertCircle } from "lucide-react";

interface ImageUrlsCardProps {
  logo: string;
  backgroundImage: string;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const ImagesEditor: React.FC<ImageUrlsCardProps> = ({
  logo,
  backgroundImage,
  handleInputChange,
}) => {
  return (
    <Card className="bg-slate-900/50 border-slate-800 backdrop-blur-sm">
      <div className="p-6">
        {/* Header con Tooltip */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-semibold text-white text-lg">URLs de Imágenes</h3>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <AlertCircle className="w-5 h-5 text-slate-500 cursor-help hover:text-slate-400 transition-colors" />
              </TooltipTrigger>
              <TooltipContent className="max-w-xs bg-slate-800 border-slate-700">
                <p className="font-semibold mb-2 text-white">Ingresa URLs de imágenes:</p>
                <p className="text-xs mb-1 text-slate-300">
                  📷 Logo: Imagen cuadrada (256x256 recomendado)
                </p>
                <p className="text-xs text-slate-300">
                  🖼️ Fondo: Imagen horizontal (1200x600 recomendado)
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        {/* Inputs */}
        <div className="space-y-5">
          <div>
            <label htmlFor="logo" className="block text-sm font-medium text-slate-300 mb-2">
              URL del Logo
            </label>
            <input
              id="logo"
              name="logo"
              type="url"
              value={logo}
              onChange={handleInputChange}
              placeholder="https://ejemplo.com/logo.png"
              className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>

          <div>
            <label
              htmlFor="backgroundImage"
              className="block text-sm font-medium text-slate-300 mb-2"
            >
              URL de Imagen de Fondo
            </label>
            <input
              id="backgroundImage"
              name="backgroundImage"
              type="url"
              value={backgroundImage}
              onChange={handleInputChange}
              placeholder="https://ejemplo.com/fondo.png"
              className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ImagesEditor;