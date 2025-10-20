"use client"

import React from "react";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from "@/common/components/ui/card";
import { Button } from "@/common/components/ui/button";
import { Plus, FilePenLine } from "lucide-react";
import { Menues } from "@/interfaces/menu";


export default function Home() {
   const [menus, setMenus] = useState<Menues[]>([]);
   const [error, setError] = useState<string | null>(null);
   const router = useRouter();
   

   useEffect(() => {
    const fetchMenus = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/menus/');
        
        if (!response.ok) {
          throw new Error('Error al cargar los menús');
        }
        
        const data = await response.json();

        console.log('Menús cargados:', data);

        // Mapear los datos y asignar colores
        const menus = data.map((menu: any, index: number) => ({
          id: menu.id,
          title: menu.title,
        }));

        setMenus(menus);
         } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido');
      }
    };

    fetchMenus();
  }, []);

   
 const handleMenuClick = (menuId: number, menuTitle: string) => {
  router.push(`/menuEditor?id=${menuId}&title=${encodeURIComponent(menuTitle)}`);
};
 
 

  return (
    <main className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto space-y-8 flex flex-col">
        {/* title */}
        <header className="text-center">
          <h1 className="text-4xl font-bold mb-2 ">Mis Menús</h1>
          <p className="">Explora y selecciona entre los menús creados</p>
        </header>

        {/* button */}
        <div className="flex justify-center">
          <Button className="gap-2 dark">
            <Plus className="w-4 h-4" />
            Crear Nuevo Menú
          </Button>
        </div>

        {/* menus */}
        <section className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {menus.map((menu) => (
            <Card
              key={menu.id}
              className="group cursor-pointer overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 aspect-[3/5] p-0 border-0"
              onClick={() => handleMenuClick(menu.id, menu.title)}
            >
              <div className={`h-full w-full bg-slate-600 flex items-center justify-center relative p-4`}>
                {/* Overlay oscuro en hover */}
                <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-40 transition-opacity duration-300" />
                
                {/* Contenido por defecto */}
                <div className="text-white text-center z-10 group-hover:opacity-0 transition-opacity duration-300">
                  <div className="text-4xl mb-3">🍽️</div>
                  <h3 className="font-bold text-sm leading-tight">
                    {menu.title}
                  </h3>
                </div>

                {/* Símbolo + que aparece en hover */}
                <div className="absolute inset-0 flex items-center justify-center z-20 opacity-0 group-hover:opacity-100 transition-all duration-300 scale-75 group-hover:scale-100">
                  <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border-2 border-white">
                    <FilePenLine className="w-8 h-8 text-white" />
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </section>

        {/* pie de pagina */}
        <footer className="border-t border-slate-300 pt-8 mt-12">
          <div className="text-center text-slate-600">
            <p className="text-sm text-white mb-2">¿Necesitas ayuda?</p>
            <Button
              variant="link"
              className="text-blue-600 hover:text-blue-700"
            >
              Contáctanos
            </Button>
          </div>
        </footer>
      </div>
    </main>
  );
}
