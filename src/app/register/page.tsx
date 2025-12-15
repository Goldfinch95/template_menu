"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/common/components/ui/button";
import { X, ArrowLeft } from "lucide-react";
import { Alert, AlertDescription } from "@/common/components/ui/alert";
import { Input } from "@/common/components/ui/input";
import { Label } from "@/common/components/ui/label";
import { AnimatePresence, motion } from "framer-motion";
import { Manrope } from "next/font/google";
import { authService } from "@/app/services";
import { UtensilsCrossed } from "lucide-react";
import { toast } from "sonner";

const manrope = Manrope({ subsets: ["latin"] });

export default function RegisterPage() {
  // ---------- hooks ----------
  const router = useRouter();

  // ---------- Estados ----------
  // Cargando
  const [loading, setLoading] = useState(false);
  // Mensaje de alerta
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  // Error global
  const [error, setError] = useState<string | null>(null);
  // Datos del formulario
  const [form, setForm] = useState({
    name: "",
    lastName: "",
    email: "",
    cel: "",
    password: "",
  });

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

  // Capitaliza la primera letra y pone el resto en minúsculas
  const capitalize = (str: string): string => {
    const trimmed = str.trim();
    if (!trimmed) return "";
    return trimmed.charAt(0).toUpperCase() + trimmed.slice(1).toLowerCase();
  };

  // ---------- Validación ----------
  const validateFields = () => {
    const errors: string[] = [];

    // Capitalizar nombre y apellido
    form.name = capitalize(form.name);
    form.lastName = capitalize(form.lastName);

    // Regex: solo letras (incluye acentos) y espacios
    const nameRegex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ ]+$/;

    if (!form.name.trim()) {
      errors.push("El nombre es obligatorio.");
    } else if (form.name.trim().length < 3) {
      errors.push("El nombre debe tener al menos 3 caracteres.");
    } else if (!nameRegex.test(form.name.trim())) {
      errors.push("El nombre solo puede contener letras y espacios.");
    }

    if (!form.lastName.trim()) {
      errors.push("El apellido es obligatorio.");
    } else if (form.lastName.trim().length < 3) {
      errors.push("El apellido debe tener al menos 3 caracteres.");
    } else if (!nameRegex.test(form.lastName.trim())) {
      errors.push("El apellido solo puede contener letras y espacios.");
    }

    if (!form.email.trim()) {
      errors.push("El email es obligatorio.");
    } else if (
      !/^(?!.*\.\.)[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[A-Za-z]{2,}$/.test(
        form.email
      )
    ) {
      errors.push("Ingresá un email válido.");
    }

    if (form.cel.trim() && !/^[0-9]{10,13}$/.test(form.cel)) {
      errors.push(
        "Ingresá un número de celular válido (solo números, entre 10 y 13 dígitos)."
      );
    }

    if (errors.length > 0) {
      setAlertMessage(errors.join("\n"));
      return false;
    }

    setAlertMessage(null);
    return true;
  };

  // ---------- handlers ----------
  // Cambio en los inputs
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (alertMessage) setAlertMessage(null);
    if (error) setError(null);
  };
  // Envío del formulario
  const handleSubmit = async () => {
    // Validar campos
    if (!validateFields()) return;

    setLoading(true);
    setAlertMessage(null);
    setError(null);

    try {
      // Registrar usuario
      await authService.register({
        name: form.name.trim(),
        lastName: form.lastName.trim(),
        email: form.email.trim(),
        cel: form.cel.trim(),
        roleId: 2,
      });
      // Redirigir al login con parámetro de cuenta creada
      router.push("/?registered=true");
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? "Este email ya está en uso."
          : "Error al registrar usuario. Intentá de nuevo."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen w-full flex flex-col justify-center bg-gradient-to-b from-white via-[#FFF3EC] to-[#FFE6D3] px-6 py-8">
      <motion.div
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md mx-auto bg-white/85 backdrop-blur-xl rounded-3xl p-7 shadow-xl border border-white/40 space-y-6"
      >
        {/* Botón de retroceso */}
        <Button
          onClick={() => router.push("/menuShowcase")}
          className="absolute left-5 top-5 p-2 rounded-full bg-orange-500 text-white shadow-md hover:bg-orange-600 active:scale-95 transition-all"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>

        <div className="flex justify-center">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-400 to-orange-500 shadow-md flex items-center justify-center">
            <UtensilsCrossed className="w-9 h-9 text-white" />
          </div>
        </div>

        <div className="text-center -mt-1">
          <h1
            className={`${manrope.className} text-3xl font-extrabold text-slate-900`}
          >
            Crear cuenta
          </h1>
          <p className="text-slate-600 text-base mt-1">
            Completá tus datos para comenzar
          </p>
        </div>

        {/* ALERTA */}
        <AnimatePresence>
          {alertMessage && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
            >
              <Alert className="mb-2 bg-red-50 border border-red-200 p-3 rounded-lg flex items-start gap-3">
                <div>
                  <AlertDescription className="whitespace-pre-line text-sm text-red-700 font-medium">
                    {alertMessage}
                  </AlertDescription>
                </div>
              </Alert>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Formulario */}
        <div className="space-y-5">
          {/* Nombre */}
          <div className="space-y-2">
            <Label className="text-slate-700 font-semibold text-base">
              Nombre
            </Label>
            <Input
              name="name"
              placeholder="nombre"
              className=""
              onKeyDown={(e) => {
                if (e.key === " ") e.preventDefault(); // bloquea la barra espaciadora
              }}
              value={form.name}
              onChange={handleChange}
            />
          </div>

          {/* Apellido */}
          <div className="space-y-2">
            <Label className="text-slate-700 font-semibold text-base">
              Apellido
            </Label>
            <Input
              name="lastName"
              placeholder="apellido"
              className=""
              onKeyDown={(e) => {
                if (e.key === " ") e.preventDefault(); // bloquea la barra espaciadora
              }}
              value={form.lastName}
              onChange={handleChange}
            />
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label className="text-slate-700 font-semibold text-base">
              Email
            </Label>
            <Input
              name="email"
              type="email"
              placeholder="correo@example.com"
              className=""
              onKeyDown={(e) => {
                if (e.key === " ") e.preventDefault(); // bloquea la barra espaciadora
              }}
              value={form.email}
              onChange={handleChange}
            />
          </div>

          {/* Celular */}
          <div className="space-y-2">
            <Label className="text-slate-700 font-semibold text-base">
              Celular
            </Label>
            <Input
              name="cel"
              placeholder="número de celular"
              className=""
              onKeyDown={(e) => {
                if (e.key === " ") e.preventDefault(); // bloquea la barra espaciadora
              }}
              value={form.cel}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Botón de envío */}
        <Button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full py-5 rounded-xl text-lg bg-gradient-to-r from-orange-400 to-orange-500 text-white font-semibold shadow-md hover:shadow-lg active:scale-[0.97] transition-all"
        >
          {loading ? "Creando cuenta..." : "Registrarme"}
        </Button>
      </motion.div>

      {/* Error global */}
      <AnimatePresence>
        {error && (
          <motion.div
            layout
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            transition={{ duration: 0.35 }}
            className="w-full max-w-md mx-auto mt-6 bg-red-100 border border-red-300 text-red-900 px-5 py-4 rounded-2xl shadow-lg flex items-center gap-4"
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
