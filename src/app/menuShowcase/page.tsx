"use client";

import React, { useState, useEffect, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Manrope } from "next/font/google";
import { toast } from "sonner";

import { Menu } from "@/interfaces/menu";
import { menuService, authService } from "@/app/services";

import { Card } from "@/common/components/ui/card";
import { Button } from "@/common/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/common/components/ui/dropdown-menu";
import { Skeleton } from "@/common/components/ui/skeleton";

import { Plus, UtensilsCrossed, ChevronRight, LogOut } from "lucide-react";

const manrope = Manrope({ subsets: ["latin"] });

// Función auxiliar de gradiente
const hexToGradient = (primaryHex: string, secondaryHex: string) => ({
  backgroundImage: `linear-gradient(to bottom right, ${primaryHex}, ${secondaryHex})`,
});

function MenuShowcase() {
  // ---------- Router ----------
  const router = useRouter();
  const searchParams = useSearchParams();

  // ---------- Estados ----------
  // Menú
  const [menus, setMenus] = useState<Menu[]>([]);
  // Cargando
  const [isLoading, setIsLoading] = useState(true);
  // Role ID
  const [roleId, setRoleId] = useState<number | null>(null);

  // Ref para controlar el toast de bienvenida
  const hasShown = useRef(false);

  // ---------- Handlers ----------

  // Crear nuevo menú
  const handleCreateNewMenu = () => {
    router.push("/menuEditor");
  };

  // Ir a editor de menú
  const handleMenuClick = (menuId: number, menuTitle: string) => {
    router.push(
      `/menuEditor?id=${menuId}&title=${encodeURIComponent(menuTitle)}`
    );
  };

  // Logout
  const handleLogout = () => {
    authService.logout();
    router.push("/");
  };

  // Simular delay (para demostraciones o pruebas)

  const simulateDelay = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  // ---------- Efectos ----------
  useEffect(() => {
    // 1. Obtener usuario del localStorage
    const userData = localStorage.getItem("user");
    if (userData) {
      try {
        const parsed = JSON.parse(userData);
        setRoleId(parsed.roleId);
      } catch (err) {
        console.error("Error parsing localStorage user:", err);
      }
    }

    // 2. Mostrar toast solo si venimos del login
    const loginSuccess = searchParams.get("loginSuccess");

    if (loginSuccess === "1") {
      // Evitar que se repita
      if (hasShown.current) return;
      hasShown.current = true;

      // Mostrar sonner (login éxito)
      toast.success(`¡Bienvenido!`, {
        duration: 2000,
        icon: null,
        className: "success-toast-center",
        style: {
          background: "#22c55e",
          color: "white",
          fontWeight: 400,
          borderRadius: "10px",
          padding: "14px 16px",
          fontSize: "16px",
        },
      });

      // Eliminar el parámetro de la URL
      const params = new URLSearchParams(searchParams.toString());
      params.delete("loginSuccess");
      router.replace(`?${params.toString()}`, { scroll: false });
    }

    // 3. Mostrar toast si el menú fue creado exitosamente
    const menuCreated = searchParams.get("menuCreated");

    if (menuCreated === "true") {
      // Evitar que se repita
      if (hasShown.current) return;
      hasShown.current = true;

      // Mostrar sonner (menú creado)
      toast.success(`¡Menú creado con éxito!`, {
        duration: 2000,
        icon: null,
        className: "success-toast-center",
        style: {
          background: "#22c55e",
          color: "white",
          fontWeight: 400,
          borderRadius: "10px",
          padding: "14px 16px",
          fontSize: "16px",
        },
      });

      // Eliminar el parámetro de la URL después de un pequeño retraso
      setTimeout(() => {
        const params = new URLSearchParams(searchParams.toString());
        params.delete("menuCreated");
        router.replace(`?${params.toString()}`, { scroll: false });
      }, 2000); // Retraso de 2 segundos para que el toast se vea antes de eliminar el parámetro
    }

    // 4. Mostrar toast si el menú fue eliminado exitosamente
    const menuDeleted = searchParams.get("menuDeleted");

    if (menuDeleted === "true") {
      // Evitar que se repita
      if (hasShown.current) return;
      hasShown.current = true;

      // Mostrar sonner (menú eliminado)
      toast.success(`¡Menú eliminado con éxito!`, {
        duration: 2000,
        icon: null,
        className: "success-toast-center",
        style: {
          background: "#22c55e", // Verde
          color: "white",
          fontWeight: 500,
          borderRadius: "12px",
          padding: "14px 16px",
          fontSize: "16px",
        },
      });

      // Eliminar el parámetro de la URL después de un pequeño retraso
      setTimeout(() => {
        const params = new URLSearchParams(searchParams.toString());
        params.delete("menuDeleted");
        router.replace(`?${params.toString()}`, { scroll: false });
      }, 2000); // Retraso de 2 segundos para que el toast se vea antes de eliminar el parámetro
    }
  }, [searchParams, router]);
  // obtener menús
  useEffect(() => {
    const fetchMenus = async () => {
      try {
        const fakeTime = Math.random() * 700 + 1500;
        await simulateDelay(fakeTime);
        setIsLoading(true);
        // llamar al API para obtener menús
        const data = await menuService.getAll();
        setMenus(data);
      } catch (err) {
        console.log(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMenus();
  }, []);

  // ---------- Render ----------
  return (
    <main
      className="
        min-h-screen bg-gradient-to-b from-white via-[#FFF3EC] to-[#FFE6D3] backdrop-blur-xl bg-white/60 borderborder-white/30 shadow-[0_8px_24px_rgba(0,0,0,0.08)]
    flex flex-col
      "
    >
      {/* nav */}
      <nav className="px-5 lg:px-12 pt-6 pb-6">
        <div className="mx-auto">
          <div className="flex items-center justify-between">
            {/* Dropdown Admin */}
            {/* debes cambiar mas adelante a un nav desplegable izquierdo */}
            {roleId === 1 ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="w-10 h-10 bg-gradient-to-br from-orange-400 to-orange-500 rounded-xl flex items-center justify-center shadow-md active:scale-95 transition">
                    <UtensilsCrossed className="w-5 h-5 text-white" />
                  </button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="start" className="w-40">
                  <DropdownMenuItem
                    onClick={() => router.push("/register")}
                    className="cursor-pointer"
                  >
                    Registrar usuario
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-orange-500 rounded-xl flex items-center justify-center shadow-md">
                <UtensilsCrossed className="w-5 h-5 text-white" />
              </div>
            )}
            <div className="flex-1 text-center mx-4">
              {/* titulo */}
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
            {/* Logout */}
            <Button
              onClick={handleLogout}
              className="p-3 rounded-lg bg-transparent active:scale-95 transition"
            >
              <LogOut className="w-5 h-5 text-slate-700" />
            </Button>
          </div>
        </div>
      </nav>

      {/* boton crear menu */}
      <section className="w-full px-5 lg:px-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.97 }}
          transition={{ duration: 0.3 }}
        >
          <div className="max-w-7xl mx-auto mb-6">
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

      <div className="mb-6 px-5 lg:px-12">
        <div className="max-w-7xl mx-auto">
          {/* Título sección */}
          <h2
            className={`${manrope.className} text-lg font-bold text-slate-900`}
          >
            Tus menús
          </h2>
        </div>
      </div>

      {/* lista de menus */}
      <section className="w-full px-5 lg:px-12 flex-1">
        <div className="max-w-7xl mx-auto">
          <AnimatePresence>
            {isLoading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={i}
                    className="rounded-3xl overflow-hidden shadow-md bg-white/10 backdrop-blur-sm p-4 sm:p-5"
                  >
                    <div className="flex flex-col items-center space-y-3">
                      <Skeleton className="w-16 h-16 rounded-full" />
                      <Skeleton className="w-24 h-4 rounded-md" />
                    </div>
                  </div>
                ))}
              </div>
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
                  Crea tu primer menú digital para empezar a personalizarlo.
                </p>
              </motion.div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
                {menus.map((menu) => (
                  <motion.div
                    key={menu.id}
                    initial={{ opacity: 0, y: 15, scale: 0.98 }}
                    animate={{
                      opacity: 1,
                      y: 0,
                      scale: 1,
                      transition: {
                        type: "spring",
                        stiffness: 110,
                        damping: 18,
                        duration: 0.45,
                      },
                    }}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.96 }}
                    className="group cursor-pointer overflow-hidden rounded-3xl bg-transparent"
                    onClick={() => handleMenuClick(menu.id, menu.title)}
                  >
                    <Card className="p-0 border-0 bg-transparent">
                      <div
                        className="
                          relative h-36 sm:h-44 lg:h-48  /* 💡 menos altura en desktop
                          rounded-3xl p-4 sm:p-5 
                          flex flex-col justify-center items-center 
                          shadow-lg hover:shadow-xl transition
                        "
                        style={hexToGradient(
                          menu.color?.primary,
                          menu.color?.secondary
                        )}
                      >
                        <div className="absolute inset-0 bg-black/10 rounded-3xl" />

                        <div className="relative z-10 flex flex-col h-full justify-between">
                          <div className="flex-1 flex items-center justify-center">
                            {menu.logo ? (
                              <div className="w-16 h-16 lg:w-20 lg:h-20 rounded-full bg-white/25 backdrop-blur-sm flex items-center justify-center overflow-hidden group-hover:scale-110 transition-transform">
                                <Image
                                  src={menu.logo}
                                  alt={menu.title}
                                  width={
                                    menu.logo ===
                                    "https://undevcode-menus.s3.sa-east-1.amazonaws.com/defaults/menu/default_menu.png"
                                      ? 50
                                      : 80
                                  }
                                  height={
                                    menu.logo ===
                                    "https://undevcode-menus.s3.sa-east-1.amazonaws.com/defaults/menu/default_menu.png"
                                      ? 50
                                      : 80
                                  }
                                  className="object-contain"
                                  priority
                                />
                              </div>
                            ) : (
                              <div className="w-14 h-14 lg:w-16 lg:h-16 rounded-full bg-white/25 backdrop-blur-sm flex items-center justify-center group-hover:scale-110 transition-transform">
                                <UtensilsCrossed className="w-7 h-7 lg:w-8 lg:h-8 text-white absolute group-hover:opacity-0 group-hover:scale-75" />
                                <ChevronRight className="w-7 h-7 lg:w-8 lg:h-8 text-white absolute opacity-0 scale-75 group-hover:opacity-100 group-hover:scale-100" />
                              </div>
                            )}
                          </div>

                          <h3 className="text-center font-bold text-white text-sm sm:text-base lg:text-lg leading-tight">
                            {menu.title}
                          </h3>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </AnimatePresence>
        </div>
      </section>
      {/* footer */}
      <footer className="pt-16 pb-10 text-center">
        <div className="text-slate-600">
          {/* ayuda */}
          <p className="text-sm text-slate-500 mb-4">
            <Link
              href="/menuShowcase/FAQ"
              className="text-slate-600 hover:text-orange-500 transition duration-200 hover:underline"
            >
              ¿Necesitas ayuda?
            </Link>
          </p>
          {/* contacto */}
          <Button
            variant="ghost"
            className="text-orange-500 hover:text-orange-600 hover:bg-orange-50 rounded-xl px-6 py-2 transition font-medium"
          >
            Contáctanos
          </Button>
        </div>
      </footer>
    </main>
  );
}

export default function Home() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gradient-to-b from-white via-[#FFF3EC] to-[#FFE6D3] flex items-center justify-center">
          <p className="text-lg text-gray-600">Cargando...</p>
        </div>
      }
    >
      <MenuShowcase />
    </Suspense>
  );
}