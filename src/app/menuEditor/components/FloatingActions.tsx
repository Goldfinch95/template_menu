"use client";

import { useEffect, useState } from "react";
import { Button } from "@/common/components/ui/button";
import {
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
  TooltipContent,
} from "@/common/components/ui/tooltip";
import { usePathname, useSearchParams } from "next/navigation";



const FloatingActions = () => {

  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [title, setTitle] = useState("");

  useEffect(() => {
      // Detectar si estamos creando nuevo menu o editando menu.
  
      if (pathname === "/menuEditor") {
        const id = searchParams.get("id");
        if (id) {
          setTitle("Guardar Cambios");
        } else {
          setTitle("Crear Menu");
        }
      }
    }, [pathname]);
  
  return (
    <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-b from-white via-[#FFF3EC] to-[#FFE6D3] backdrop-blur-md shadow-[0_-4px_24px_rgba(0,0,0,0.4)]">
  <div className="max-w-4xl mx-auto flex gap-4">
    {/* Botón Vista Previa */}
    <Button
      
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
            <Button className="h-14 
        bg-gradient-to-br from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600
        text-white font-semibold text-base 
        rounded-2xl transition-all duration-300 
        
        hover:scale-[1.02] active:scale-[0.98]"
            >
              {title}
            </Button>
          </div>
        </TooltipTrigger>

        {/* Tooltip */}
       
          <TooltipContent className="bg-slate-800 border border-slate-700 text-slate-300 text-xs">
            Completa el nombre y URLs válidas
          </TooltipContent>
        
      </Tooltip>
    </TooltipProvider>
  </div>
</div>
  );
};

export default FloatingActions;