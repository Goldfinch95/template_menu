"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Alert, AlertDescription } from "@/common/components/ui/alert";

import { Button } from "@/common/components/ui/button";
import { Input } from "@/common/components/ui/input";
import { Label } from "@/common/components/ui/label";
import { AnimatePresence, motion } from "framer-motion";
import { Manrope } from "next/font/google";
import { UtensilsCrossed, X, Eye, EyeOff } from "lucide-react";
import { loginUser } from "@/common/utils/api";

const manrope = Manrope({ subsets: ["latin"] });

export default function LoginPage() {
  const router = useRouter();

  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (error) setError(null);
  };

  const [showPassword, setShowPassword] = useState(false);

  // VALIDACIÓN DE DATOS (acumulativa)
  const validateFields = (values: { email: string; password: string } = form) => {
    const errors: string[] = [];

    // Validar email
    if (!values.email) {
      errors.push("• El email es obligatorio.");
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
      errors.push("• Ingresá un email válido.");
    }

    // Validar contraseña
    if (!values.password) {
      errors.push("• La contraseña es obligatoria.");
    } else if (values.password.length < 8 || values.password.length > 16) {
      errors.push(
        "• La contraseña debe tener al menos entre 8 y 16 caracteres."
      );
    }

    // Mostrar errores acumulados
    if (errors.length > 0) {
      setAlertMessage(errors.join("\n"));
      return false;
    }

    // Sin errores → limpiar alerta
    setAlertMessage(null);
    return true;
  };

  const handleSubmit = async () => {
    //limpiar el formulario antes de enviar,controlar espacios inicio y final
    const cleanedForm = {
      email: form.email.trim(),
      password: form.password.trim(),
    };
    setForm(cleanedForm);
    if (!validateFields(cleanedForm)) return;
    setLoading(true);

    try {
      await loginUser(cleanedForm);
      //dirigirse al exhibidor de menus
      router.push("/menuShowcase");
    } catch (err) {
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
        h-screen w-full flex flex-col justify-between
        bg-gradient-to-b from-white via-[#FFF3EC] to-[#FFE6D3]
        px-6 py-10
      "
    >
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="flex flex-col w-full items-center"
        >
          {/* Ícono principal */}
          <div className="w-20 h-20 mb-6 rounded-3xl bg-gradient-to-br from-orange-400 to-orange-500 shadow-md flex items-center justify-center">
            <UtensilsCrossed className="w-10 h-10 text-white" />
          </div>

          {/* Título */}
          <h1
            className={`${manrope.className} text-3xl font-extrabold text-center text-slate-900`}
          >
            Bienvenido
          </h1>
          <p className="text-center text-base text-slate-600 mt-1 mb-8">
            Iniciá sesión para continuar
          </p>

          {/* MINI CARD */}
          <div
            className="
              w-full max-w-md p-6 rounded-2xl shadow-lg
              bg-white/70 backdrop-blur-md border border-white/40
              space-y-5
            "
          >
            <AnimatePresence>
              {alertMessage && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  transition={{ duration: 0.25 }}
                >
                  <Alert className="bg-red-100 border border-red-300 text-red-800 rounded-lg p-4 flex gap-3">
                    <X className="!w-10 !h-10 self-center" />
                    <div>
                      <AlertDescription className="whitespace-pre-line mt-1">
                        {alertMessage}
                      </AlertDescription>
                    </div>
                  </Alert>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Email */}
            <div>
              <Label className="text-slate-700">Email</Label>
              <Input
                name="email"
                type="email"
                placeholder="correo@example.com"
                className="mt-2 bg-white/85
  border-slate-300 
  focus:!border-orange-500 focus:!ring-orange-500
  transition-all duration-200"
                value={form.email}
                onChange={handleChange}
                disabled={loading}
              />
            </div>

            {/* Password */}
            <div className="relative">
              <Label className="text-slate-700">Contraseña</Label>
              <Input
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                className="mt-2 bg-white/85
  border-slate-300 
  focus:!border-orange-500 focus:!ring-orange-500
  transition-all duration-200"
                value={form.password}
                onChange={handleChange}
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="
      absolute right-3 bottom-1.5 
      text-slate-600 hover:text-slate-800
      transition-all duration-200
    "
              >
                {showPassword ? (
                  <Eye className="!w-6 !h-6" />
                ) : (
                  <EyeOff className="!w-6 !h-6" />
                )}
              </button>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="
        fixed bottom-30 left-1/2 -translate-x-1/2 
        w-[90%] max-w-md 
        bg-red-100 border border-red-300 text-red-900
        px-5 py-4 rounded-2xl shadow-lg
        flex items-center gap-4
      "
          >
            <X className="w-7 h-7 text-red-700" strokeWidth={2.5} />

            <div className="flex-1">
              <p className="text-sm text-red-800">{error}</p>
            </div>

            <button
              onClick={() => setError(null)}
              className="text-red-700 font-bold text-lg px-2"
            >
              Cerrar
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* BOTÓN ABAJO ESTILO APP */}
      <div className="w-full max-w-md mx-auto">
        <Button
          onClick={handleSubmit}
          disabled={loading}
          className="
            w-full py-6 rounded-xl text-lg mt-6
            bg-gradient-to-r from-orange-400 to-orange-500 
            text-white font-semibold shadow-md hover:shadow-lg 
            active:scale-[0.98] transition-all duration-300
          "
        >
          {loading ? "Ingresando..." : "Entrar"}
        </Button>
      </div>
    </main>
  );
}
