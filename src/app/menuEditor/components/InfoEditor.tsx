import React from 'react';
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
    <Card className="bg-slate-900/50 border-slate-800 backdrop-blur-sm">
      <div className="p-6">
        <h3 className="font-semibold text-white text-lg mb-6">
          Información del Restaurante
        </h3>

        <div className="space-y-5">
          {/* Nombre del Menú */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-slate-300 mb-2">
              Nombre del Menú *
            </label>
            <input
              id="title"
              name="title"
              type="text"
              value={title}
              onChange={handleInputChange}
              placeholder="Ej: Restaurante El Buen Sabor"
              className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>

          {/* Ubicación / Puntos de Venta */}
          <div>
            <label htmlFor="pos" className="block text-sm font-medium text-slate-300 mb-2">
              Ubicación / Puntos de Venta
            </label>
            <input
              id="pos"
              name="pos"
              type="text"
              value={pos}
              onChange={handleInputChange}
              placeholder="Ej: Av. Principal 123, Centro"
              className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>
        </div>
      </div>
    </Card>
  );
};

export default InfoEditor;