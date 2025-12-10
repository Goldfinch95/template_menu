"use client";

import React, { useState, useEffect, useRef, useCallback, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Manrope } from "next/font/google";
import { toast } from "sonner";

import { Card, CardContent } from "@/common/components/ui/card";
import { Button } from "@/common/components/ui/button";
import { Input } from "@/common/components/ui/input";
import { Label } from "@/common/components/ui/label";
import { Alert, AlertDescription } from "@/common/components/ui/alert";
import { resetPassword } from "@/common/utils/api";
import { Spinner } from "@/common/components/ui/spinner"; // Importar el spinner de shadcn/ui

import { UtensilsCrossed, Eye, EyeOff } from "lucide-react";

const manrope = Manrope({ subsets: ["latin"] });

const PasswordCreateContent = () => {
  const router = useRouter();
  const params = useSearchParams();

  const email = params.get("email") || "";

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [loading, setLoading] = useState(false);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const token = params.get("token") || "";
  const abortControllerRef = useRef<AbortController | null>(null);
  const [success, setSuccess] = useState(false);

  // Toast error
  useEffect(() => {
    if (error) {
      toast.error(error, {
        duration: 2000,
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

  // Validación
  const validate = useCallback(() => {
    const errs: string[] = [];

    if (!password || !confirm) {
      errs.push("Ambos campos son obligatorios.");
    } else {
      if (password.includes(" "))
        errs.push("La contraseña no puede tener espacios.");
      if (password.length < 8 || password.length > 16)
        errs.push("La contraseña debe tener entre 8 y 16 caracteres.");

      if (password !== confirm) errs.push("Las contraseñas no coinciden.");
    }

    if (errs.length) {
      setAlertMessage(errs.join("\n"));
      return false;
    }

    setAlertMessage(null);
    return true;
  }, [password, confirm]);

  // Simular delay (para demostraciones o pruebas)
  const simulateDelay = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  // Submit
  const handleSubmit = async () => {
    if (!validate()) return;

    setLoading(true);
    try {
      abortControllerRef.current = new AbortController();
      const fakeTime = Math.random() * 700 + 1500;
      await simulateDelay(fakeTime);
      await resetPassword(token, password, abortControllerRef.current.signal);

      toast.success("Contraseña actualizada con éxito.", {
        duration: 1400,
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
      setSuccess(true);
      await new Promise((resolve) => setTimeout(resolve, 100));
      router.push("/");
    } catch (err) {
      // Verificar si fue una cancelación
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

  const handleCancel = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    setLoading(false);
  };

  // -------- Si está cargando, mostrar loading card --------
  if (loading || success) {
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

  // --------- render --------
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
          <CardContent className="p-6 sm:p-7 space-y-6">
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
                Cambiar contraseña
              </h1>
              <p className="text-slate-600 text-sm sm:text-base mt-1">
                Estás actualizando la contraseña de:
              </p>
              <p className="text-orange-500 font-semibold mt-1">{email}</p>
            </div>

            {/* Alert */}
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

            {/* Inputs */}
            <div className="space-y-4">
              {/* New password */}
              <div>
                <Label className="text-slate-700 text-sm font-semibold">
                  Nueva contraseña
                </Label>
                <div className="relative mt-1">
                  <Input
                    type={showPass ? "text" : "password"}
                    value={password}
                    disabled={loading}
                    placeholder="••••••••"
                    onPaste={(e) => e.preventDefault()} // Bloquea pegar
                    onCopy={(e) => e.preventDefault()} // Bloquea copiar
                    onCut={(e) => e.preventDefault()} // Bloquea cortar
                    onChange={(e) =>
                      setPassword(e.target.value.replace(/\s+/g, ""))
                    }
                    className="rounded-lg pr-10"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700"
                  >
                    {showPass ? (
                      <Eye className="w-5 h-5" />
                    ) : (
                      <EyeOff className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Confirm password */}
              <div>
                <Label className="text-slate-700 text-sm font-semibold">
                  Confirmar contraseña
                </Label>
                <div className="relative mt-1">
                  <Input
                    type={showConfirm ? "text" : "password"}
                    value={confirm}
                    disabled={loading}
                    placeholder="••••••••"
                    onPaste={(e) => e.preventDefault()} // Bloquea pegar
                    onCopy={(e) => e.preventDefault()} // Bloquea copiar
                    onCut={(e) => e.preventDefault()} // Bloquea cortar
                    onChange={(e) =>
                      setConfirm(e.target.value.replace(/\s+/g, ""))
                    }
                    className="rounded-lg pr-10"
                  />

                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700"
                  >
                    {showConfirm ? (
                      <Eye className="w-5 h-5" />
                    ) : (
                      <EyeOff className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Submit */}
            <div className="pt-2">
              <Button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full py-4 rounded-lg text-base bg-gradient-to-r from-orange-400 to-orange-500 text-white font-semibold shadow-sm hover:shadow-md active:scale-[0.98] transition-transform"
              >
                {loading ? "Guardando..." : "Cambiar contraseña"}
              </Button>
            </div>

            {/* Back */}
            <div className="flex justify-center pt-1">
              <Button
                type="button"
                onClick={() => router.push("/")}
                className="bg-transparent text-orange-500 font-semibold p-0 shadow-none"
              >
                Volver al inicio
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
      <PasswordCreateContent />
    </Suspense>
  );
}
