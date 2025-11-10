"use client";

import React from "react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/common/components/ui/card";
import { Button } from "@/common/components/ui/button";
import { Skeleton } from "@/common/components/ui/skeleton";
import { Plus, UtensilsCrossed, ChevronRight, LogOut } from "lucide-react";
import { Menu } from "@/interfaces/menu";
import Image from "next/image";
import { Manrope } from "next/font/google";
import { getMenus } from "@/common/utils/api";
import { AnimatePresence, motion } from "framer-motion";

// fuente para titulos
const manrope = Manrope({ subsets: ["latin"] });

// Función auxiliar para convertir hex a gradiente de Tailwind
const hexToGradient = (primaryHex: string, secondaryHex: string) => {
  // Esta función retorna un estilo inline en lugar de clases de Tailwind
  return {
    backgroundImage: `linear-gradient(to bottom right, ${primaryHex}, ${secondaryHex})`,
  };
};

export default function Home() {
  // estados del menu y de carga
  const [menus, setMenus] = useState<Menu[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const router = useRouter();

  //dirigirte a crear un nuevo menú
  const handleCreateNewMenu = () => {
    router.push("/menuEditor");
  };

  //cargar menus
  useEffect(() => {
    const fetchMenus = async () => {
      try {
        setIsLoading(true);
        const data = await getMenus();
        // Espera al menos 1s antes de mostrar los datos
        setTimeout(() => {
          setMenus(data);
          setIsLoading(false);
        }, 1000);
      } catch (err) {
        console.log(err);
        setIsLoading(false);
      }
    };

    fetchMenus();
  }, []);

  // dirigirte a un menú especifico al seleccionarlo.
  const handleMenuClick = (menuId: number, menuTitle: string) => {
    router.push(
      `/menuEditor?id=${menuId}&title=${encodeURIComponent(menuTitle)}`
    );
  };

  return (
    /*{ contenedor principal}*/
    <main
      className="
      min-h-screen  
      
      bg-gradient-to-b from-white via-[#FFF3EC] to-[#FFE6D3]
      
      backdrop-blur-xl bg-white/60
      border border-white/30
      shadow-[0_8px_24px_rgba(0,0,0,0.08)]
    "
    >
      <div className="min-h-[calc(100vh-3rem)] flex flex-col">
        {/* Header */}
        <header className="px-5 pt-4 pb-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between">
              {/* perfil para mostrar */}
              <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-orange-500 rounded-xl flex items-center justify-center shadow-md">
                <UtensilsCrossed className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1 text-center mx-4">
                {/* titulo principal */}
                <h1
                  className={`${manrope.className} text-lg font-bold text-slate-900`}
                >
                  Mis Menús
                </h1>
                {/* subtitulo */}
                <p className="text-xs text-slate-500">
                  Gestiona tus menús digitales
                </p>
              </div>
              {/* boton para deslogear */}
              <Button className="p-3 rounded-lg bg-transparent active:scale-95 transition">
                <LogOut className="w-5 h-5 text-slate-700 group-hover:text-red-500 transition-colors" />
              </Button>
            </div>
          </div>
        </header>

        {/* Contenido */}
        <section className="max-w-md mx-auto w-full px-4 py-3">
          {/* boton para crear nuevo menú animado */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            transition={{ duration: 0.3 }}
          >
            <div className="mb-6">
              <div
                onClick={handleCreateNewMenu}
                className="w-full relative bg-gradient-to-r from-orange-400 to-orange-500 rounded-2xl p-6 cursor-pointer transition-all duration-300 hover:shadow-xl active:scale-[0.98] overflow-hidden"
              >
                <div className="absolute right-0 top-0 bottom-0 w-32 opacity-20">
                  <div className="w-24 h-24 bg-white rounded-full absolute -right-8 -top-8" />
                  <div className="w-20 h-20 bg-white rounded-full absolute right-4 bottom-0" />
                </div>
                <div className="relative z-10 flex items-center">
                  <Plus className="w-8 h-8 text-white mr-3" strokeWidth={3} />
                  <p className="text-white text-base font-semibold">
                    Crear nuevo menú
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* contenedor de menús */}
        <div className="mb-6">
          <div className="flex items-center justify-between max-w-4xl mx-auto px-5">
            {/* titulo principal */}
            <h2
              className={`${manrope.className} text-lg font-bold text-slate-900`}
            >
              Tus menús
            </h2>
          </div>
        </div>

        <section className="max-w-md mx-auto w-full px-4 py-3">
          {/* animacion de carga */}
  <AnimatePresence>
    {isLoading ? (
      // --- esqueleto de menús ---
      <div className="grid grid-cols-2 gap-4 sm:gap-6 md:gap-7">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="rounded-3xl overflow-hidden shadow-md bg-white/10 backdrop-blur-sm p-4 sm:p-5"
          >
            <div className="flex flex-col items-center space-y-3">
              <Skeleton className="w-16 h-16 sm:w-20 sm:h-20 rounded-full" />
              <Skeleton className="w-24 h-4 sm:w-28 sm:h-5 rounded-md" />
            </div>
          </div>
        ))}
      </div>
      // si NO hay menús, mostrar estado vacio animado.
    ) : menus.length === 0 ? (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="flex flex-col items-center justify-center text-center py-16 px-6 bg-white/50 backdrop-blur-md rounded-3xl shadow-inner border border-white/30"
      >
        <div className="w-16 h-16 mb-4 rounded-full bg-gradient-to-br from-orange-400 to-orange-500 flex items-center justify-center shadow-md">
          <UtensilsCrossed className="w-8 h-8 text-white" />
        </div>
        <h3
          className={`${manrope.className} text-lg font-bold text-slate-800 mb-2`}
        >
          Aún no tienes menús
        </h3>
        <p className="text-slate-500 text-sm mb-6">
          Crea tu primer menú digital para empezar a personalizarlo y
          compartirlo con tus clientes.
        </p>
        
      </motion.div>
      // SI hay menús, desplegarlos animado
    ) : (
      // --- LISTA DE MENÚS ---
      <div className="grid grid-cols-2 gap-4 sm:gap-6 md:gap-7">
        {menus.map((menu, i) => (
          <motion.div
            key={menu.id}
            initial={{ opacity: 0, y: 15, scale: 0.98 }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
              transition: {
                type: "spring",
                stiffness: 120,
                damping: 14,
                delay: i * 0.12,
                duration: 0.45,
              },
            }}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.96 }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 20,
            }}
            onClick={() => handleMenuClick(menu.id, menu.title)}
            className="group cursor-pointer overflow-hidden rounded-3xl border-0 bg-transparent transition-all duration-300"
          >
            <Card
              key={menu.id}
              className="group cursor-pointer overflow-hidden border-0 bg-transparent p-0 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] hover:shadow-lg hover:brightness-105"
            >
              <div
                className="relative h-36 sm:h-44 rounded-3xl p-4 sm:p-5 flex flex-col justify-center items-center shadow-lg hover:shadow-xl transition"
                style={hexToGradient(
                  menu.color?.primary,
                  menu.color?.secondary
                )}
              >
                <div className="absolute inset-0 bg-black/10 rounded-3xl" />

                <div className="relative z-10 flex flex-col h-full">
                  <div className="flex-1 flex items-center justify-center">
                    {/* logo del menú */}
                    {menu.logo ? (
                      <div className="w-16 h-16 lg:w-20 lg:h-20 rounded-full bg-white/25 backdrop-blur-sm flex items-center justify-center overflow-hidden transition-transform duration-300 group-hover:scale-110 shadow-lg">
                        <Image
                          src={menu.logo}
                          alt={menu.title}
                          width={80}
                          height={80}
                          className="w-full h-full object-cover"
                          sizes="(max-width: 640px) 64px, 80px"
                          priority
                        />
                      </div>
                    ) : (
                      <div className="w-14 h-14 lg:w-16 lg:h-16 rounded-full bg-white/25 backdrop-blur-sm flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
                        <UtensilsCrossed
                          className="w-7 h-7 lg:w-8 lg:h-8 text-white absolute transition-all duration-300 group-hover:opacity-0 group-hover:scale-75"
                          strokeWidth={2.5}
                        />
                        <ChevronRight
                          className="w-7 h-7 lg:w-8 lg:h-8 text-white absolute transition-all duration-300 opacity-0 scale-75 group-hover:opacity-100 group-hover:scale-100"
                          strokeWidth={2.5}
                        />
                      </div>
                    )}
                  </div>

                  <div className="text-center">
                    {/* titulo del menú */}
                    <h3 className="font-bold text-white text-sm lg:text-base leading-tight mb-1">
                      {menu.title}
                    </h3>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    )}
  </AnimatePresence>
</section>

        {/* Espaciador flexible para empujar el footer hacia abajo cuando hay pocas cards */}
        {menus.length <= 6 && <div className="flex-grow" />}

        {/* pie de pagina */}
        <footer className="pt-12 pb-6 text-center max-w-4xl mx-auto w-full">
          <div className="text-center text-slate-600">
            <p className="text-sm text-slate-500 mb-4">¿Necesitas ayuda?</p>
            {/* contactar */}
            <Button
              variant="ghost"
              className="text-orange-500 hover:text-orange-600 hover:bg-orange-50 rounded-xl px-6 py-2 transition-all duration-200 font-medium"
            >
              Contáctanos
            </Button>
          </div>
        </footer>
      </div>
    </main>
  );
}
