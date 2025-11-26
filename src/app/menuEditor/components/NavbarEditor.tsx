"use client";

import { useEffect, useState } from "react";
import { Button } from "@/common/components/ui/button";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { ArrowLeft, Eye } from "lucide-react";
import { motion } from "framer-motion";

const NavbarEditor = () => {
  //estados del titulo
  const [title, setTitle] = useState("");
  const [showMenu, setShowMenu] = useState(false);

  //estado del menú seleccionado
  const [menuId, setMenuId] = useState<number | null>(null);

  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  // Detectar si estamos creando nuevo menu o editando menu.
  useEffect(() => {
    if (pathname === "/menuEditor") {
      const id = searchParams.get("id");
      if (id) {
        setTitle("Editando Menu");
        setShowMenu(true);
        setMenuId(Number(id));
      } else {
        setTitle("Creando Menu");
        setShowMenu(false);
        setMenuId(null);
      }
    }
  }, [pathname, searchParams]);

  // ir al menu seleccionado
  const goToMenu = (id: number | null) => {
    if (id) {
      router.push(`/menu?id=${id}`);
    }
  };

  return (
    // navegador animado
    <motion.nav
      initial={{ y: -15, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="
        sticky top-0 z-30
        w-full
        backdrop-blur-lg bg-white/70
        border-b border-white/30
        shadow-[0_1px_6px_rgba(0,0,0,0.05)]
        px-3 py-2 sm:px-5 sm:py-3
      "
    >
      <div className="max-w-2xl mx-auto flex items-center justify-between gap-2 sm:gap-4">
        {/* Botón volver */}
        <Button
          variant="ghost"
          size="icon"
          className="rounded-xl p-2 sm:p-3 
            hover:bg-slate-100/70 active:scale-[0.95]
            transition-all duration-200"
          aria-label="Volver al inicio"
          onClick={() => router.push("/menuShowcase")}
        >
          <ArrowLeft className="w-5 h-5 sm:w-5 sm:h-5 text-slate-700" />
        </Button>

        {/* Título */}
        <h1 className="text-xl font-semibold text-slate-900 tracking-tight text-center flex-1">
          {title}
        </h1>

        {/* Botón ver menú */}
        {showMenu ? (
           <Button
            size="icon"
            aria-label="Ver menú"
            onClick={() => goToMenu(menuId)}
            className="
              rounded-xl p-2 sm:p-3
              bg-gradient-to-br from-orange-400 to-orange-500
              hover:from-orange-500 hover:to-orange-600
              text-white shadow-md
              transition-all duration-200 active:scale-[0.95]
            "
          >
            <Eye className="w-5 h-5 sm:w-5 sm:h-5" />
          </Button>
        ) : (
          // si NO, hacer un espacio vacio.
          <div className="w-9 h-9 sm:w-10 sm:h-10" />
        )}
      </div>
    </motion.nav>
  );
};

export default NavbarEditor;
