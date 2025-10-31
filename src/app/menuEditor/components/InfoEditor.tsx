"use client";

import React, { useState, useEffect } from "react";
import { Card } from "@/common/components/ui/card";

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
          pos: debouncedPos
        });
    }
  }, [debouncedTitle, debouncedPos, onInfoSubmit]);

  return (
    <Card className="bg-white/70 backdrop-blur-xl border border-white/40 rounded-2xl p-6 shadow-lg">
      <div className="space-y-6">
        {/* Título */}
        <h3 className="font-semibold text-slate-800 text-lg">
          Información del Restaurante
        </h3>

        {/* Inputs */}
        <div className="space-y-5">
          {/* Nombre del Menú */}
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-slate-700 mb-2"
            >
              Nombre del Menú *
            </label>
            <input
              id="title"
              name="title"
              type="text"
              value={inputTitle}
              onChange={(e) => setInputTitle(e.target.value)}
              placeholder="Ej: Restaurante El Buen Sabor"
              className="w-full px-4 py-2 border border-slate-300 rounded-lg placeholder:text-slate-400 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>

          {/* Ubicación / Puntos de Venta */}
          <div>
            <label
              htmlFor="pos"
              className="block text-sm font-medium text-slate-700 mb-2"
            >
              Ubicación / Puntos de Venta
            </label>
            <input
              id="pos"
              name="pos"
              type="text"
              value={inputPos}
              onChange={(e) => setInputPos(e.target.value)}
              placeholder="Ej: Av. Principal 123, Centro"
              className="w-full px-4 py-2 border border-slate-300 rounded-lg placeholder:text-slate-400 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>
    </Card>
  );
};

export default InfoEditor;
