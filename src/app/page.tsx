"use client";

import React from "react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/common/components/ui/card";
import { Button } from "@/common/components/ui/button";
import { Plus, UtensilsCrossed, ChevronRight } from "lucide-react";
import { Menues } from "@/interfaces/menu";

// Función auxiliar para convertir hex a gradiente de Tailwind
const hexToGradient = (primaryHex: string, secondaryHex: string) => {
  // Esta función retorna un estilo inline en lugar de clases de Tailwind
  return {
    backgroundImage: `linear-gradient(to bottom right, ${primaryHex}, ${secondaryHex})`
  };
};

export default function Home() {
  const [menus, setMenus] = useState<Menues[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchMenus = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/menus/");

        if (!response.ok) {
          throw new Error("Error al cargar los menús");
        }

        const data: Menues[] = await response.json();

        //example colors
        const colors = [
          { color: "from-orange-500 to-red-600" },
          { color: "from-amber-600 to-orange-700" },
          { color: "from-emerald-500 to-teal-600" },
          { color: "from-rose-500 to-pink-600" },
          { color: "from-red-600 to-rose-700" },
          { color: "from-green-500 to-emerald-600" },
          { color: "from-purple-500 to-indigo-600" },
          { color: "from-blue-500 to-cyan-600" },
        ];

        console.log("Menús cargados:", data);

        // Mapear los datos
        const menus = data.map((menu) => ({
          id: menu.id,
          title: menu.title,
          logo: menu.logo, // Mantener logo si es necesario
          color: menu.color,
           // Asignar color de ejemplo cíclicamente
        }));

        setMenus(menus);
      } catch (err) {
        console.error(
          "Error al cargar los menús:",
          err instanceof Error ? err.message : "Error desconocido"
        );
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
    <main className="min-h-screen bg-slate-950 pb-20">
      {/* Header fijo */}
      <header className="sticky top-0 z-10 bg-slate-950/95 backdrop-blur-lg border-b border-slate-800 px-6 py-4">
        <div className="max-w-md mx-auto">
          <h1 className="text-2xl font-bold text-white mb-1">Mis Menús</h1>
          <p className="text-sm text-slate-400">Gestiona tus menús digitales</p>
        </div>
      </header>

      <div className="max-w-md mx-auto px-4 py-6 space-y-6">
        {/* Botón crear nuevo menu */}
        <Button
          className="w-full h-14 bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700 text-white rounded-2xl shadow-lg shadow-blue-500/20 font-semibold text-base transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
          onClick={handleCreateNewMenu}
        >
          <Plus className="w-5 h-5 mr-2" />
          Crear Nuevo Menú
        </Button>
      </div>
      {/* menus */}
      <section className="grid grid-cols-2 gap-4 px-4">
        {menus.map((menu) => (
          <Card
            key={menu.id}
            className="group cursor-pointer overflow-hidden border-0 bg-transparent p-0 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
            onClick={() => handleMenuClick(menu.id, menu.title)}
          >
            <div
                className="relative h-44 md:h-auto md:aspect-[2/3] rounded-3xl p-4 md:p-5 flex flex-col justify-between shadow-xl hover:shadow-2xl transition-shadow duration-300"
                style={hexToGradient(menu.color.primary, menu.color.secondary)}
              >
              {/* Patrón de fondo */}
              <div className="absolute inset-0 bg-black/10 rounded-3xl" />
              {/* Contenido  */}
              <div className="relative z-10 flex flex-col h-full">
                {/* Icono o Logo */}
                  <div className="flex-1 flex items-center justify-center">
                    {menu.logo ? (
                      // Si hay logo, muestra la imagen
                      <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-white/25 backdrop-blur-sm flex items-center justify-center overflow-hidden transition-transform duration-300 group-hover:scale-110 shadow-lg">
                        <img 
                          src={menu.logo} 
                          alt={menu.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      // Si no hay logo, muestra los íconos de cubiertos
                      <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-white/25 backdrop-blur-sm flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
                        <UtensilsCrossed
                          className="w-7 h-7 md:w-8 md:h-8 text-white absolute transition-all duration-300 group-hover:opacity-0 group-hover:scale-75"
                          strokeWidth={2.5}
                        />
                        <ChevronRight
                          className="w-7 h-7 md:w-8 md:h-8 text-white absolute transition-all duration-300 opacity-0 scale-75 group-hover:opacity-100 group-hover:scale-100"
                          strokeWidth={2.5}
                        />
                      </div>
                    )}
                  </div>
                {/* Título */}
                <div className="text-center">
                  <h3 className="font-bold text-white text-sm leading-tight mb-1">
                    {menu.title}
                  </h3>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </section>

      {/* pie de pagina */}
      <footer className="pt-6 text-center">
        <div className="text-center text-slate-600">
          <p className="text-xs text-slate-500 mb-3">¿Necesitas ayuda?</p>
          <Button
            variant="ghost"
            className="text-blue-400 hover:text-blue-300 hover:bg-slate-900 rounded-xl text-sm"
          >
            Contáctanos
          </Button>
        </div>
      </footer>
    </main>
  );
}
