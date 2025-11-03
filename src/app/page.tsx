"use client";

import React from "react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/common/components/ui/card";
import { Button } from "@/common/components/ui/button";
import { Plus, UtensilsCrossed, ChevronRight, LogOut } from "lucide-react";
import { Menu } from "@/interfaces/menu";
import Image from "next/image";
import { Manrope } from "next/font/google";
import { getMenus } from "@/common/utils/api";

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
  const [menus, setMenus] = useState<Menu[]>([]);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchMenus = async () => {
      try {
        const data = await getMenus();
        setMenus(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "No se reciben los Menus de la base de datos");
        
      }
    };

    fetchMenus();
  }, []);

  const handleMenuClick = (menuId: number, menuTitle: string) => {
    router.push(
      `/menuEditor?id=${menuId}&title=${encodeURIComponent(menuTitle)}`
    );
  };

  const handleCreateNewMenu = () => {
    router.push("/menuEditor");
  };

  return (
    <main
      className="
      min-h-screen  
      
      bg-gradient-to-b from-white via-[#FFF3EC] to-[#FFE6D3]
      
      backdrop-blur-xl bg-white/60
      border border-white/30
      shadow-[0_8px_24px_rgba(0,0,0,0.08)]
    "
    >
      {/* Contenedor flex para el footer */}
      <div className="min-h-[calc(100vh-3rem)] flex flex-col">
        {/* Header */}
        <header className="px-5 pt-4 pb-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-orange-500 rounded-xl flex items-center justify-center shadow-md">
                <UtensilsCrossed className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1 text-center mx-4">
                <h1 className={`${manrope.className} text-lg font-bold text-slate-900`}>Mis Menús</h1>
                <p className="text-xs text-slate-500">
                  Gestiona tus menús digitales
                </p>
              </div>
              <button className="p-2 hover:bg-red-50 rounded-lg transition-colors group">
                <LogOut className="w-5 h-5 text-slate-700 group-hover:text-red-500 transition-colors" />
              </button>
            </div>
          </div>
        </header>

        {/* Content */}
        <section className="max-w-4xl mx-auto w-full px-5 py-4">
          {/* button create new menu */}
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
        </section>

        {/* menus */}
        <div className="mb-6">
          <div className="flex items-center justify-between max-w-4xl mx-auto px-5">
            <h2 className={`${manrope.className} text-lg font-bold text-slate-900`}>Tus menús</h2>
          </div>
        </div>

        <section className="max-w-4xl mx-auto w-full px-5">
          <div className="grid grid-cols-2 gap-7">
          {menus.map((menu) => (
            <Card
              key={menu.id}
              className="group cursor-pointer overflow-hidden border-0 bg-transparent p-0 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
              onClick={() => handleMenuClick(menu.id, menu.title)}
            >
              <div
                className="relative h-44 lg:h-64 rounded-3xl p-5 lg:p-6 flex flex-col justify-between shadow-xl hover:shadow-2xl transition-shadow duration-300"
                style={hexToGradient(menu.color?.primary, menu.color?.secondary)}
              >
                {/* Patrón de fondo */}
                <div className="absolute inset-0 bg-black/10 rounded-3xl" />

                {/* Contenido */}
                <div className="relative z-10 flex flex-col h-full">
                  {/* Icono o Logo */}
                  <div className="flex-1 flex items-center justify-center">
                    {menu.logo ? (
                      <div className="w-16 h-16 lg:w-20 lg:h-20 rounded-full bg-white/25 backdrop-blur-sm flex items-center justify-center overflow-hidden transition-transform duration-300 group-hover:scale-110 shadow-lg">
                        <Image
                          src={menu.logo}
                          alt={menu.title}
                          width={80}
                          height={80}
                          className="w-full h-full object-cover"
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

                  {/* Título */}
                  <div className="text-center">
                    <h3 className="font-bold text-white text-sm lg:text-base leading-tight mb-1">
                      {menu.title}
                    </h3>
                  </div>
                </div>
              </div>
            </Card>
          ))}
          </div>
        </section>

        {/* Espaciador flexible para empujar el footer hacia abajo cuando hay pocas cards */}
        {menus.length <= 6 && <div className="flex-grow" />}

        {/* pie de pagina */}
        <footer className="pt-12 pb-6 text-center max-w-4xl mx-auto w-full">
          <div className="text-center text-slate-600">
            <p className="text-sm text-slate-500 mb-4">¿Necesitas ayuda?</p>
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
