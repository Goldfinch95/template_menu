"use client";

import React, { useState, useEffect, useCallback, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Manrope } from "next/font/google";
import { toast } from "sonner";

import { authService  } from "@/app/services";

import { Alert, AlertDescription } from "@/common/components/ui/alert";
import { Button } from "@/common/components/ui/button";
import { Card, CardContent } from "@/common/components/ui/card";
import { Label } from "@/common/components/ui/label";
import { Input } from "@/common/components/ui/input";
import { Spinner } from "@/common/components/ui/spinner";

import { UtensilsCrossed, Eye, EyeOff, Instagram } from "lucide-react";

const manrope = Manrope({ subsets: ["latin"] });

type FormState = {
  email: string;
  password: string;
};

function Login() {
  const router = useRouter();
  const params = useSearchParams();

  const [form, setForm] = useState<FormState>({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const registered = params.get("registered");
  const toastShown = useRef(false);

  // ---------------- CANCEL BUTTON ----------------
  const [showCancel, setShowCancel] = useState(false);

  useEffect(() => {
    if (loading) {
      const timer = setTimeout(() => setShowCancel(true), 2500);
      return () => clearTimeout(timer);
    } else {
      setShowCancel(false);
    }
  }, [loading]);

  const handleCancel = () => {
    setLoading(false);
    setShowCancel(false);
    toast.error("Operación cancelada.", {
      icon: null,
      className: "cancel-toast-center",
      style: {
        background: "#f97316", // naranja (podés poner cualquier color)
        color: "white",
        fontWeight: 500,
        borderRadius: "12px",
        padding: "14px 16px",
        fontSize: "16px",
      },
    });
  };
  // -------------------------------------------------

  // Toast de error
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

    if (shouldCleanURL) {
      setTimeout(() => {
        router.replace("/");
      }, 50);
    }
  }, [registered, router]);

  const validate = useCallback((values: FormState) => {
    const errs: string[] = [];
    const { email, password } = values;

    if (!email && !password) {
      errs.push("El Email y la Contraseña son obligatorios.");
    } else {
      if (!email) errs.push("El Email es obligatorio.");
      else if (
        !/^(?!.*\.\.)[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[A-Za-z]{2,}$/.test(
          email
        )
      )
        errs.push("Ingresá un Email válido.");

      if (!password) errs.push("La Contraseña es obligatoria.");
      else if (password.length < 8 || password.length > 16)
        errs.push("La Contraseña debe tener entre 8 y 16 caracteres.");
    }

    if (errs.length) {
      setAlertMessage(errs.join("\n"));
      return false;
    }
    setAlertMessage(null);
    return true;
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const cleanValue = value.replace(/\s+/g, "");

    setForm((prev) => ({ ...prev, [name]: cleanValue }));

    if (alertMessage) setAlertMessage(null);
  };

  const handleTogglePassword = () => setShowPassword((s) => !s);

  const simulateDelay = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  const handleSubmit = async () => {
    if (loading) return; // evita dobles submits

    const cleaned = {
      email: form.email.trim(),
      password: form.password.trim(),
    };

    if (!validate(cleaned)) return;

    setLoading(true);

    try {
      const fakeTime = Math.random() * 700 + 1500;
      await simulateDelay(fakeTime);
      await authService.login(cleaned);

      router.push("/menuShowcase?loginSuccess=1");
    } catch (err) {
      let message = "Error al iniciar sesión.";

      if (err instanceof Error) {
        if (err.message.includes("Failed to fetch")) {
          message =
            "No pudimos conectar con el servidor. Por favor intentá nuevamente.";
        } else {
          message = err.message;
        }
      }

      setError(message);
      setLoading(false);
    }
  };

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

  return (
    <main className="min-h-screen w-full flex items-center justify-center bg-gradient-to-b from-white via-[#FFF3EC] to-[#FFE6D3] px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 8 }}
        transition={{ duration: 0.36, ease: "easeOut" }}
        className="w-full max-w-md"
      >
        <Card className="rounded-2xl shadow-xl border border-white/40 bg-white/85">
          <CardContent className="p-6 sm:p-7 space-y-5">
            {loading ? (
              <div className="h-full flex flex-col items-center justify-center text-center">
                <div className="flex flex-col items-center gap-8 w-full">
                  {/* Spinner con glow */}
                  <div className="relative">
                    <div className="absolute inset-0 w-14 h-14 bg-orange-200/30 rounded-full blur-xl animate-pulse"></div>
                    <Spinner className="relative h-9 w-9 text-orange-500" />
                  </div>
                  {/* Título + barra de progreso */}
                  <div className="w-full max-w-xs space-y-4">
                    <h2 className="text-2xl font-extrabold text-slate-800 tracking-tight">
                      Procesando tu solicitud
                    </h2>
                    {/* Barra de progreso */}
                    <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden shadow-inner">
                      <div className="h-full bg-gradient-to-r from-orange-500 to-orange-600 rounded-full animate-[loading_2s_ease-in-out_infinite]"></div>
                    </div>
                  </div>
                  {/* Descripción */}
                  <p className="text-base text-slate-600 leading-relaxed max-w-xs">
                    Por favor esperá mientras completamos el proceso. No cierres
                    ni actualices la página.
                  </p>
                </div>

                {/* Botón Cancelar bien separado */}
                {showCancel && (
                  <Button
                    variant="outline"
                    onClick={handleCancel}
                    className="text-sm font-medium text-slate-700 hover:text-slate-900 mt-10"
                  >
                    Cancelar
                  </Button>
                )}
              </div>
            ) : (
              <>
                <div className="flex justify-center">
                  <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-orange-400 to-orange-500 flex items-center justify-center shadow-md">
                    <UtensilsCrossed className="w-8 h-8 text-white" />
                  </div>
                </div>

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

                <AnimatePresence>
                  {alertMessage && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.18 }}
                    >
                      <Alert
                        variant="destructive"
                        className="mb-2 bg-red-50 border border-red-200 p-3 rounded-lg"
                      >
                        <AlertDescription className="whitespace-pre-line text-sm">
                          {alertMessage}
                        </AlertDescription>
                      </Alert>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="space-y-4">
                  <div className="space-y-1">
                    <Label className="text-slate-700 text-sm font-semibold">
                      Email
                    </Label>

                    <Input
                      name="email"
                      type="email"
                      placeholder="correo@example.com"
                      value={form.email}
                      onPaste={(e) => e.preventDefault()} // Bloquea pegar
                      onCopy={(e) => e.preventDefault()} // Bloquea copiar
                      onCut={(e) => e.preventDefault()} // Bloquea cortar
                      onChange={handleChange}
                      onKeyDown={(e) => {
                        if (e.key === " ") e.preventDefault();
                      }}
                      disabled={loading}
                      className="mt-1 rounded-lg 
    focus-visible:ring-1
    focus-visible:ring-orange-400
    focus-visible:border-orange-400"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between">
                      <Label className="text-slate-700 text-sm font-semibold">
                        Contraseña
                      </Label>

                      <Button
                        type="button"
                        onClick={() => router.push("/password")}
                        className="bg-transparent text-orange-500 font-semibold p-0"
                      >
                        ¿Olvidaste la Contraseña?
                      </Button>
                    </div>

                    <div className="relative mt-1">
                      <Input
                        name="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={form.password}
                        onChange={handleChange}
                        disabled={loading}
                        className="rounded-lg pr-10 focus-visible:ring-1
    focus-visible:ring-orange-400
    focus-visible:border-orange-400"
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

                <div className="pt-1">
                  <Button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="w-full py-4 rounded-lg text-base bg-gradient-to-r from-orange-400 to-orange-500 text-white font-semibold shadow-sm hover:shadow-md active:scale-[0.98] transition-transform"
                  >
                    Entrar
                  </Button>
                </div>

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
              </>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen w-full bg-gradient-to-b from-white via-[#FFF3EC] to-[#FFE6D3] flex items-center justify-center">
          <p className="text-lg text-gray-600">Cargando...</p>
        </div>
      }
    >
      <Login/>
    </Suspense>
  );
}