"use client";

import React, { useState, Suspense } from "react";
import { Button } from "@/common/components/ui/button";
import { useSearchParams, useRouter } from "next/navigation";
import { ArrowLeft, Eye, Upload, X,  AlertCircle  } from "lucide-react";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/common/components/ui/tooltip";
import { Alert, AlertDescription } from "@/common/components/ui/alert";

// Componente interno que usa useSearchParams
const MenuEditorContent = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const menuId = searchParams.get("id");
  const menuTitle = searchParams.get("title");
  const [showPreview, setShowPreview] = useState(false);

  const [formData, setFormData] = useState({
    logo: null as File | null,
    background: null as File | null,
    nombre: "",
    puntosVenta: "",
    colorPrincipal: "#000000",
    colorSecundario: "#ffffff",
  });

  const [previews, setPreviews] = useState({
    logo: "",
    background: "",
  });

  const [imageErrors, setImageErrors] = useState({
    logo: '',
    background: ''
  });

  const [imageSizes, setImageSizes] = useState({
    logo: { width: 0, height: 0, size: 0 },
    background: { width: 0, height: 0, size: 0 }
  });

  // Límites de tamaño
  const LIMITS = {
    logo: {
      minWidth: 200,
      maxWidth: 2000,
      minHeight: 200,
      maxHeight: 2000,
      maxSize: 2 * 1024 * 1024 // 2MB
    },
    background: {
      minWidth: 800,
      maxWidth: 4000,
      minHeight: 400,
      maxHeight: 4000,
      maxSize: 5 * 1024 * 1024 // 5MB
    }
  };

  const validateImage = (file, field) => {
    return new Promise((resolve) => {
      const img = new Image();
      const reader = new FileReader();

      reader.onloadend = () => {
        img.src = reader.result;
      };

      img.onload = () => {
        const width = img.width;
        const height = img.height;
        const size = file.size;
        const limits = LIMITS[field];

        let error = '';

        // Validar tamaño del archivo
        if (size > limits.maxSize) {
          error = `El archivo es muy pesado (${(size / 1024 / 1024).toFixed(2)}MB). Máximo ${limits.maxSize / 1024 / 1024}MB`;
        }
        // Validar dimensiones
        else if (width < limits.minWidth || height < limits.minHeight) {
          error = `Imagen muy pequeña (${width}x${height}px). Mínimo ${limits.minWidth}x${limits.minHeight}px`;
        }
        else if (width > limits.maxWidth || height > limits.maxHeight) {
          error = `Imagen muy grande (${width}x${height}px). Máximo ${limits.maxWidth}x${limits.maxHeight}px`;
        }
        setImageSizes(prev => ({
          ...prev,
          [field]: { width, height, size }
        }));

        resolve({ valid: !error, error, preview: reader.result });
      };

      reader.readAsDataURL(file);
    });
  };

  const handleViewMenu = () => {
    router.push(
      `/menu?id=${menuId}&title=${encodeURIComponent(menuTitle || "")}`
    );
  };

  const handleImageChange = async (e, field) => {
    const file = e.target.files?.[0];
    if (file) {
      const validation = await validateImage(file, field);
      
      if (validation.valid) {
        setPreviews(prev => ({ ...prev, [field]: validation.preview }));
        setImageErrors(prev => ({ ...prev, [field]: '' }));
      } else {
        setImageErrors(prev => ({ ...prev, [field]: validation.error }));
        setPreviews(prev => ({ ...prev, [field]: '' }));
      }
    }
  };

   const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const canSave = () => {
    // Verificar que no haya errores de imagen
    if (imageErrors.logo || imageErrors.background) return false;
    // Verificar que haya nombre
    if (!formData.nombre.trim()) return false;
    return true;
  };

  const handleSave = () => {
    if (canSave()) {
      console.log('Guardando...', formData);
      // Aquí iría tu lógica de guardado
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar fijo */}
      <nav className="fixed top-0 left-0 right-0 bg-white text-black border-b shadow-sm z-20">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button className="p-2 -ml-2 hover:bg-gray-100 rounded-full">
                <ArrowLeft className="w-5 h-5" />
              </button>
              <h1 className="text-lg font-semibold">Editor de Menú</h1>
            </div>
            <div>
              <Button onClick={handleViewMenu} className="gap-2">
                <Eye className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Contenido principal */}
      <main className="pt-[57px] px-4 pb-24">
        <div className="space-y-6">
          {/* Sección de imágenes */}
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-800">Imágenes</h3>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <AlertCircle className="w-4 h-4 text-gray-400 cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs">
                    <p className="font-semibold mb-2">Requisitos de imágenes:</p>
                    <p className="text-xs mb-1">📷 Logo: 200-2000px, máx 2MB</p>
                    <p className="text-xs">🖼️ Fondo: 800-4000px (ancho), máx 5MB</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            
            {/* Logo */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Logo
                <span className="text-xs text-gray-500 ml-2">(200-2000px, máx 2MB)</span>
              </label>
              
              {imageErrors.logo && (
                <Alert variant="destructive" className="mb-3">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription className="text-sm">
                    {imageErrors.logo}
                  </AlertDescription>
                </Alert>
              )}

              <div className={`border-2 border-dashed rounded-lg p-4 text-center ${
                imageErrors.logo ? 'border-red-300 bg-red-50' : 'border-gray-300'
              }`}>
                {previews.logo ? (
                  <div>
                    <img src={previews.logo} alt="Logo preview" className="w-24 h-24 mx-auto rounded object-cover mb-3" />
                    <p className="text-xs text-gray-500 mb-2">
                      {imageSizes.logo.width}x{imageSizes.logo.height}px - {(imageSizes.logo.size / 1024).toFixed(0)}KB
                    </p>
                    <label htmlFor="logo" className="inline-block px-4 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 cursor-pointer">
                      Cambiar logo
                    </label>
                  </div>
                ) : (
                  <label htmlFor="logo" className="cursor-pointer block">
                    <Upload className="w-10 h-10 mx-auto text-gray-400 mb-2" />
                    <p className="text-sm text-gray-600">Subir logo</p>
                    <p className="text-xs text-gray-400 mt-1">PNG, JPG (cuadrado preferible)</p>
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

            {/* Fondo */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Imagen de Fondo
                <span className="text-xs text-gray-500 ml-2">(800-4000px ancho, máx 5MB)</span>
              </label>
              
              {imageErrors.background && (
                <Alert variant="destructive" className="mb-3">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription className="text-sm">
                    {imageErrors.background}
                  </AlertDescription>
                </Alert>
              )}

              <div className={`border-2 border-dashed rounded-lg p-4 text-center ${
                imageErrors.background ? 'border-red-300 bg-red-50' : 'border-gray-300'
              }`}>
                {previews.background ? (
                  <div>
                    <img src={previews.background} alt="Background preview" className="w-full h-32 mx-auto rounded object-cover mb-3" />
                    <p className="text-xs text-gray-500 mb-2">
                      {imageSizes.background.width}x{imageSizes.background.height}px - {(imageSizes.background.size / 1024).toFixed(0)}KB
                    </p>
                    <label htmlFor="background" className="inline-block px-4 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 cursor-pointer">
                      Cambiar fondo
                    </label>
                  </div>
                ) : (
                  <label htmlFor="background" className="cursor-pointer block">
                    <Upload className="w-10 h-10 mx-auto text-gray-400 mb-2" />
                    <p className="text-sm text-gray-600">Subir fondo</p>
                    <p className="text-xs text-gray-400 mt-1">PNG, JPG (horizontal preferible)</p>
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

          {/* Información básica */}
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <h3 className="font-semibold mb-4 text-gray-800">Información</h3>
            
            <div className="space-y-4">
              {/* Nombre */}
              <div>
                <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre del Menú *
                </label>
                <input
                  id="nombre"
                  name="nombre"
                  type="text"
                  value={formData.nombre}
                  onChange={handleInputChange}
                  placeholder="Ej: Restaurante El Buen Sabor"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Puntos de Venta */}
              <div>
                <label htmlFor="puntosVenta" className="block text-sm font-medium text-gray-700 mb-2">
                  Puntos de Venta
                </label>
                <input
                  id="puntosVenta"
                  name="puntosVenta"
                  type="text"
                  value={formData.puntosVenta}
                  onChange={handleInputChange}
                  placeholder="Ej: Av. Principal 123"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Colores */}
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <h3 className="font-semibold mb-4 text-gray-800">Colores</h3>
            
            <div className="space-y-4">
              {/* Color Principal */}
              <div>
                <label htmlFor="colorPrincipal" className="block text-sm font-medium text-gray-700 mb-2">
                  Color Principal
                </label>
                <div className="flex gap-2">
                  <input
                    id="colorPrincipal"
                    name="colorPrincipal"
                    type="color"
                    value={formData.colorPrincipal}
                    onChange={handleInputChange}
                    className="h-10 w-16 rounded border border-gray-300 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={formData.colorPrincipal}
                    onChange={handleInputChange}
                    name="colorPrincipal"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Color Secundario */}
              <div>
                <label htmlFor="colorSecundario" className="block text-sm font-medium text-gray-700 mb-2">
                  Color Secundario
                </label>
                <div className="flex gap-2">
                  <input
                    id="colorSecundario"
                    name="colorSecundario"
                    type="color"
                    value={formData.colorSecundario}
                    onChange={handleInputChange}
                    className="h-10 w-16 rounded border border-gray-300 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={formData.colorSecundario}
                    onChange={handleInputChange}
                    name="colorSecundario"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Botones flotantes en la parte inferior */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t shadow-lg">
        <div className="flex gap-3">
          {/* Botón de Vista Previa */}
          <button 
            onClick={() => setShowPreview(true)}
            className="flex-1 py-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"
          >
            <Eye className="w-5 h-5" />
            Vista Previa
          </button>
          
          {/* Botón de Guardar */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex-1">
                  <button 
                    onClick={handleSave}
                    disabled={!canSave()}
                    className={`w-full py-3 rounded-lg font-medium transition-colors ${
                      canSave() 
                        ? 'bg-black text-white hover:bg-gray-800' 
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    Guardar
                  </button>
                </div>
              </TooltipTrigger>
              {!canSave() && (
                <TooltipContent>
                  <p className="text-xs">
                    {imageErrors.logo || imageErrors.background 
                      ? 'Corrige los errores de las imágenes' 
                      : 'Completa el nombre del menú'}
                  </p>
                </TooltipContent>
              )}
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      {/* Modal de Preview Fullscreen */}
      {showPreview && (
        <div className="fixed inset-0 bg-black z-50 overflow-y-auto">
          {/* Header del Preview */}
          <div className="sticky top-0 bg-white/10 backdrop-blur-md border-b border-white/20 z-10">
            <div className="px-4 py-3 flex items-center justify-between">
              <span className="text-white font-medium">Vista Previa</span>
              <button 
                onClick={() => setShowPreview(false)}
                className="p-2 hover:bg-white/20 rounded-full transition-colors"
              >
                <X className="w-6 h-6 text-white" />
              </button>
            </div>
          </div>

          {/* Contenido del menú simulado */}
          <div className="min-h-screen">
            {/* Header del menú con imagen de fondo */}
            <div className="relative h-64 overflow-hidden">
              {/* Imagen de fondo con overlay */}
              <div 
                className="absolute inset-0 bg-cover bg-center"
                style={{
                  backgroundImage: previews.background 
                    ? `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url(${previews.background})` 
                    : 'none',
                  backgroundColor: previews.background ? 'transparent' : '#374151'
                }}
              />
              
              {/* Contenido del header */}
              <div className="relative h-full flex flex-col items-center justify-center px-4">
                {/* Logo */}
                {previews.logo && (
                  <div className="w-24 h-24 mb-3 bg-white rounded-full flex items-center justify-center shadow-2xl overflow-hidden">
                    <img src={previews.logo} alt="Logo" className="w-full h-full object-cover" />
                  </div>
                )}
                
                {/* Nombre del restaurante */}
                <h1 className="text-white text-3xl font-bold text-center drop-shadow-lg mb-2">
                  {formData.nombre || 'Nombre del Menú'}
                </h1>
                
                {/* Puntos de venta */}
                {formData.puntosVenta && (
                  <p className="text-white text-sm text-center drop-shadow">
                    📍 {formData.puntosVenta}
                  </p>
                )}
              </div>
            </div>

            {/* Sección de categorías simuladas */}
            <div className="bg-white px-4 py-6">
              <h2 className="text-xl font-bold mb-4" style={{ color: formData.colorPrincipal }}>
                Nuestro Menú
              </h2>
              
              {/* Items de ejemplo */}
              <div className="space-y-4">
                {[1, 2, 3].map((item) => (
                  <div key={item} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-800 mb-1">
                          Producto de Ejemplo {item}
                        </h3>
                        <p className="text-sm text-gray-600 mb-2">
                          Descripción del producto con ingredientes y detalles
                        </p>
                        <p className="text-lg font-bold" style={{ color: formData.colorPrincipal }}>
                          $12.99
                        </p>
                      </div>
                      <div className="w-20 h-20 bg-gray-200 rounded-lg ml-4 flex-shrink-0"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer informativo */}
            <div className="bg-gray-100 px-4 py-6 text-center text-sm text-gray-600">
              <p>Esta es una vista previa de cómo se verá tu menú</p>
              <p className="mt-2">Los productos mostrados son solo de ejemplo</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Componente de carga mientras se resuelve el Suspense
const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
      <p className="mt-4 text-gray-600">Cargando editor...</p>
    </div>
  </div>
);

// Componente principal exportado con Suspense
const MenuEditor = () => {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <MenuEditorContent />
    </Suspense>
  );
};

export default MenuEditor;
