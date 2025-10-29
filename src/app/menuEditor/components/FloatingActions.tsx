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
    <div className="fixed bottom-0 left-0 right-0 p-6 bg-slate-950/95 backdrop-blur-lg border-t border-slate-800 shadow-2xl">
      <div className="max-w-4xl mx-auto flex gap-4">
        {/* Botón Vista Previa */}
        <Button
          onClick={onPreview}
          className="flex-1 h-14 bg-slate-800 hover:bg-slate-700 text-white rounded-2xl font-semibold text-base transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] border border-slate-700"
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
                  className={`w-full h-14 rounded-2xl font-semibold text-base transition-all duration-300 ${
                    canSave() && !isSaving
                      ? "bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700 text-white shadow-lg shadow-blue-500/20 hover:scale-[1.02] active:scale-[0.98]"
                      : "bg-slate-800 text-slate-600 cursor-not-allowed border border-slate-700"
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
              <TooltipContent className="bg-slate-800 border-slate-700">
                <p className="text-xs text-slate-300">
                  Completa el nombre y URLs válidas
                </p>
              </TooltipContent>
            )}
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
};

export default FloatingActions;