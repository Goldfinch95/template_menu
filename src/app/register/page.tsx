"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/common/components/ui/card";
import { Button } from "@/common/components/ui/button";
import { Input } from "@/common/components/ui/input";
import { Label } from "@/common/components/ui/label";
import { AnimatePresence, motion } from "framer-motion";
import { Manrope } from "next/font/google";
import { UtensilsCrossed } from "lucide-react";
import { registerUser } from "@/common/utils/api";
const manrope = Manrope({ subsets: ["latin"] });

export default function RegisterPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    lastName: "",
    email: "",
    cel: "",
    password: "",
    subdomain: "",
  });

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    // Limpiar error al escribir
    if (error) setError(null);
  };

  const handleSubmit = async () => {
    // Validaciones básicas
    if (!form.name || !form.lastName || !form.email || !form.password) {
      setError("Por favor completa todos los campos obligatorios");
      return;
    }

    if (form.password.length < 8 || form.password.length > 16) {
      setError("La contraseña debe tener entre 8 y 16 caracteres");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // 🔥 Llamada a la API
      const payload = await registerUser({
        name: form.name,
        lastName: form.lastName,
        email: form.email,
        cel: form.cel || undefined,
        roleId: 2, // 👈 Ajusta según tu lógica (2 = cliente)
        password: form.password,
        subdomain: form.password,
      });

      console.log("✅ Usuario creado exitosamente:", payload);
      
      // Redirigir al login después del registro exitoso
      router.push("/login");
    } catch (err: any) {
      console.error("❌ Error en el registro:", err);
      setError(err.message || "Error al crear la cuenta. Intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main
      className="
        min-h-screen  
        bg-gradient-to-b from-white via-[#FFF3EC] to-[#FFE6D3]
        backdrop-blur-xl bg-white/60
        border border-white/30
        shadow-[0_8px_24px_rgba(0,0,0,0.08)]
        flex items-center justify-center px-5 py-8
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
                Crear cuenta
              </h1>
              <p className="text-center text-sm text-slate-600 mb-8">
                Completa tus datos para comenzar
              </p>

              {/* Formulario */}
              <div className="space-y-5">
                {/* Nombre */}
                <div>
                  <Label className="text-slate-700">Nombre</Label>
                  <Input
                    name="name"
                    placeholder="Tu nombre"
                    type="text"
                    className="mt-1 bg-white/80 backdrop-blur-sm border border-slate-200 focus:ring-orange-400 focus:border-orange-400"
                    value={form.name}
                    onChange={handleChange}
                  />
                </div>

                {/* Apellido */}
                <div>
                  <Label className="text-slate-700">Apellido</Label>
                  <Input
                    name="lastName"
                    placeholder="Tu apellido"
                    className="mt-1 bg-white/80 backdrop-blur-sm border border-slate-200 focus:ring-orange-400 focus:border-orange-400"
                    value={form.lastName}
                    onChange={handleChange}
                  />
                </div>

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
                  />
                </div>

                {/* Celular */}
                <div>
                  <Label className="text-slate-700">Celular</Label>
                  <Input
                    name="cel"
                    type="tel"
                    placeholder="+54 9 ..."
                    className="mt-1 bg-white/80 backdrop-blur-sm border border-slate-200 focus:ring-orange-400 focus:border-orange-400"
                    value={form.cel}
                    onChange={handleChange}
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
                {loading ? "Creando cuenta..." : "Registrarme"}
              </Button>

              {/* Link a login */}
              <p className="text-center text-sm text-slate-600 mt-4">
                ¿Ya tenés cuenta?{" "}
                <span
                  className="text-orange-500 font-medium cursor-pointer hover:underline"
                  onClick={() => router.push("/login")}
                >
                  Iniciar sesión
                </span>
              </p>
            </div>
          </Card>
        </motion.div>
      </AnimatePresence>
    </main>
  );
}
