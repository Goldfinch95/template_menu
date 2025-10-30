"use client";

import { useEffect, useState } from "react";
import { Button } from "@/common/components/ui/button";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { ArrowLeft, Eye } from "lucide-react";

const NavbarEditor = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [title, setTitle] = useState("");
  const [showMenu, setShowMenu] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Detectar si estamos creando nuevo menu o editando menu.

    if (pathname === "/menuEditor") {
      const id = searchParams.get("id");
      if (id) {
        setTitle("Editando Menu");
        setShowMenu(true);
      } else {
        setTitle("Creando Menu");
      }
    }
  }, [pathname]);

  // ir al menu seleccionado
  const goToMenu = () => {
    router.push("/menu");
  };

  return (
    <nav className="sticky top-0 z-20 bg-white/70 backdrop-blur-xl border-b border-white/30 shadow-sm px-5 pt-4 pb-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between">
          {/* Botón volver */}
          <Button
            variant="ghost"
            size="icon"
            className="p-2 hover:bg-slate-100 rounded-xl transition-all duration-200"
            onClick={() => (window.location.href = "/")}
          >
            <ArrowLeft className="w-5 h-5 text-slate-700" />
          </Button>

          {/* Título centrado */}
          <div className="flex-1 text-center mx-4">
            <h1 className="text-lg font-semibold text-slate-900 tracking-tight">
              {title}
            </h1>
          </div>

          {/* Botón ver menú */}
          {showMenu ? (
            <Button
              onClick={goToMenu}
              className="p-2 bg-gradient-to-br from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 text-white rounded-xl shadow-md transition-all duration-200 active:scale-[0.97]"
            >
              <Eye className="w-5 h-5" />
            </Button>
          ) : (
            // Espacio reservado si no hay botón, para mantener simetría
            <div className="w-10 h-10" />
          )}
        </div>
      </div>
    </nav>
  );
};

export default NavbarEditor;
