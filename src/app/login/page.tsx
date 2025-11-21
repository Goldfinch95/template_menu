"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/common/components/ui/card";
import { Button } from "@/common/components/ui/button";
import { Input } from "@/common/components/ui/input";
import { Label } from "@/common/components/ui/label";
import { AnimatePresence, motion } from "framer-motion";
import { Manrope } from "next/font/google";
import { UtensilsCrossed, ArrowLeft } from "lucide-react";
import { loginUser } from "@/common/utils/api";

const manrope = Manrope({ subsets: ["latin"] });

export default function LoginPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    // Limpiar error cuando el usuario empieza a escribir
    if (error) setError(null);
  };

  const handleSubmit = async () => {
    // Validación básica
    if (!form.email || !form.password) {
      setError("Por favor completá todos los campos");
      return;
    }

    setLoading(true);
    setError(null);
    // Simulación de login
    try {
      const response = await loginUser({
        email: form.email,
        password: form.password,
      });
      console.log("✅ Login exitoso:", response.user);
      router.push("/");
    } catch (err) {
      console.error("❌ Error en login:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Error al iniciar sesión. Intentá de nuevo."
      );
    } finally {
      setLoading(false);
    }
  };


  return (
    <main
      className="
        min-h-screen
        flex items-center justify-center 
        bg-gradient-to-b from-white via-[#FFF3EC] to-[#FFE6D3]
        backdrop-blur-xl bg-white/60
        border border-white/30
        shadow-[0_8px_24px_rgba(0,0,0,0.08)]
        px-5 py-8
      "
    >
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="w-full max-w-md"
        >
          <Card className="relative p-8 rounded-3xl shadow-lg border-0 bg-white/70 backdrop-blur-md">
            {/* Burbujas decorativas */}
            <div className="absolute right-0 top-0 w-20 h-20 bg-white/40 rounded-full -mr-8 -mt-8" />
            <div className="absolute right-4 bottom-0 w-16 h-16 bg-white/40 rounded-full" />

            <div className="relative z-10">
              {/* Ícono */}
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-orange-400 to-orange-500 shadow-md flex items-center justify-center">
                <UtensilsCrossed className="w-8 h-8 text-white" />
              </div>

              {/* Título */}
              <h1
                className={`${manrope.className} text-xl font-bold text-center text-slate-900`}
              >
                Iniciar sesión
              </h1>
              <p className="text-center text-sm text-slate-600 mb-8">
                Accedé a tu cuenta
              </p>

              {/* Formulario */}
              <div className="space-y-5">
                {/* Email */}
                <div>
                  <Label className="text-slate-700">Email</Label>
                  <Input
                    name="email"
                    type="email"
                    placeholder="correo@example.com"
                    className="mt-1 bg-white/80 backdrop-blur-sm border border-slate-200 focus:ring-orange-400 focus:border-orange-400"
                    value={form.email}
                    onChange={handleChange}
                    disabled={loading}
                  />
                </div>

                {/* Password */}
                <div>
                  <Label className="text-slate-700">Contraseña</Label>
                  <Input
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    className="mt-1 bg-white/80 backdrop-blur-sm border border-slate-200 focus:ring-orange-400 focus:border-orange-400"
                    value={form.password}
                    onChange={handleChange}
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Botón submit */}
              <Button
                onClick={handleSubmit}
                disabled={loading}
                className="
                  w-full mt-8 py-3 rounded-xl
                  bg-gradient-to-r from-orange-400 to-orange-500 
                  text-white font-semibold
                  shadow-md hover:shadow-lg 
                  active:scale-[0.98] transition-all duration-300
                "
              >
                {loading ? "Ingresando..." : "Entrar"}
              </Button>

              {/* Link a register */}
              <p className="text-center text-sm text-slate-600 mt-4">
                ¿No tenés cuenta?
                <span
                  className="text-orange-500 font-medium cursor-pointer hover:underline ml-1"
                  onClick={() => !loading && router.push("/register")}
                >
                  Crear cuenta
                </span>
              </p>

              {/* Botón volver */}
              <div className="flex justify-center mt-4">
                {/*boton para volver a la pagina principal, si se hace */}
                {/*<button
                  onClick={() => router.push("/")}
                  className="flex items-center text-sm text-slate-500 hover:text-slate-700 transition"
                >
                  <ArrowLeft className="w-4 h-4 mr-1" />
                  Volver al inicio
                </button>*/}
              </div>
            </div>
          </Card>
        </motion.div>
      </AnimatePresence>
    </main>
  );
}
