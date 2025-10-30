"use client"

import React, { useState } from "react";
import { Card } from "@/common/components/ui/card";

interface InfoEditorProps {
  onInfoSubmit?: (info: { title: string; pos: string }) => void;
}

const InfoEditor = ({ onInfoSubmit }: InfoEditorProps) => {

  const [title, setTitle] = useState("");
  const [pos, setPos] = useState("");

  // comprobar valores
  const showValues = () => {
    const values = {
      title,
      pos
    };
    // Enviar al componente padre
    if (onInfoSubmit) {
      onInfoSubmit(values);
    }
  };

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
          value={title}
            onChange={(e) => setTitle(e.target.value)}
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
          value={pos}
            onChange={(e) => setPos(e.target.value)}
          placeholder="Ej: Av. Principal 123, Centro"
          className="w-full px-4 py-2 border border-slate-300 rounded-lg placeholder:text-slate-400 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
        />
      </div>
    </div>
  </div>
  {/* Botón de Control */}
      <button
        onClick={showValues}
        className="mt-5 w-full bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
      >
        Ver Valores
      </button>
</Card>
  );
};

export default InfoEditor;
