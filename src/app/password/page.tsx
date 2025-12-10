"use client";

import React, { useState, useCallback, useEffect, useRef, Suspense } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Manrope } from "next/font/google";
import { toast } from "sonner";

import { Card, CardContent } from "@/common/components/ui/card";
import { Button } from "@/common/components/ui/button";
import { Input } from "@/common/components/ui/input";
import { Label } from "@/common/components/ui/label";
import { Alert, AlertDescription } from "@/common/components/ui/alert";
import { UtensilsCrossed } from "lucide-react";
import { forgotPassword } from "@/common/utils/api";
import { Spinner } from "@/common/components/ui/spinner"; // Importar el spinner de shadcn/ui

const manrope = Manrope({ subsets: ["latin"] });

const PasswordRecoverContent = () => {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // -------- Toast de error --------
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

  // -------- Validación --------
  const validate = useCallback(() => {
    if (!email) {
      setAlertMessage("El email es obligatorio.");
      return false;
    }
    if (
      !/^(?!.*\.\.)[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[A-Za-z]{2,}$/.test(email)
    ) {
      setAlertMessage("Ingresá un email válido.");
      return false;
    }
    setAlertMessage(null);
    return true;
  }, [email]);

  // Simular delay (para demostraciones o pruebas)
  const simulateDelay = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  // -------- Enviar formulario --------
  const handleSubmit = async () => {
    const cleanedEmail = email.trim();

    if (!validate()) return;

    setLoading(true);
    try {
      abortControllerRef.current = new AbortController();
      const fakeTime = Math.random() * 700 + 1500;
      await simulateDelay(fakeTime);
      await forgotPassword(cleanedEmail, abortControllerRef.current.signal);

      toast.success(`Se envió el email a  "${cleanedEmail}"`, {
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

      router.push("/");
    } catch (err) {
      if (err instanceof Error && err.message === "ABORTED") {
  toast.info("Solicitud cancelada", {
    duration: 1500,
    icon: null,
    style: {
      background: "#f97316",
      color: "white",
      fontWeight: 400,
      borderRadius: "10px",
      padding: "14px 16px",
      fontSize: "16px",
    },
  });
  return;
}

      setError(
        err instanceof Error ? err.message : "Error al enviar el correo."
      );
    } finally {
      setLoading(false);
    }
  };

  // -------- Cancelar solicitud --------
  const handleCancel = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    setLoading(false);
  };

  // -------- Si está cargando, mostrar loading card --------
  if (loading) {
    return (
      <main className="min-h-screen w-full flex items-center justify-center bg-gradient-to-b from-white via-[#FFF3EC] to-[#FFE6D3] px-4 py-8">
        <Card className="rounded-2xl shadow-xl border border-white/40 bg-white/85 w-full max-w-md">
          <CardContent className="p-10">
            <div className="h-full flex flex-col items-center justify-center text-center">
              <div className="flex flex-col items-center gap-8 w-full">
                {/* Spinner glow */}
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
                <Button variant="outline" onClick={handleCancel}>
                  Cancelar
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    );
  }

  // -------- render --------
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
                Recuperar contraseña
              </h1>
              <p className="text-slate-600 text-sm sm:text-base mt-1">
                Ingresá tu email para recibir un enlace de recuperación
              </p>
            </div>

            {/* AlertMessage */}
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

            {/* Input */}
            <div className="space-y-1">
              <Label className="text-slate-700 text-sm font-semibold">
                Email
              </Label>

              <Input
                name="email"
                type="email"
                placeholder="correo@example.com"
                value={email}
                disabled={loading}
                onChange={(e) => {
                  const cleanValue = e.target.value.replace(/\s+/g, "");
                  setEmail(cleanValue);
                  if (alertMessage) setAlertMessage(null);
                }}
                onKeyDown={(e) => {
                  if (e.key === " ") e.preventDefault();
                }}
                className="mt-1 rounded-lg"
              />
            </div>

            {/* Submit */}
            <div className="pt-1">
              <Button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full py-4 rounded-lg text-base bg-gradient-to-r from-orange-400 to-orange-500 text-white font-semibold shadow-sm hover:shadow-md"
              >
                {loading ? "Enviando..." : "Enviar correo"}
              </Button>
            </div>

            {/* Back to login */}
            <div className="flex justify-center pt-2">
              <Button
                type="button"
                onClick={() => router.push("/")}
                className="bg-transparent text-orange-500 font-semibold p-0 shadow-none"
              >
                Volver al inicio de sesión
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </main>
  );
};

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen w-full bg-gradient-to-b from-white via-[#FFF3EC] to-[#FFE6D3] flex items-center justify-center">
          <p className="text-lg text-gray-600">Cargando...</p>
        </div>
      }
    >
      <PasswordRecoverContent />
    </Suspense>
  );
}
