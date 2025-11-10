"use client";

import React, { useState, useEffect } from "react";
import { Card } from "@/common/components/ui/card";
import { Label } from "@radix-ui/react-label";
import { Input } from "@/common/components/ui/input";
import { Button } from "@/common/components/ui/button";

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
    <Card className="bg-gradient-to-b from-white/80 to-white/60 backdrop-blur-xl border border-white/30 rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.05)] transition-all hover:shadow-[0_8px_40px_rgb(0,0,0,0.08)] duration-300">
      <div className="space-y-6">
        {/* Título */}
          <h3 className="text-center font-semibold text-slate-800 text-lg tracking-tight">
            Información del Restaurante
          </h3>
        {/* Inputs */}
        <div className="space-y-5">
          {/* Nombre del Menú */}
          <div className="flex flex-col gap-3">
            <Label
              htmlFor="title"
              className="text-slate-600 text-sm font-medium"
            >
              Nombre del Menú
            </Label>
            <div className="relative">
              <Input
              id="title"
              name="title"
              type="text"
              value={inputTitle}
              onChange={(e) => setInputTitle(e.target.value)}
              placeholder="Ej: Restaurante El Buen Sabor"
              className="pr-9 bg-white/70 border-slate-200 focus-visible:ring-orange-400 text-sm"
            />
            
            </div>
          </div>

          {/* Ubicación / Puntos de Venta */}
          <div className="flex flex-col gap-3">
            <Label
              htmlFor="pos"
              className="text-slate-600 text-sm font-medium"
            >
              Ubicación / Puntos de Venta
            </Label>
            <div className="relative">
              <Input
              id="pos"
              name="pos"
              type="text"
              value={inputPos}
              onChange={(e) => setInputPos(e.target.value)}
              placeholder="Ej: Av. Principal 123, Centro"
              className="pr-9 bg-white/70 border-slate-200 focus-visible:ring-orange-400 text-sm"
            />
            
            </div>
            
          </div>
        </div>
      </div>
    </Card>
  );
};

export default InfoEditor;
