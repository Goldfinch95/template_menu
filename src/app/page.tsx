"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Manrope } from "next/font/google";
import { toast } from "sonner";

import { loginUser } from "@/common/utils/api";

import { Card, CardContent } from "@/common/components/ui/card";
import { Button } from "@/common/components/ui/button";
import { Input } from "@/common/components/ui/input";
import { Label } from "@/common/components/ui/label";
import { Alert, AlertDescription } from "@/common/components/ui/alert";

import { UtensilsCrossed, Eye, EyeOff, Instagram } from "lucide-react";

const manrope = Manrope({ subsets: ["latin"] });

type FormState = {
  email: string;
  password: string;
};

export default function LoginPage() {
  // ---------- Hooks ----------
  const router = useRouter();
  const params = useSearchParams();

  // ---------- Estados ----------
  // Formulario
  const [form, setForm] = useState<FormState>({ email: "", password: "" });
  // Carga
  const [loading, setLoading] = useState(false);
  // Mostrar/ocultar contraseña
  const [showPassword, setShowPassword] = useState(false);
  // Mensaje de alerta (errores de validación)
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  // Error de login
  const [error, setError] = useState<string | null>(null);
  // Parámetro de cuenta creada
  const registered = params.get("registered");
  // Ref para controlar que el toast de cuenta creada solo se muestre una vez
  const toastShown = useRef(false);

  // ---------- Toast del error ----------
  useEffect(() => {
    if (error) {
      toast.error(error, {
        duration: 2000,
        icon: null,
        className: "error-toast-center",
        style: {
          background: "#ef4444",
          color: "white",
          fontWeight: 400,
          borderRadius: "10px",
          padding: "14px 16px",
          fontSize: "16px",
        },
      });
      setError(null);
    }
  }, [error]);

  // Mostrar toasts de "Cuenta creada"
  useEffect(() => {
    let shouldCleanURL = false;

    if (registered === "true" && !toastShown.current) {
      toastShown.current = true;
      toast.success("Cuenta creada con éxito.", {
        duration: 1500,
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
      shouldCleanURL = true;
    }
    // Limpia los parámetros de la URL para evitar repetición de toasts
    if (shouldCleanURL) {
      setTimeout(() => {
        router.replace("/"); // limpia la url
      }, 50);
    }
  }, [registered, router]);

  // ---------- Validación ----------
  const validate = useCallback((values: FormState) => {
    const errs: string[] = [];
    const { email, password } = values;

    if (!email && !password) {
      errs.push("El email y la contraseña son obligatorios.");
    } else {
      if (!email) errs.push("El email es obligatorio.");
      else if (
        !/^(?!.*\.\.)[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[A-Za-z]{2,}$/.test(
          email
        )
      )
        errs.push("Ingresá un email válido.");

      if (!password) errs.push("La contraseña es obligatoria.");
      else if (password.length < 8 || password.length > 16)
        errs.push("La contraseña debe tener entre 8 y 16 caracteres.");
    }

    if (errs.length) {
      setAlertMessage(errs.join("\n"));
      return false;
    }
    setAlertMessage(null);
    return true;
  }, []);

  // ---------- Handlers ----------
  // Cambio en los inputs
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    //valores del input
    const { name, value } = e.target;
    // valores sin espacios en blanco
    const cleanValue = value.replace(/\s+/g, "");
    //cambiar el estado del formulario
    setForm((prev) => ({ ...prev, [name]: cleanValue }));
    //limpiar el mensaje de alerta
    if (alertMessage) setAlertMessage(null);
  };

  // Mostrar/ocultar contraseña
  const handleTogglePassword = () => setShowPassword((s) => !s);

  // Enviar formulario
  const handleSubmit = async () => {
    // recortar espacios en blanco
    const cleaned = {
      email: form.email.trim(),
      password: form.password.trim(),
    };
    // actualizar el estado del formulario
    setForm(cleaned);
    // validar
    if (!validate(cleaned)) return;
    // iniciar sesión
    setLoading(true);
    try {
      // llamar al API
      await loginUser(cleaned);
      // redirigir a los menús (showcase)
      router.push("/menuShowcase?loginSuccess=1");
    } catch (err) {
      // mostrar error
      setError(err instanceof Error ? err.message : "Error al iniciar sesión.");
    } finally {
      // finalizar carga
      setLoading(false);
    }
  };

  // ---------- Social Icon ----------
  const SocialIcon = ({
    href,
    children,
    ariaLabel,
    gradient,
  }: {
    href: string;
    children: React.ReactNode;
    ariaLabel: string;
    gradient?: string;
  }) => (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={ariaLabel}
      className="transform hover:scale-105 transition-transform"
    >
      <div
        className={`w-12 h-12 rounded-full flex items-center justify-center shadow-md hover:shadow-lg ${
          gradient ?? "bg-white"
        }`}
      >
        {children}
      </div>
    </a>
  );

  // ---------- Render ----------
  return (
    <main className="min-h-screen w-full flex items-center justify-center bg-gradient-to-b from-white via-[#FFF3EC] to-[#FFE6D3] px-4 py-8">
      {/* Card */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 8 }}
        transition={{ duration: 0.36, ease: "easeOut" }}
        className="w-full max-w-md"
      >
        <Card className="rounded-2xl shadow-xl border border-white/40 bg-white/85">
          <CardContent className="p-6 sm:p-7 space-y-5">
            {/* Icon */}
            <div className="flex justify-center">
              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-orange-400 to-orange-500 flex items-center justify-center shadow-md">
                <UtensilsCrossed className="w-8 h-8 text-white" />
              </div>
            </div>

            {/* Title */}
            <div className="text-center -mt-1">
              <h1
                className={`${manrope.className} text-2xl sm:text-3xl font-extrabold text-slate-900`}
              >
                Bienvenido
              </h1>
              <p className="text-slate-600 text-sm sm:text-base mt-1">
                Iniciá sesión para continuar
              </p>
            </div>

            {/* AlertMessage (errores de validación) */}
            <AnimatePresence>
              {alertMessage && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.18 }}
                >
                  <Alert className="mb-2 bg-red-50 border border-red-200 p-3 rounded-lg">
                    <AlertDescription className="whitespace-pre-line text-sm text-red-700 font-medium">
                      {alertMessage}
                    </AlertDescription>
                  </Alert>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Form */}
            <div className="space-y-4">
              <div className="space-y-1">
                <Label className="text-slate-700 text-sm font-semibold">
                  Email
                </Label>
                {/* Input email */}
                <Input
                  name="email"
                  type="email"
                  placeholder="correo@example.com"
                  value={form.email}
                  onChange={handleChange}
                  onKeyDown={(e) => {
                    if (e.key === " ") e.preventDefault(); // bloquea la barra espaciadora
                  }}
                  disabled={loading}
                  className="mt-1 rounded-lg"
                />
              </div>
              {/* Input password */}
              <div>
                <div className="flex items-center justify-between">
                  <Label className="text-slate-700 text-sm font-semibold ">
                    Contraseña
                  </Label>
                  {/* button forgot password */}
                  <Button
                    type="button"
                    onClick={() => router.push("/password")}
                    className="bg-transparent text-orange-500 font-semibold p-0"
                  >
                    ¿Olvidaste la contraseña?
                  </Button>
                </div>
                <div className="relative mt-1">
                  {/* Input password */}
                  <Input
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={form.password}
                    onChange={handleChange}
                    disabled={loading}
                    className="rounded-lg pr-10"
                  />

                  <button
                    type="button"
                    onClick={handleTogglePassword}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700"
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

            {/* Submit */}
            <div className="pt-1">
              <Button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full py-4 rounded-lg text-base bg-gradient-to-r from-orange-400 to-orange-500 text-white font-semibold shadow-sm hover:shadow-md active:scale-[0.98] transition-transform"
              >
                {loading ? "Ingresando..." : "Entrar"}
              </Button>
            </div>

            {/* Divider + Socials */}
            <div className="pt-3">
              <div className="flex items-center gap-3">
                <span className="flex-1 h-px bg-slate-200" />
                <span className="text-xs text-slate-500">Seguinos en</span>
                <span className="flex-1 h-px bg-slate-200" />
              </div>

              <div className="flex items-center justify-center gap-4 pt-3">
                <SocialIcon
                  href="https://www.instagram.com/flexitaim/?hl=es-la"
                  ariaLabel="Instagram - abrir en nueva pestaña"
                  gradient="bg-gradient-to-br from-[#F9CE34] via-[#EE2A7B] to-[#6228D7]"
                >
                  <Instagram className="w-6 h-6 text-white" />
                </SocialIcon>

                <SocialIcon
                  href="https://www.tiktok.com/@flexitaim"
                  ariaLabel="TikTok - abrir en nueva pestaña"
                  gradient="bg-black"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-6 h-6 text-white"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
                  </svg>
                </SocialIcon>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </main>
  );
}
