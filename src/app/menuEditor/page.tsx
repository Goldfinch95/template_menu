"use client";

import React, { useState } from "react";
import { Button } from "@/common/components/ui/button";
import { useSearchParams, useRouter } from "next/navigation";
import { ArrowLeft, Eye } from "lucide-react";


const handleBack = () => {
  console.log("Volver a inicio");
};

const MenuEditor = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const menuId = searchParams.get("id");
  const menuTitle = searchParams.get("title");

  const [formData, setFormData] = useState({
    logo: null,
    background: null,
    nombre: '',
    puntosVenta: '',
    colorPrincipal: '#000000',
    colorSecundario: '#ffffff'
  });

   const [previews, setPreviews] = useState({
    logo: '',
    background: ''
  });


  const handleViewMenu = () => {
    router.push(`/menu?id=${menuId}&title=${encodeURIComponent(menuTitle)}`)
  };

  const handleImageChange = (e, field) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, [field]: file }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviews(prev => ({ ...prev, [field]: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    console.log('Datos del formulario:', formData);
  };

  return (
    <div className="min-h-screen">
      {/*nav*/}
      <nav className="border-b bg-white text-black shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={() => router.back()}>
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold">Editor de Menú</h1>
              </div>
            </div>

            <div>
              <Button onClick={handleViewMenu} className="gap-2">
                <Eye className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </nav>
       {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 text-black p-6">
          <div className="space-y-6">
            {/* Imágenes */}
            <div className="grid grid-cols-2 gap-6">
              {/* Logo */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Logo</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-gray-400 transition-colors">
                  {previews.logo ? (
                    <div className="relative">
                      <img src={previews.logo} alt="Logo preview" className="max-h-32 mx-auto rounded" />
                      <button
                        className="mt-2 px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50"
                        onClick={() => {
                          setFormData(prev => ({ ...prev, logo: null }));
                          setPreviews(prev => ({ ...prev, logo: '' }));
                        }}
                      >
                        Cambiar imagen
                      </button>
                    </div>
                  ) : (
                    <label htmlFor="logo" className="cursor-pointer block">
                      <div className="text-gray-400 mb-2">
                        <svg className="mx-auto h-12 w-12" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                          <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </div>
                      <p className="text-sm text-gray-600">Haz click para subir el logo</p>
                      <p className="text-xs text-gray-400 mt-1">PNG, JPG hasta 10MB</p>
                    </label>
                  )}
                  <input
                    id="logo"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleImageChange(e, 'logo')}
                  />
                </div>
              </div>

              {/* Background */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Imagen de Fondo</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-gray-400 transition-colors">
                  {previews.background ? (
                    <div className="relative">
                      <img src={previews.background} alt="Background preview" className="max-h-32 mx-auto rounded" />
                      <button
                        className="mt-2 px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50"
                        onClick={() => {
                          setFormData(prev => ({ ...prev, background: null }));
                          setPreviews(prev => ({ ...prev, background: '' }));
                        }}
                      >
                        Cambiar imagen
                      </button>
                    </div>
                  ) : (
                    <label htmlFor="background" className="cursor-pointer block">
                      <div className="text-gray-400 mb-2">
                        <svg className="mx-auto h-12 w-12" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                          <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </div>
                      <p className="text-sm text-gray-600">Haz click para subir el fondo</p>
                      <p className="text-xs text-gray-400 mt-1">PNG, JPG hasta 10MB</p>
                    </label>
                  )}
                  <input
                    id="background"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleImageChange(e, 'background')}
                  />
                </div>
              </div>
            </div>

            {/* Nombre */}
            <div className="space-y-2">
              <label htmlFor="nombre" className="block text-sm font-medium text-gray-700">
                Nombre del Menú
              </label>
              <input
                id="nombre"
                name="nombre"
                type="text"
                value={formData.nombre}
                onChange={handleInputChange}
                placeholder="Ej: Restaurante El Buen Sabor"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Puntos de Venta */}
            <div className="space-y-2">
              <label htmlFor="puntosVenta" className="block text-sm font-medium text-gray-700">
                Puntos de Venta
              </label>
              <input
                id="puntosVenta"
                name="puntosVenta"
                type="text"
                value={formData.puntosVenta}
                onChange={handleInputChange}
                placeholder="Ej: Av. Principal 123, Centro Comercial"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Colores */}
            <div className="grid grid-cols-2 gap-4">
              {/* Color Principal */}
              <div className="space-y-2">
                <label htmlFor="colorPrincipal" className="block text-sm font-medium text-gray-700">
                  Color Principal
                </label>
                <div className="flex gap-2">
                  <input
                    id="colorPrincipal"
                    name="colorPrincipal"
                    type="color"
                    value={formData.colorPrincipal}
                    onChange={handleInputChange}
                    className="h-10 w-20 rounded border border-gray-300 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={formData.colorPrincipal}
                    onChange={handleInputChange}
                    name="colorPrincipal"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Color Secundario */}
              <div className="space-y-2">
                <label htmlFor="colorSecundario" className="block text-sm font-medium text-gray-700">
                  Color Secundario
                </label>
                <div className="flex gap-2">
                  <input
                    id="colorSecundario"
                    name="colorSecundario"
                    type="color"
                    value={formData.colorSecundario}
                    onChange={handleInputChange}
                    className="h-10 w-20 rounded border border-gray-300 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={formData.colorSecundario}
                    onChange={handleInputChange}
                    name="colorSecundario"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Botones */}
            <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
             
              <button 
                type="button"
                onClick={handleSubmit}
                className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors"
              >
                Guardar Cambios
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default MenuEditor;
