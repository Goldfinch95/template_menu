"use client";

import React, { useState, useEffect, useRef, Suspense, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import FoodMenuItem from "@/app/components/FoodMenuItem";
import type { Menu, Categories, Items } from "@/interfaces/menu";
import { getMenu } from "@/common/utils/api";
import Image from "next/image";
import { Button } from "@/common/components/ui/button";
import { Badge } from "@/common/components/ui/badge";
import { Card, CardContent } from "@/common/components/ui/card";
import { Separator } from "@/common/components/ui/separator";
import { ArrowLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ItemCardDialog from "./components/ItemCardDialog";

/* --------------------------------------------------
   🔍 Detecta luminancia y determina si el color
   es claro u oscuro
-------------------------------------------------- */
function getLuminance(color: string): number {
  let r, g, b;

  if (color.startsWith("#")) {
    const hex = color.replace("#", "");
    const bigint = parseInt(
      hex.length === 3
        ? hex
            .split("")
            .map((x) => x + x)
            .join("")
        : hex,
      16
    );
    r = (bigint >> 16) & 255;
    g = (bigint >> 8) & 255;
    b = bigint & 255;
  } else if (color.startsWith("rgb")) {
    const values = color.match(/\d+/g);
    if (!values) return 255;
    [r, g, b] = values.map(Number);
  } else {
    return 255;
  }

  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function MenuContent() {
  const [menu, setMenu] = useState<Menu>({} as Menu);
  const [categories, setCategories] = useState<Categories[]>([]);
  const [selectedItem, setSelectedItem] = useState<Items | null>(null);
  const searchParams = useSearchParams();
  const menuId = searchParams.get("id");
  const router = useRouter();

  const [activeCategory, setActiveCategory] = useState(1);
  const [isScrolling, setIsScrolling] = useState(false);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  /* --------------------------------------------------
     📌 Cargar menú
  -------------------------------------------------- */
  useEffect(() => {
    if (!menuId) return;

    const loadMenu = async () => {
      try {
        const menuData = await getMenu(menuId);
        setMenu(menuData);

        const sortedCategories = [...menuData.categories].sort(
          (a, b) => a.position - b.position
        );
        setCategories(sortedCategories);
      } catch (error) {
        console.error("❌ Error al cargar el menú:", error);
      }
    };

    loadMenu();
  }, [menuId]);

  /* --------------------------------------------------
     📌 Detectar color claro/oscuro para el navbar
  -------------------------------------------------- */
  const isNavbarDark = useMemo(() => {
    if (!menu.color?.primary) return false;
    return getLuminance(menu.color.primary) < 140;
  }, [menu.color?.primary]);

  /* --------------------------------------------------
     📌 Detectar color claro/oscuro para cards
  -------------------------------------------------- */
  const isDark = useMemo(() => {
    if (!menu.color?.primary) return false;
    return getLuminance(menu.color.primary) < 140;
  }, [menu.color?.primary]);

  /* --------------------------------------------------
     🎨 Card con colores dinámicos
  -------------------------------------------------- */
  const cardClass = isDark
    ? `
        rounded-3xl
        bg-white/15
        backdrop-blur-xl
        border border-white/20
        shadow-[0_8px_30px_rgba(0,0,0,0.3)]
        hover:bg-white/25
        transition-all
      `
    : `
        rounded-3xl
        bg-black/10
        backdrop-blur-xl
        border border-black/20
        shadow-[0_8px_30px_rgba(0,0,0,0.12)]
        hover:bg-black/15
        transition-all
      `;

  /* --------------------------------------------------
     📌 Sincronizar navbar con el scroll
  -------------------------------------------------- */
  useEffect(() => {
    if (categories.length === 0) return;

    const handleScroll = () => {
      if (isScrolling) return;

      const categoryIds = categories.map((cat) => cat.id);
      const navHeight = 120;

      const isAtBottom =
        Math.ceil(window.innerHeight + window.scrollY) >=
        document.documentElement.scrollHeight;

      if (isAtBottom) {
        setActiveCategory(categoryIds[categoryIds.length - 1]);
        return;
      }

      for (let i = categoryIds.length - 1; i >= 0; i--) {
        const categoryId = categoryIds[i];
        const element = document.getElementById(categoryId.toString());

        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= navHeight + 12) {
            setActiveCategory(categoryId);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, [categories, isScrolling]);

  /* --------------------------------------------------
     📌 Scroll suave a categoría
  -------------------------------------------------- */
  const scrollToCategory = (categoryId: number) => {
    setActiveCategory(categoryId);
    setIsScrolling(true);

    if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);

    const element = document.getElementById(categoryId.toString());
    if (element) {
      const navHeight = 120;
      const elementPosition =
        element.getBoundingClientRect().top + window.pageYOffset;

      const offsetPosition = elementPosition - navHeight;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });

      scrollTimeoutRef.current = setTimeout(() => {
        setIsScrolling(false);
      }, 700);
    }
  };

  /* --------------------------------------------------
     📌 RENDER MENU PAGE
  -------------------------------------------------- */
  return (
    <div
      className="min-h-screen flex flex-col"
      style={{
        backgroundColor: menu.color?.primary || "#ffffff",
      }}
    >
      {/* NAVBAR */}
      <motion.div
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md"
        style={{
          backgroundColor: menu.color?.primary
            ? `${menu.color.primary}B3` // Añade transparencia 70% (B3 en hex)
            : "rgba(255, 255, 255, 0.7)",
        }}
      >
        <div className="max-w-xl mx-auto px-4 py-2 flex items-center justify-start">
          <Button
            variant="ghost"
            size="icon"
            className={`rounded-xl transition-colors ${
              isNavbarDark
                ? "hover:bg-white/10 text-white"
                : "hover:bg-black/10 text-black"
            }`}
            onClick={() => router.push(`/menuEditor?id=${menuId}`)}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </div>
      </motion.div>

      {/* HEADER */}
      <header className="relative h-64 w-full mt-14">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={
            menu.backgroundImage
              ? {
                  backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.55), rgba(0,0,0,0.55)), url(${menu.backgroundImage})`,
                }
              : { backgroundColor: menu.color?.primary }
          }
        />

        <div className="relative flex flex-col items-center justify-center text-center h-full max-w-xl mx-auto px-4">
          {menu.logo && (
            <Card className="p-2 w-28 h-28 flex items-center justify-center rounded-2xl shadow-xl overflow-hidden  bg-transparent border-0 mb-3">
              <Image
                src={menu.logo}
                alt="Logo"
                width={50} // tamaño original alto/resolución
                height={50}
                className="object-cover w-full h-full"
              />
            </Card>
          )}

          <h1 className="text-white text-3xl font-semibold drop-shadow-lg">
            {menu.title}
          </h1>

          <p className="text-white/90 text-md mt-1">{menu.pos}</p>
        </div>
      </header>

      {/* CATEGORY NAV */}
      <div
        className="sticky top-12 z-40 backdrop-blur-xl"
        style={{
          backgroundColor: menu.color?.primary
            ? `${menu.color.primary}CC` // 80% transparencia
            : "rgba(255,255,255,0.8)",
        }}
      >
        <div
          className={`
      max-w-xl mx-auto px-4 py-3 flex gap-2 scrollbar-hide
      ${categories.length <= 4 ? "justify-center" : "overflow-x-auto"}
    `}
        >
          {categories.map((cat) => {
            const isActive = activeCategory === cat.id;

            const activeBg = menu.color?.secondary || "#000";
            const textColor =
              getLuminance(activeBg) < 140 ? "text-white" : "text-black";

            return (
              <motion.button
                whileTap={{ scale: 0.92 }}
                key={cat.id}
                onClick={() => scrollToCategory(cat.id)}
                className={`
            px-5 py-2 rounded-full font-medium transition-all text-sm whitespace-nowrap
            backdrop-blur-lg
            ${
              isActive
                ? `${textColor} shadow-md`
                : "text-muted-foreground hover:text-foreground"
            }
          `}
                style={{
                  backgroundColor: isActive
                    ? activeBg
                    : "rgba(255,255,255,0.25)",
                  border: isActive
                    ? "1px solid rgba(255,255,255,0.35)"
                    : "1px solid rgba(255,255,255,0.15)",
                  boxShadow: isActive ? "0 4px 12px rgba(0,0,0,0.15)" : "none",
                }}
              >
                {cat.title}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* CONTENT */}
      <div
        className="flex-grow pb-20"
        style={{
          backgroundColor: menu.color?.primary,
        }}
      >
        <main className="max-w-xl mx-auto px-4 py-6 space-y-8">
          {categories.map((category) => {
            const sortedItems = category.items
              ? [...category.items].sort((a, b) => a.position - b.position)
              : [];

            return (
              <section key={category.id} id={category.id.toString()}>
                <div className="mb-6">
                  <h2
                    className="text-lg font-semibold tracking-wide"
                    style={{
                      color: menu.color?.secondary,
                    }}
                  >
                    {category.title}
                  </h2>
                  <div
                    className="mt-2 w-full rounded-full"
                    style={{
                      height: "3px",
                      backgroundColor: `${menu.color?.secondary}AA`, // barra suave con transparencia
                    }}
                  />
                </div>

                <div className="space-y-4">
                  <AnimatePresence>
                    {sortedItems.map((item) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.25 }}
                      >
                        {/* Card clickeable */}
                        <Card
                          className={`
    rounded-2xl
    border 
    shadow-sm shadow-black/5 
    transition-all 
    cursor-pointer
    ${
      isDark
        ? "bg-neutral-900 border-neutral-700 active:scale-[0.97]"
        : "bg-white border-neutral-200 active:scale-[0.97]"
    }
  `}
                          onClick={() => setSelectedItem(item)}
                        >
                          <CardContent className="p-4">
                            <FoodMenuItem
                              {...item}
                              primaryColor={menu.color?.primary}
                            />
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </section>
            );
          })}
        </main>
      </div>
      {selectedItem && (
        <ItemCardDialog
          item={selectedItem}
          onClose={() => setSelectedItem(null)}
        />
      )}
    </div>
  );
}

export default function Menupage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-background">
          <p className="text-lg text-muted-foreground">Cargando menú...</p>
        </div>
      }
    >
      <MenuContent />
    </Suspense>
  );
}
