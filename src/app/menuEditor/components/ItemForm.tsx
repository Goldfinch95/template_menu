"use client"

import React, { useState } from "react";
import { Card } from "@/common/components/ui/card";
import { NewItem, NewImage } from "@/interfaces/menu";
import { X, Plus, Image as ImageIcon } from "lucide-react";

interface ItemFormProps {
  onAddItem: (item: NewItem) => void;
  onCancel?: () => void;
}

const ItemForm = ({ onAddItem, onCancel }: ItemFormProps) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [active, setActive] = useState(true);
  const [images, setImages] = useState<NewImage[]>([]);

  // Estado temporal para agregar imágenes
  const [imageUrl, setImageUrl] = useState("");
  const [imageAlt, setImageAlt] = useState("");

  const handleAddImage = () => {
    if (imageUrl.trim()) {
      const newImage: NewImage = {
        url: imageUrl,
        alt: imageAlt || null,
        sortOrder: images.length
      };
      setImages([...images, newImage]);
      setImageUrl("");
      setImageAlt("");
    }
  };

  const handleRemoveImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    if (!title.trim() || !price) {
      alert("El título y el precio son obligatorios");
      return;
    }

    const priceNumber = parseFloat(price);
    if (isNaN(priceNumber) || priceNumber < 0) {
      alert("El precio debe ser un número válido");
      return;
    }

    const newItem: NewItem = {
      title: title.trim(),
      description: description.trim() || null,
      price: priceNumber,
      active,
      images: images.length > 0 ? images : undefined
    };

    onAddItem(newItem);

    // Limpiar formulario
    setTitle("");
    setDescription("");
    setPrice("");
    setActive(true);
    setImages([]);
  };

  return (
    <Card className="bg-white/70 backdrop-blur-xl border border-white/40 rounded-2xl p-6 shadow-lg">
      <div className="space-y-6">
        {/* Título */}
        <div className="flex justify-between items-center">
          <h3 className="font-semibold text-slate-800 text-lg">
            Agregar Item
          </h3>
          {onCancel && (
            <button
              onClick={onCancel}
              className="text-slate-400 hover:text-slate-600 transition-colors"
            >
              <X size={20} />
            </button>
          )}
        </div>

        {/* Inputs */}
        <div className="space-y-5">
          {/* Título del Item */}
          <div>
            <label
              htmlFor="item-title"
              className="block text-sm font-medium text-slate-700 mb-2"
            >
              Título del Item *
            </label>
            <input
              id="item-title"
              name="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ej: Pizza Margarita"
              className="w-full px-4 py-2 border border-slate-300 rounded-lg placeholder:text-slate-400 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>

          {/* Descripción */}
          <div>
            <label
              htmlFor="item-description"
              className="block text-sm font-medium text-slate-700 mb-2"
            >
              Descripción
            </label>
            <textarea
              id="item-description"
              name="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Ej: Pizza con salsa de tomate, mozzarella y albahaca fresca"
              rows={3}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg placeholder:text-slate-400 focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
            />
          </div>

          {/* Precio */}
          <div>
            <label
              htmlFor="item-price"
              className="block text-sm font-medium text-slate-700 mb-2"
            >
              Precio *
            </label>
            <input
              id="item-price"
              name="price"
              type="number"
              step="0.01"
              min="0"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="Ej: 12500.00"
              className="w-full px-4 py-2 border border-slate-300 rounded-lg placeholder:text-slate-400 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>

          {/* Toggle Activo */}
          <div className="flex items-center justify-between">
            <label
              htmlFor="item-active"
              className="text-sm font-medium text-slate-700"
            >
              Item Activo
            </label>
            <button
              id="item-active"
              type="button"
              onClick={() => setActive(!active)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                active ? "bg-orange-500" : "bg-slate-300"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  active ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>

          {/* Sección de Imágenes */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-slate-700">
              Imágenes
            </label>

            {/* Lista de imágenes agregadas */}
            {images.length > 0 && (
              <div className="space-y-2">
                {images.map((img, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200"
                  >
                    <ImageIcon size={20} className="text-slate-400" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-slate-700 truncate">{img.url}</p>
                      {img.alt && (
                        <p className="text-xs text-slate-500 truncate">{img.alt}</p>
                      )}
                    </div>
                    <button
                      onClick={() => handleRemoveImage(index)}
                      className="text-red-500 hover:text-red-700 transition-colors"
                    >
                      <X size={18} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Formulario para agregar imagen */}
            <div className="space-y-2 p-4 bg-slate-50 rounded-lg border border-slate-200">
              <input
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="URL de la imagen"
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg placeholder:text-slate-400 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
              <input
                type="text"
                value={imageAlt}
                onChange={(e) => setImageAlt(e.target.value)}
                placeholder="Texto alternativo (opcional)"
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg placeholder:text-slate-400 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
              <button
                type="button"
                onClick={handleAddImage}
                className="w-full flex items-center justify-center gap-2 px-3 py-2 text-sm bg-slate-200 hover:bg-slate-300 text-slate-700 font-medium rounded-lg transition-colors"
              >
                <Plus size={16} />
                Agregar Imagen
              </button>
            </div>
          </div>
        </div>

        {/* Botones de acción */}
        <div className="flex gap-3">
          {onCancel && (
            <button
              onClick={onCancel}
              className="flex-1 bg-slate-200 hover:bg-slate-300 text-slate-700 font-medium py-2 px-4 rounded-lg transition-colors"
            >
              Cancelar
            </button>
          )}
          <button
            onClick={handleSubmit}
            className="flex-1 bg-gradient-to-br from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            Agregar Item
          </button>
        </div>
      </div>
    </Card>
  );
};

export default ItemForm;
