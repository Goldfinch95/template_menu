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
  //ESTADOS
  //formulario
  const [form, setForm] = useState({ email: "", password: "" });
  //carga
  const [loading, setLoading] = useState(false);
  //errores
  const [error, setError] = useState<string | null>(null);
  //alertas
  const [alertMessage, setAlertMessage] = useState<string | null>(null);

  //RUTA
  const router = useRouter();

  //CREACION DE FORMULARIO
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (error) setError(null);
  };

  const [showPassword, setShowPassword] = useState(false);

  // VALIDACION DE DATOS DE FORMULARIO
  const validateFields = (
    values: { email: string; password: string } = form
  ) => {
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

    // Mostrar errores
    if (errors.length > 0) {
      setAlertMessage(errors.join("\n"));
      return false;
    }

    // Sin errores → limpiar alerta
    setAlertMessage(null);
    return true;
  };

  // ENVIAR DATOS A LA BD
  const handleSubmit = async () => {
    //limpiar el formulario antes de enviar,controlar espacios inicio y final
    const cleanedForm = {
      email: form.email.trim(),
      password: form.password.trim(),
    };
    setForm(cleanedForm);
    //control de formulario,si es invalido retorno.
    if (!validateFields(cleanedForm)) return;
    setLoading(true);

    try {
      //enviar datos a la BD
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

  //-----LOGIN-------//
  return (
    <main
      className="
        h-screen w-full flex flex-col justify-center
        bg-gradient-to-b from-white via-[#FFF3EC] to-[#FFE6D3]
        px-6 py-6
      "
    >
      {/* CARD PRINCIPAL COMPACTO */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="
          w-full max-w-md mx-auto 
          bg-white/80 backdrop-blur-xl
          rounded-3xl p-6 shadow-xl 
          border border-white/50
          space-y-5
        "
      >
        {/* Ícono */}
        <div className="flex justify-center">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-400 to-orange-500 shadow-md flex items-center justify-center">
            <UtensilsCrossed className="w-9 h-9 text-white" />
          </div>
        </div>

        {/* Título */}
        <div className="text-center -mt-1">
          <h1
            className={`${manrope.className} text-2xl font-extrabold text-slate-900`}
          >
            Bienvenido
          </h1>
          <p className="text-slate-600 text-sm mt-1">
            Iniciá sesión para continuar
          </p>
        </div>

        {/* ALERTA */}
        <AnimatePresence>
          {alertMessage && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.25 }}
            >
              <Alert className="flex bg-red-50 border border-red-300 text-red-800 rounded-xl px-3 py-3 shadow-sm">
                <div className="flex gap-2">
                  <div className="flex items-center">
                    <X className="!w-6.5 !h-6.5" />
                  </div>
                  <AlertDescription className="text-sm whitespace-pre-line space-y-2">
                    {alertMessage}
                  </AlertDescription>
                </div>
              </Alert>
            </motion.div>
          )}
        </AnimatePresence>
        {/* Google Button */}
        <Button
          variant="outline"
          disabled={loading}
          className=" w-full flex items-center justify-center gap-3 h-11 rounded-xl text-base
    border-slate-300 text-gray-700 bg-white

    hover:bg-orange-50 hover:border-orange-400  /* solo desktop */
    active:border-orange-400                    /* mobile */
    focus:border-orange-400                     /* mobile */

    backdrop-blur-sm shadow-sm hover:shadow-md
    active:scale-[0.97] transition-all
          "
        >
          <img
            src="https://www.svgrepo.com/show/475656/google-color.svg"
            alt="Google Icon"
            className="w-5 h-5"
          />
          Continuar con Google
        </Button>
        {/* Divider */}
        <div className="flex items-center my-6">
          <span className="flex-1 h-px bg-gray-300"></span>
          <span className="px-3 text-sm text-gray-500">o</span>
          <span className="flex-1 h-px bg-gray-300"></span>
        </div>

        {/* EMAIL */}
        <div className="space-y-1">
          <Label className="text-slate-700 font-semibold">Email</Label>
          <Input
            name="email"
            type="email"
            placeholder="correo@example.com"
            className="
               bg-white
    border-slate-300 shadow-sm

    focus-visible:border-orange-400
    focus-visible:ring-2 focus-visible:ring-orange-200/70

    rounded-xl
    transition-all duration-200
            "
            value={form.email}
            onChange={handleChange}
            disabled={loading}
          />
        </div>

        {/* PASSWORD */}
        <div className="space-y-1 relative">
          <Label className="text-slate-700 font-semibold">Contraseña</Label>

          <Input
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            className="
               bg-white
    border-slate-300 shadow-sm

    focus-visible:border-orange-400
    focus-visible:ring-2 focus-visible:ring-orange-200/70

    rounded-xl
    transition-all duration-200
            "
            value={form.password}
            onChange={handleChange}
            disabled={loading}
          />

          <button
            type="button"
            onClick={() => setShowPassword((prev: any) => !prev)}
            className="
              absolute right-3 bottom-[10px] 
              text-slate-500 hover:text-slate-700
            "
          >
            {showPassword ? (
              <Eye className="w-5 h-5" />
            ) : (
              <EyeOff className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* GOOGLE BUTTON */}
        <Button
          variant="outline"
          className="
            w-full py-3 rounded-xl text-base 
            bg-white/90 backdrop-blur-sm
            border border-slate-300 text-slate-700
            font-medium shadow-sm hover:shadow-md
            active:scale-[0.97] transition-all
            flex items-center gap-3 justify-center
          "
          disabled={loading}
        >
          <img
            src="https://www.svgrepo.com/show/475656/google-color.svg"
            alt="Google Icon"
            className="w-5 h-5"
          />
          Continuar con Google
        </Button>
      </motion.div>

      {/* BOTÓN ENTRAR */}
      <div className="w-full max-w-md mx-auto mt-4">
        <Button
          onClick={handleSubmit}
          disabled={loading}
          className="
            w-full py-5 rounded-xl text-lg
            bg-gradient-to-r from-orange-400 to-orange-500 
            text-white font-semibold shadow-md hover:shadow-lg 
            active:scale-[0.97] transition-all
          "
        >
          {loading ? "Ingresando..." : "Entrar"}
        </Button>
      </div>

      {/* ERROR FLOTANTE */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ duration: 0.35 }}
            className="
              fixed bottom-24 left-1/2 -translate-x-1/2 
              w-[90%] max-w-md 
              bg-red-100 border border-red-300 text-red-900
              px-5 py-4 rounded-2xl shadow-lg
              flex items-center gap-4
            "
          >
            <X className="w-7 h-7 text-red-700" />
            <p className="flex-1 text-sm">{error}</p>
            <button
              onClick={() => setError(null)}
              className="text-red-700 font-bold px-2"
            >
              Cerrar
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
