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
  });

  const [loading, setLoading] = useState(false);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (alertMessage) setAlertMessage(null);
    if (error) setError(null);
  };

  // ❗ VALIDACIÓN ACUMULATIVA — Mismo estilo que login
  const validateFields = () => {
    const errors: string[] = [];

    // Nombre
    if (!form.name.trim()) {
      errors.push("• El nombre es obligatorio.");
    } else if (form.name.trim().length < 3) {
      errors.push("• El nombre debe tener al menos 3 caracteres.");
    }

    // Apellido
    if (!form.lastName.trim()) {
      errors.push("• El apellido es obligatorio.");
    } else if (form.lastName.trim().length < 3) {
      errors.push("• El apellido debe tener al menos 3 caracteres.");
    }

    // Email
    if (!form.email.trim()) {
      errors.push("• El email es obligatorio.");
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      errors.push("• Ingresá un email válido.");
    }

    // Celular → solo números + entre 10 y 13 dígitos
    if (!form.cel.trim()) {
      errors.push("• El número de celular es obligatorio.");
    } else if (!/^[0-9]{10,13}$/.test(form.cel)) {
      errors.push(
        "• Ingresá un número de celular válido (solo números, entre 10 y 13 dígitos)."
      );
    }

    // Contraseña
    if (!form.password.trim()) {
      errors.push("• La contraseña es obligatoria.");
    } else if (form.password.length < 8) {
      errors.push("• La contraseña debe tener al menos 8 caracteres.");
    } else if (!/^[a-z0-9_-]+$/.test(form.password)) {
      errors.push(
        "• La contraseña solo puede contener minúsculas, números y guiones (sin espacios)."
      );
    }

    // Mostrar errores acumulados
    if (errors.length > 0) {
      setAlertMessage(errors.join("\n"));
      return false;
    }

    setAlertMessage(null);
    return true;
  };

  const handleSubmit = async () => {
  if (!validateFields()) return;

  setLoading(true);
  setAlertMessage(null);
  setError(null);

  try {
    const res = await registerUser({
      name: form.name,
      lastName: form.lastName,
      email: form.email,
      cel: form.cel,
      roleId: 2,
      password: form.password,
      subdomain: form.password,
    });

    const data = await res.json();

    // ✔ Detectar email en uso
    if (res.status === 409 || data.statusCode === 409) {
      setError("• Este email ya está en uso.");
      return;
    }

    if (!res.ok) {
      setError("• Ocurrió un error al crear la cuenta.");
      return;
    }

    router.push("/login");
  } catch (err: any) {
    setError(err.message || "Error al conectar con el servidor.");
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

          <h1
            className={`${manrope.className} text-3xl font-extrabold text-center text-slate-900`}
          >
            Crear cuenta
          </h1>
          <p className="text-center text-base text-slate-600 mt-1 mb-8">
            Completá tus datos para comenzar
          </p>

          {/* MINI CARD */}
          <div
            className="
              w-full max-w-md p-6 rounded-2xl shadow-lg
              bg-white/70 backdrop-blur-md border border-white/40
              space-y-5
            "
          >
            {/* ALERTA */}
            <AnimatePresence>
              {alertMessage && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  transition={{ duration: 0.25 }}
                >
                  <Alert className="bg-red-100 border border-red-300 text-red-800 rounded-lg p-4 flex gap-3">
                    <X className="!w-6 !h-6 self-center" />
                    <AlertDescription className="whitespace-pre-line mt-1">
                      {alertMessage}
                    </AlertDescription>
                  </Alert>
                </motion.div>
              )}
            </AnimatePresence>

            {/* NOMBRE */}
            <div>
              <Label className="text-slate-700">Nombre</Label>
              <Input
                name="name"
                placeholder="Tu nombre"
                className="
                  mt-2 bg-white/85 border-slate-300 
                  focus:!border-orange-500 focus:!ring-orange-500
                  transition-all duration-200
                "
                value={form.name}
                onChange={handleChange}
              />
            </div>

            {/* APELLIDO */}
            <div>
              <Label className="text-slate-700">Apellido</Label>
              <Input
                name="lastName"
                placeholder="Tu apellido"
                className="
                  mt-2 bg-white/85 border-slate-300 
                  focus:!border-orange-500 focus:!ring-orange-500
                  transition-all duration-200
                "
                value={form.lastName}
                onChange={handleChange}
              />
            </div>

            {/* EMAIL */}
            <div>
              <Label className="text-slate-700">Email</Label>
              <Input
                name="email"
                type="email"
                placeholder="correo@example.com"
                className="
                  mt-2 bg-white/85 border-slate-300 
                  focus:!border-orange-500 focus:!ring-orange-500
                  transition-all duration-200
                "
                value={form.email}
                onChange={handleChange}
              />
            </div>

            {/* CELULAR */}
            <div>
              <Label className="text-slate-700">Celular</Label>
              <Input
                name="cel"
                placeholder="+54 9 ..."
                className="
                  mt-2 bg-white/85 border-slate-300 
                  focus:!border-orange-500 focus:!ring-orange-500
                  transition-all duration-200
                "
                value={form.cel}
                onChange={handleChange}
              />
            </div>

            {/* PASSWORD */}
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

      {/* ERROR GLOBAL ABAJO (igual login) */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="
              fixed bottom-40 left-1/2 -translate-x-1/2
              w-[90%] max-w-md 
              bg-red-100 border border-red-300 text-red-900
              px-5 py-4 rounded-2xl shadow-lg
              flex items-center gap-4
            "
          >
            <X className="w-7 h-7 text-red-700" strokeWidth={2.5} />
            <div className="flex-1">
              <p className="text-sm">{error}</p>
            </div>

            <button
              className="text-red-700 font-bold text-lg px-2"
              onClick={() => setError(null)}
            >
              Cerrar
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* BOTÓN ABAJO */}
      <div className="w-full max-w-md mx-auto mb-4">
        <Button
          onClick={handleSubmit}
          disabled={loading}
          className="
            w-full py-4 rounded-xl text-lg
            bg-gradient-to-r from-orange-400 to-orange-500
            text-white font-semibold shadow-md hover:shadow-lg
            active:scale-[0.98] transition-all duration-300
          "
        >
          {loading ? "Creando cuenta..." : "Registrarme"}
        </Button>

        <p className="text-center text-sm text-slate-600 mt-4">
          ¿Ya tenés cuenta?
          <button
            onClick={() => router.push("/login")}
            className="text-orange-500 font-medium ml-1 hover:underline"
          >
            Iniciar sesión
          </button>
        </p>
      </div>
    </main>
  );
}
