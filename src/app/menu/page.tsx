"use client";

import React, { useState, useEffect, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import FoodMenuItem from "@/app/components/FoodMenuItem";
import type { Menu, Categories } from "@/interfaces/menu";
import { getMenu } from "@/common/utils/api";
import Image from "next/image";

// Componente interno que usa useSearchParams
function MenuContent() {
  //Estado para el menu
  const [menu, setMenu] = useState<Menu>({} as Menu);
  // Estado para las categorias
  const [categories, setCategories] = useState<Categories[]>([]);
  //obtener el id
  const searchParams = useSearchParams();
  const menuId = searchParams.get("id");

  //estados para el scroll
  const [activeCategory, setActiveCategory] = useState(1);
  const [isScrolling, setIsScrolling] = useState(false);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // GET de categorías
  useEffect(() => {
    if (!menuId) return;

    const loadMenu = async () => {
      try {
        const menuData = await getMenu(menuId);
        setMenu(menuData);
        setCategories(menuData.categories);
      } catch (error) {
        console.error("❌ Error al cargar el menú:", error);
      }
    };
    loadMenu();
  }, [menuId]);

  useEffect(() => {
    if (categories.length === 0) return;

    const handleScroll = () => {
      // Si estamos haciendo scroll programático, no actualizar la categoría activa
      if (isScrolling) return;

      const categoryIds = categories.map((cat) => cat.id);
      const navHeight = 80;

      // Verificar si estamos exactamente al final de la página (no puede hacer más scroll)
      const isAtBottom =
        Math.ceil(window.innerHeight + window.scrollY) >=
        document.documentElement.scrollHeight;

      if (isAtBottom) {
        // Si estamos al final, activar la última categoría
        setActiveCategory(categoryIds[categoryIds.length - 1]);
        return;
      }

      // Recorrer en orden inverso para priorizar categorías más abajo
      for (let i = categoryIds.length - 1; i >= 0; i--) {
        const categoryId = categoryIds[i];
        const element = document.getElementById(categoryId.toString());
        if (element) {
          const rect = element.getBoundingClientRect();
          // Si el título de la categoría está visible en el área superior
          if (rect.top <= navHeight + 10) {
            setActiveCategory(categoryId);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [categories, isScrolling]);

  const scrollToCategory = (categoryId: number) => {
    setActiveCategory(categoryId);
    setIsScrolling(true);

    // Limpiar timeout anterior si existe
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }

    const element = document.getElementById(categoryId.toString());
    if (element) {
      const navHeight = 80;
      const elementPosition =
        element.getBoundingClientRect().top + window.pageYOffset;
      const offsetPosition = elementPosition - navHeight;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });

      // Esperar a que termine la animación de scroll (aprox 800ms para estar seguros)
      scrollTimeoutRef.current = setTimeout(() => {
        setIsScrolling(false);
        // Forzar una actualización de la categoría activa después del scroll
        const categoryIds = categories.map((cat) => cat.id);
        const navHeight = 80;

        // Verificar si estamos exactamente al final de la página
        const isAtBottom =
          Math.ceil(window.innerHeight + window.scrollY) >=
          document.documentElement.scrollHeight - 5;

        if (isAtBottom) {
          setActiveCategory(categoryIds[categoryIds.length - 1]);
        } else {
          // Encontrar qué categoría está actualmente visible
          for (let i = categoryIds.length - 1; i >= 0; i--) {
            const catId = categoryIds[i];
            const el = document.getElementById(catId.toString());
            if (el) {
              const rect = el.getBoundingClientRect();
              if (rect.top <= navHeight + 10) {
                setActiveCategory(catId);
                break;
              }
            }
          }
        }
      }, 800);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Header del menú con imagen de fondo */}
      <header className="relative h-72 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.6)), url(${menu.backgroundImage})`,
          }}
        />
        {/* Contenido del header */}
        <div className="relative h-full flex flex-col items-center justify-center px-6">
          <div className="w-28 h-28 mb-4  rounded-3xl flex items-center justify-center shadow-2xl overflow-hidden ">
            <Image
              src={menu.logo}
              alt="Logo"
              width={112}
              height={112}
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h1 className="text-white text-4xl font-bold text-center drop-shadow-lg mb-2">
              {menu.title}
            </h1>
            <h2 className="text-white text-lg">{menu.pos}</h2>
          </div>
        </div>
      </header>
      <div className="pb-8 min-h-screen" style={{
            backgroundColor: menu.color?.primary || "rgba(255,255,255,0.95)",
          }}>
        {/* Category Navigation */}
        <nav
          className="flex justify-center sticky top-0 z-10 shadow-md"
          style={{
            backgroundColor: menu.color?.primary || "rgba(255,255,255,0.95)",
          }}
        >
          <div className="max-w-2xl mx-auto px-2 py-3">
            <div className="flex gap-1.5 overflow-x-auto scrollbar-hide">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => scrollToCategory(category.id)}
                  className={`flex-shrink-0 px-3 py-2 rounded-lg text-base font-semibold transition-all whitespace-nowrap ${
                    activeCategory === category.id
                      ? "bg-slate-600 text-white"
                      : "bg-gray-800 text-gray-400 hover:bg-gray-700"
                  }`}
                >
                  {category.title}
                </button>
              ))}
            </div>
          </div>
        </nav>
        <div className=" px-4 py-6" >
          {/* Menu Content */}
          <main className="space-y-4 ">
            {categories.map((category) => (
              <section key={category.id} id={category.id.toString()}>
                <h2 className="text-xl text-black font-bold mb-4 ">
                  {category.title}
                </h2>
                <div className="space-y-4 ">
                  {category.items && category.items.length > 0 ? (
                    category.items.map((item) => (
                      <div key={item.id} className="space-y-4">
                        <FoodMenuItem key={item.id} {...item} />
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-400 text-sm">
                      No hay items en esta categoría
                    </p>
                  )}
                </div>
              </section>
            ))}
          </main>
        </div>
      </div>
    </div>
  );
}

// Componente principal con Suspense
export default function Menupage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gradient-to-br from-gray-800 via-gray-900 to-black flex items-center justify-center">
          <div className="text-white text-xl">Cargando menú...</div>
        </div>
      }
    >
      <MenuContent />
    </Suspense>
  );
}
