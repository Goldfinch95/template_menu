import React from "react";
import { Card } from "@/common/components/ui/card";

interface RestaurantInfoCardProps {
  title: string;
  pos: string;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const InfoEditor: React.FC<RestaurantInfoCardProps> = ({
  title,
  pos,
  handleInputChange,
}) => {
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
          onChange={handleInputChange}
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
          onChange={handleInputChange}
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
