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
import { useSearchParams } from "next/navigation";

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

  //mensaje exitoso
  const [showSuccess, setShowSuccess] = useState(false);

  //RUTA
  const router = useRouter();

  const searchParams = useSearchParams();

  React.useEffect(() => {
    if (searchParams.get("registered") === "1") {
      setShowSuccess(true);

      const timer = setTimeout(() => {
        setShowSuccess(false);
      }, 4000);

      return () => clearTimeout(timer);
    }
  }, [searchParams]);

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

    const { email, password } = values;

    // Validación: ambos vacíos
    if (!email && !password) {
      errors.push("• El email y la contraseña son obligatorios.");
    } else {
      // Validación email
      if (!email) {
        errors.push("• El email es obligatorio.");
      } else if (
        !/^(?!.*\.\.)[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[A-Za-z]{2,}$/.test(
          email
        )
      ) {
        errors.push("• Ingresá un email válido.");
      }

      // Validación contraseña
      if (!password) {
        errors.push("• La contraseña es obligatoria.");
      } else if (password.length < 8 || password.length > 16) {
        errors.push("• La contraseña debe tener entre 8 y 16 caracteres.");
      }
    }

    // Mostrar errores
    if (errors.length > 0) {
      setAlertMessage(errors.join("\n"));
      return false;
    }

    // Sin errores
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
      router.push("/menuShowcase?loginSuccess=1");
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
      className=" relative
        min-h-screen w-full flex flex-col justify-center
        bg-gradient-to-b from-white via-[#FFF3EC] to-[#FFE6D3]
        px-6 py-8
      "
    >
      {/* cartel de registro exitoso animado */}
      <AnimatePresence>
              {showSuccess && (
                <motion.div
                  initial={{ opacity: 0, y: -20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -20, scale: 0.95 }}
                  transition={{ duration: 0.35, ease: "easeOut" }}
                  className="
              fixed top-4 left-1/2 -translate-x-1/2 
              px-4 py-3 rounded-2xl
              bg-white/80 backdrop-blur-xl
              shadow-[0_4px_16px_rgba(0,0,0,0.12)]
              border border-white/40
              flex items-center gap-3 z-[999]
              w-[90%] max-w-sm
            "
                >
                  <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center shadow-md">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
      
                  <div className="flex flex-col">
                    <p className="text-sm font-semibold text-slate-900">
                      Cuenta creada con éxito. Ya podés iniciar sesión.
                    </p>
                    <p className="text-xs text-slate-600">Bienvenido nuevamente</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
      {/* CARD PRINCIPAL */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="
          w-full max-w-md mx-auto 
          bg-white/85 backdrop-blur-xl
          rounded-3xl p-7 shadow-xl 
          border border-white/40
          space-y-6
        "
      >
        {/* ICONO */}
        <div className="flex justify-center">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-400 to-orange-500 shadow-md flex items-center justify-center">
            <UtensilsCrossed className="w-9 h-9 text-white" />
          </div>
        </div>

        {/* TITULO */}
        <div className="text-center -mt-1">
          <h1
            className={`${manrope.className} text-3xl font-extrabold text-slate-900`}
          >
            Bienvenido
          </h1>
          <p className="text-slate-600 text-base mt-1">
            Iniciá sesión para continuar
          </p>
        </div>

        {/* GOOGLE */}
        <Button
          variant="outline"
          disabled={loading}
          className="
            w-full flex items-center justify-center gap-3 h-11 rounded-xl text-base
            border-slate-300 text-gray-700 bg-white
            hover:bg-orange-50
            active:border-orange-400 focus:border-orange-400
            backdrop-blur-sm shadow-sm hover:shadow-md
            active:scale-[0.97] transition-all
          "
        >
          <img
            src="https://www.svgrepo.com/show/475656/google-color.svg"
            className="w-5 h-5"
          />
          Continuar con Google
        </Button>

        {/* DIVIDER */}
        <div className="flex items-center pt-2">
          <span className="flex-1 h-px bg-gray-300"></span>
          <span className="px-3 text-sm text-gray-500">o</span>
          <span className="flex-1 h-px bg-gray-300"></span>
        </div>

        {/* ALERTA MOVIDA AL LUGAR CORRECTO */}
        <AnimatePresence>
          {alertMessage && (
            <Alert className="mb-4 bg-red-100 border border-red-400 text-red-700 p-4 rounded-xl flex items-start gap-3">
              <X className="w-5 h-5 mt-1" />
              <div>
                <AlertDescription className="whitespace-pre-line mt-1">
                  {alertMessage}
                </AlertDescription>
              </div>
            </Alert>
          )}
        </AnimatePresence>

        {/* CAMPOS */}
        <div className="space-y-5">
          {/* EMAIL */}
          <div className="space-y-2">
            <Label className="text-slate-700 font-semibold text-base">
              Email
            </Label>
            <Input
              name="email"
              type="email"
              placeholder="correo@example.com"
              className="
                bg-white border-slate-300 shadow-sm text-base
                focus-visible:border-orange-400
                focus-visible:ring-2 focus-visible:ring-orange-200/70
                rounded-xl transition-all duration-200
              "
              value={form.email}
              onChange={handleChange}
              disabled={loading}
            />
          </div>

          {/* CONTRASEÑA */}
          <div className="space-y-2">
            <Label className="text-slate-700 font-semibold text-base">
              Contraseña
            </Label>
            <div className="relative">
              <Input
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                className="
                  bg-white border-slate-300 shadow-sm text-base
                  focus-visible:border-orange-400
                  focus-visible:ring-2 focus-visible:ring-orange-200/70
                  rounded-xl transition-all duration-200
                  pr-12
                "
                value={form.password}
                onChange={handleChange}
                disabled={loading}
              />

              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="
                  absolute right-3 top-1/2 -translate-y-1/2
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
          </div>
        </div>

        {/* BOTÓN ENTRAR AHORA DENTRO DEL CARD */}
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
      </motion.div>

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
              w-[89%] max-w-md 
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
