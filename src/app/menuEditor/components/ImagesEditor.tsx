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
     <Card className="bg-white/70 backdrop-blur-xl border border-white/40 rounded-2xl p-5 shadow-lg">
  {/* Header con Tooltip */}
  <div className="flex items-center justify-between mb-5">
    <div className="flex items-center gap-2">
      <h3 className="font-bold text-slate-900 text-lg">URLs de Imágenes</h3>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <AlertCircle className="w-5 h-5 text-slate-500 cursor-help hover:text-slate-400 transition-colors" />
          </TooltipTrigger>
          <TooltipContent className="max-w-xs bg-slate-900/95 text-white border border-slate-800 shadow-lg backdrop-blur-md rounded-md">
            <p className="font-semibold mb-2">Ingresa URLs de imágenes:</p>
            <ul className="space-y-1 text-sm text-slate-300">
              <li>📷 <strong>Logo:</strong> Imagen cuadrada (256x256 recomendado)</li>
              <li>🖼️ <strong>Fondo:</strong> Imagen horizontal (1200x600 recomendado)</li>
            </ul>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  </div>

  {/* Inputs */}
  <div className="space-y-5">
    <div>
      <label htmlFor="logo" className="block text-sm font-medium text-slate-700 mb-2">
        URL del Logo
      </label>
      <input
        id="logo"
        name="logo"
        type="url"
        value={logo}
        onChange={handleInputChange}
        placeholder="https://ejemplo.com/logo.png"
        className="w-full px-4 py-2 border border-slate-300 rounded-lg placeholder:text-slate-400 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
      />
    </div>

    <div>
      <label htmlFor="backgroundImage" className="block text-sm font-medium text-slate-700 mb-2">
        URL de Imagen de Fondo
      </label>
      <input
        id="backgroundImage"
        name="backgroundImage"
        type="url"
        value={backgroundImage}
        onChange={handleInputChange}
        placeholder="https://ejemplo.com/fondo.png"
        className="w-full px-4 py-2 border border-slate-300 rounded-lg placeholder:text-slate-400 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
      />
    </div>
  </div>
</Card>
  );
};

export default ImagesEditor;