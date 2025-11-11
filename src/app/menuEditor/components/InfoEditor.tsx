"use client";

import React, { useState, useEffect } from "react";
import { Card } from "@/common/components/ui/card";
import { Label } from "@radix-ui/react-label";
import { Input } from "@/common/components/ui/input";
import { motion } from "framer-motion";

interface InfoEditorProps {
  title: string;
  pos: string;
  onInfoSubmit?: (info: { title: string; pos: string }) => void;
}

const InfoEditor = ({ title, pos, onInfoSubmit }: InfoEditorProps) => {
  // Estados locales para los inputs
  const [inputTitle, setInputTitle] = useState("");
  const [inputPos, setInputPos] = useState("");
  // Estados para debounce (espera antes de enviar)
  const [debouncedTitle, setDebouncedTitle] = useState("");
  const [debouncedPos, setDebouncedPos] = useState("");

  // Inicializar con los valores del padre cuando lleguen
  useEffect(() => {
    if (title) setInputTitle(title);
    if (pos) setInputPos(pos);
  }, [title, pos]);

  // Debounce: espera 500ms después de que el usuario deja de escribir
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedTitle(inputTitle);
      setDebouncedPos(inputPos);
    }, 500);

    return () => clearTimeout(timer);
  }, [inputTitle, inputPos]);

  // Enviar valores al padre cuando cambien los valores debounced
  useEffect(() => {
    if (debouncedTitle && debouncedPos) {
      onInfoSubmit?.({
        title: debouncedTitle,
        pos: debouncedPos,
      });
    }
  }, [debouncedTitle, debouncedPos, onInfoSubmit]);

  return (
    // card info del restaurante animado
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Card className="bg-white/70 backdrop-blur-xl border border-white/40 rounded-3xl p-4 sm:p-5 shadow-lg transition-all hover:shadow-xl duration-300">
        <div className="space-y-6">
          {/* Título */}
          <h3 className="text-base font-semibold text-center text-slate-800 text-slate-800 text-lg tracking-tight ">
            Información del Restaurante
          </h3>
          {/* Inputs */}
          <div className="space-y-4">
            {/* Nombre del Menú */}
            <div className="flex flex-col gap-2">
              <Label
                htmlFor="title"
                className="text-slate-600 text-sm font-medium"
              >
                Nombre del Menú
              </Label>
              <div className="relative">
                <Input
                  inputMode="text"
                  autoComplete="off"
                  id="title"
                  name="title"
                  type="text"
                  value={inputTitle}
                  onChange={(e) => setInputTitle(e.target.value)}
                  placeholder="Ej: Restaurante El Buen Sabor"
                  className="h-11 pr-10 bg-white/80 border-slate-200 focus-visible:ring-orange-400 text-sm placeholder:text-slate-400"
                />
              </div>
            </div>

            {/* Ubicación / Puntos de Venta */}
            <div className="flex flex-col gap-2">
              <Label
                htmlFor="pos"
                className="text-slate-600 text-sm font-medium"
              >
                Ubicación / Puntos de Venta
              </Label>
              <div className="relative">
                <Input
                  inputMode="text"
                  autoComplete="off"
                  id="pos"
                  name="pos"
                  type="text"
                  value={inputPos}
                  onChange={(e) => setInputPos(e.target.value)}
                  placeholder="Ej: Av. Principal 123, Centro"
                  className="h-11 pr-10 bg-white/80 border-slate-200 focus-visible:ring-orange-400 text-sm placeholder:text-slate-400"
                />
              </div>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default InfoEditor;
