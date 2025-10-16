"use client";

import React, { useState, useEffect } from "react";
import FoodMenuItem from "@/app/components/FoodMenuItem";
import menuData from "@/app/data/menu.json";
import type { Category, MenuData } from "@/interfaces/menu";

const categories: Category[] = [
  { id: "promociones", label: "Promociones" },
  { id: "entradas", label: "Entradas" },
  { id: "principales", label: "Principales" },
  { id: "postres", label: "Postres" },
  { id: "bebidas", label: "Bebidas" },
];

export default function Menupage() {
  const [activeCategory, setActiveCategory] =
    useState<keyof MenuData>("promociones");

  useEffect(() => {
    const handleScroll = () => {
      const categoryIds: (keyof MenuData)[] = [
        "promociones",
        "entradas",
        "principales",
        "postres",
        "bebidas",
      ];

      for (const sectionId of categoryIds) {
        const element = document.getElementById(sectionId);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 150 && rect.bottom >= 150) {
            setActiveCategory(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToCategory = (categoryId: keyof MenuData) => {
    setActiveCategory(categoryId);
    const element = document.getElementById(categoryId);
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
              Different
            </h1>
            <p className="text-white text-2xl font-light mt-1 drop-shadow-lg">
              kind of Food
            </p>
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
                {category.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Menu Content */}
      <main className="max-w-2xl mx-auto px-4 py-6">
        {categories.map((category) => (
          <section key={category.id} id={category.id} className="mb-8">
            <div className="mb-4 flex items-end gap-2">
              <h2 className="text-white text-2xl font-bold">
                {category.label}
              </h2>
              <div className="h-0.5 w-full bg-red-500 rounded mb-1" />
            </div>

            <div>
              {menuData[category.id].map((item) => (
                <FoodMenuItem key={item.id} {...item} />
              ))}
            </div>
          </section>
        ))}
      </main>
    </div>
  );
}
