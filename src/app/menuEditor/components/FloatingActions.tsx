"use client";

import React from "react";
import { Button } from "@/common/components/ui/button";
import {
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
  TooltipContent,
} from "@/common/components/ui/tooltip";

interface FloatingActionsProps {
  onPreview: () => void;
  onSave: () => void;
  canSave: () => boolean;
  isSaving: boolean;
  isCreating: boolean;
}

const FloatingActions: React.FC<FloatingActionsProps> = ({
  onPreview,
  onSave,
  canSave,
  isSaving,
  isCreating,
}) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-b from-white via-[#FFF3EC] to-[#FFE6D3] backdrop-blur-md shadow-[0_-4px_24px_rgba(0,0,0,0.4)]">
  <div className="max-w-4xl mx-auto flex gap-4">
    {/* Botón Vista Previa */}
    <Button
      onClick={onPreview}
      className="
        flex-1 h-14 
        bg-gradient-to-br from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600
        text-white font-semibold text-base 
        rounded-2xl transition-all duration-300 
        
        hover:scale-[1.02] active:scale-[0.98]
      "
    >
      Vista Previa
    </Button>

    {/* Botón Guardar */}
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex-1">
            <Button
              onClick={onSave}
              disabled={!canSave() || isSaving}
              className={`w-full h-14 rounded-2xl font-semibold text-base transition-all duration-300 border ${
                canSave() && !isSaving
                  ? "bg-gradient-to-br from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 text-white border-transparent shadow-lg shadow-blue-500/20 hover:scale-[1.02] active:scale-[0.98]"
                  : "bg-slate-800 text-slate-600 border-slate-700 cursor-not-allowed"
              }`}
            >
              {isSaving
                ? "Guardando..."
                : isCreating
                ? "Crear Menú"
                : "Guardar Cambios"}
            </Button>
          </div>
        </TooltipTrigger>

        {/* Tooltip */}
        {!canSave() && !isSaving && (
          <TooltipContent className="bg-slate-800 border border-slate-700 text-slate-300 text-xs">
            Completa el nombre y URLs válidas
          </TooltipContent>
        )}
      </Tooltip>
    </TooltipProvider>
  </div>
</div>
  );
};

export default FloatingActions;