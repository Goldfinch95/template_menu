"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from 'next/navigation'
import FoodMenuItem from "@/app/components/FoodMenuItem";
import type { Category } from "@/interfaces/menu";

// Componente interno que usa useSearchParams
function MenuContent() {
  const searchParams = useSearchParams();
  const menuId = searchParams.get('id');
  const menuTitle = searchParams.get('title');

  const [categories, setCategories] = useState<Category[]>([]);
  const [activeCategory, setActiveCategory] = useState<number | null>(null);

  // GET de categorías
  useEffect(() => {
    const fetchCategories = async () => {
      if (!menuId) {
        console.error('No menu ID provided');
        return;
      }
      try {
        const response = await fetch(`http://localhost:3000/api/menus/${menuId}`);
        const data = await response.json();
        console.log(data.categories);
        setCategories(data.categories);
        // Establecer la primera categoría como activa por defecto
        if (data.categories.length > 0) {
          setActiveCategory(data.categories[0].id);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, [menuId]);

  useEffect(() => {
    if (categories.length === 0) return;

    const handleScroll = () => {
      const categoryIds = categories.map(cat => cat.id);

      for (const categoryId of categoryIds) {
        const element = document.getElementById(categoryId.toString());
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 150 && rect.bottom >= 150) {
            setActiveCategory(categoryId);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [categories]);

  const scrollToCategory = (categoryId: number) => {
    setActiveCategory(categoryId);
    const element = document.getElementById(categoryId.toString());
    element?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-800 via-gray-900 to-black">
      {/* Header */}
      <header className="relative h-48 rounded-b-3xl overflow-hidden bg-gray-900">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-60"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&h=400&fit=crop')",
          }}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-white text-4xl font-bold tracking-wider drop-shadow-lg">
              {menuTitle ? decodeURIComponent(menuTitle) : 'Menú'}
            </h1>
          </div>
        </div>
      </header>

      {/* Category Navigation */}
      <nav className="flex justify-center sticky top-0 z-10 bg-gray-900 border-b border-gray-800 shadow-lg">
        <div className="max-w-2xl mx-auto px-2 py-3">
          <div className="flex gap-1.5 overflow-x-auto scrollbar-hide">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => scrollToCategory(category.id)}
                className={`flex-shrink-0 px-3 py-2 rounded-full text-xs font-semibold transition-all whitespace-nowrap ${
                  activeCategory === category.id
                    ? "bg-red-500 text-white"
                    : "bg-gray-800 text-gray-400 hover:bg-gray-700"
                }`}
              >
                {category.title}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Menu Content */}
      <main className="max-w-2xl mx-auto px-4 py-6">
        {categories.map((category) => (
          <section key={category.id} id={category.id.toString()} className="mb-8">
            <div className="mb-4 flex items-end gap-2">
              <h2 className="text-white text-2xl font-bold">
                {category.title}
              </h2>
              <div className="h-0.5 w-full bg-red-500 rounded mb-1" />
            </div>

            <div>
              {category.items && category.items.length > 0 ? (
                category.items.map((item) => (
                  <FoodMenuItem key={item.id} {...item} />
                ))
              ) : (
                <p className="text-gray-400 text-sm">No hay items en esta categoría</p>
              )}
            </div>
          </section>
        ))}
      </main>
    </div>
  );
}

// Componente principal con Suspense
export default function Menupage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-gray-800 via-gray-900 to-black flex items-center justify-center">
        <div className="text-white text-xl">Cargando menú...</div>
      </div>
    }>
      <MenuContent />
    </Suspense>
  );
}