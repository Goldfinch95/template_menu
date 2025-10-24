"use client";

import React, { useState, Suspense } from "react";
import { Button } from "@/common/components/ui/button";
import { useSearchParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Eye,
  Upload,
  AlertCircle,
  Save,
  Sparkles,
  X,
} from "lucide-react";
import { Card } from "@/common/components/ui/card";
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

  const [urlParams] = useState({
    id: menuId || "",
    title: menuTitle || "",
  });

  const isCreating = !urlParams.id;
  const pageTitle = isCreating ? "Creador de Menú" : "Editor de Menú";

  const [showPreview, setShowPreview] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState("");

  const [formData, setFormData] = useState({
    nombre: urlParams.title || "",
    pos: "",
    colorPrincipal: "",
    colorSecundario: "",
    logoUrl: "",
    backgroundUrl: "",
  });

  /* ============================================
   * CÓDIGO DE IMÁGENES LOCALES (COMENTADO)
   * Descomenta esto cuando quieras volver a subir archivos
   * ============================================
  
  const [previews, setPreviews] = useState({
    logo: "",
    background: "",
  });

  const [imageErrors, setImageErrors] = useState({
    logo: "",
    background: "",
  });

  const [imageSizes, setImageSizes] = useState({
    logo: { width: 0, height: 0, size: 0 },
    background: { width: 0, height: 0, size: 0 },
  });

  // Límites de tamaño
  const LIMITS = {
    logo: {
      minWidth: 200,
      maxWidth: 2000,
      minHeight: 200,
      maxHeight: 2000,
      maxSize: 2 * 1024 * 1024, // 2MB
    },
    background: {
      minWidth: 800,
      maxWidth: 4000,
      minHeight: 400,
      maxHeight: 4000,
      maxSize: 5 * 1024 * 1024, // 5MB
    },
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

        let error = "";

        if (size > limits.maxSize) {
          error = `El archivo es muy pesado (${(size / 1024 / 1024).toFixed(
            2
          )}MB). Máximo ${limits.maxSize / 1024 / 1024}MB`;
        }
        else if (width < limits.minWidth || height < limits.minHeight) {
          error = `Imagen muy pequeña (${width}x${height}px). Mínimo ${limits.minWidth}x${limits.minHeight}px`;
        } else if (width > limits.maxWidth || height > limits.maxHeight) {
          error = `Imagen muy grande (${width}x${height}px). Máximo ${limits.maxWidth}x${limits.maxHeight}px`;
        }
        setImageSizes((prev) => ({
          ...prev,
          [field]: { width, height, size },
        }));

        resolve({ valid: !error, error, preview: reader.result });
      };

      reader.readAsDataURL(file);
    });
  };

  const handleImageChange = async (e, field) => {
    const file = e.target.files?.[0];
    if (file) {
      const validation = await validateImage(file, field);

      if (validation.valid) {
        setPreviews((prev) => ({ ...prev, [field]: validation.preview }));
        setImageErrors((prev) => ({ ...prev, [field]: "" }));
      } else {
        setImageErrors((prev) => ({ ...prev, [field]: validation.error }));
        setPreviews((prev) => ({ ...prev, [field]: "" }));
      }
    }
  };

  * FIN DEL CÓDIGO DE IMÁGENES LOCALES
  * ============================================ */

  const handleViewMenu = () => {
    router.push(
      `/menu?id=${menuId}&title=${encodeURIComponent(menuTitle || "")}`
    );
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    console.log("📝 Cambiando campo:", name, "a:", value);
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const canSave = () => {
    // Verificar que haya nombre
    if (!formData.nombre.trim()) return false;
    // Verificar que las URLs sean válidas (opcional)
    try {
      if (formData.logoUrl) new URL(formData.logoUrl);
      if (formData.backgroundUrl) new URL(formData.backgroundUrl);
    } catch {
      return false;
    }
    return true;
  };

  const handleSave = async () => {
    if (!canSave()) return;

    console.log("🔍 Estado actual formData:", formData);

    setIsSaving(true);
    setSaveError("");

    try {
      const payload = {
        userId: 1,
        title: formData.nombre,
        logo: formData.logoUrl,
        backgroundImage: formData.backgroundUrl,
        color: {
          primary: formData.colorPrincipal,
          secondary: formData.colorSecundario,
        },
        pos: formData.pos,
      };

      console.log("📤 Enviando payload:", payload);

      const url = isCreating
        ? "http://localhost:3000/api/menus"
        : `http://localhost:3000/api/menus/${urlParams.id}`;

      const method = isCreating ? "POST" : "PUT";

      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      console.log("📥 Response status:", response.status);

      if (!response.ok) {
        const errorData = await response.json();
        console.error("❌ Error:", errorData);
        throw new Error(errorData.message || "Error al guardar el menú");
      }

      const data = await response.json();
      console.log("✅ Menú guardado:", data);

      if (isCreating && data.id) {
        window.history.replaceState(
          null,
          "",
          `/menu-editor?id=${data.id}&title=${encodeURIComponent(data.title)}`
        );
        alert("¡Menú creado exitosamente! ID: " + data.id);
      } else {
        alert("Cambios guardados exitosamente");
      }
    } catch (error) {
      console.error("💥 Error:", error);
      setSaveError(error.message || "Error al guardar el menú.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Navbar */}
      <nav className="sticky top-0 z-20 bg-slate-950/95 backdrop-blur-lg border-b border-slate-800">
        <div className="px-6 py-4">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                className="text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors"
                onClick={() => window.history.back()}
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div>
                <h1 className="text-xl font-bold text-white flex items-center gap-2">
                  {pageTitle}
                </h1>
              </div>
            </div>
            {!isCreating && menuId && (
              <Button
                onClick={handleViewMenu}
                className="bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700 text-white rounded-xl shadow-lg shadow-blue-500/20"
              >
                <Eye className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      </nav>

      {/* Contenido principal */}
      <main className="px-6 py-6 pb-32 max-w-4xl mx-auto">
        <div className="space-y-6">
          {/* Alert de error */}
          {saveError && (
            <Alert
              variant="destructive"
              className="bg-red-950/50 border-red-900"
            >
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{saveError}</AlertDescription>
            </Alert>
          )}

          {/* Sección de URLs de imágenes */}
          <Card className="bg-slate-900/50 border-slate-800 backdrop-blur-sm">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-semibold text-white text-lg">
                  URLs de Imágenes
                </h3>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <AlertCircle className="w-5 h-5 text-slate-500 cursor-help hover:text-slate-400 transition-colors" />
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs bg-slate-800 border-slate-700">
                      <p className="font-semibold mb-2 text-white">
                        Ingresa URLs de imágenes:
                      </p>
                      <p className="text-xs mb-1 text-slate-300">
                        📷 Logo: Imagen cuadrada (256x256 recomendado)
                      </p>
                      <p className="text-xs text-slate-300">
                        🖼️ Fondo: Imagen horizontal (1200x600 recomendado)
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>

              <div className="space-y-5">
                {/* Logo URL */}
                <div>
                  <label
                    htmlFor="logoUrl"
                    className="block text-sm font-medium text-slate-300 mb-2"
                  >
                    URL del Logo
                  </label>
                  <input
                    id="logoUrl"
                    name="logoUrl"
                    type="url"
                    value={formData.logoUrl}
                    onChange={handleInputChange}
                    placeholder="https://ejemplo.com/logo.png"
                    className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                  
                </div>

                {/* Background URL */}
                <div>
                  <label
                    htmlFor="backgroundUrl"
                    className="block text-sm font-medium text-slate-300 mb-2"
                  >
                    URL de Imagen de Fondo
                  </label>
                  <input
                    id="backgroundUrl"
                    name="backgroundUrl"
                    type="url"
                    value={formData.backgroundUrl}
                    onChange={handleInputChange}
                    placeholder="https://ejemplo.com/fondo.png"
                    className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                  
                </div>
              </div>
            </div>
          </Card>

          {/* Información básica */}
          <Card className="bg-slate-900/50 border-slate-800 backdrop-blur-sm">
            <div className="p-6">
              <h3 className="font-semibold text-white text-lg mb-6">
                Información del Restaurante
              </h3>

              <div className="space-y-5">
                <div>
                  <label
                    htmlFor="nombre"
                    className="block text-sm font-medium text-slate-300 mb-2"
                  >
                    Nombre del Menú *
                  </label>
                  <input
                    id="nombre"
                    name="nombre"
                    type="text"
                    value={formData.nombre}
                    onChange={handleInputChange}
                    placeholder="Ej: Restaurante El Buen Sabor"
                    className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>

                <div>
                  <label
                    htmlFor="pos"
                    className="block text-sm font-medium text-slate-300 mb-2"
                  >
                    Ubicación / Puntos de Venta
                  </label>
                  <input
                    id="pos"
                    name="pos"
                    type="text"
                    value={formData.pos}
                    onChange={handleInputChange}
                    placeholder="Ej: Av. Principal 123, Centro"
                    className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>
            </div>
          </Card>

          {/* Colores */}
          <Card className="bg-slate-900/50 border-slate-800 backdrop-blur-sm">
            <div className="p-6">
              <h3 className="font-semibold text-white text-lg mb-6">
                Personalización de Colores
              </h3>

              <div className="grid md:grid-cols-2 gap-5">
                <div>
                  <label
                    htmlFor="colorPrincipal"
                    className="block text-sm font-medium text-slate-300 mb-3"
                  >
                    Color Principal
                  </label>
                  <div className="flex gap-3">
                    <div className="relative">
                      <input
                        id="colorPrincipal"
                        name="colorPrincipal"
                        type="color"
                        value={formData.colorPrincipal}
                        onChange={handleInputChange}
                        className="h-12 w-14 rounded-xl border-2 border-slate-700 cursor-pointer bg-slate-800"
                      />
                    </div>
                    <input
                      type="text"
                      value={formData.colorPrincipal}
                      onChange={handleInputChange}
                      name="colorPrincipal"
                      className="flex-1 px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all font-mono text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="colorSecundario"
                    className="block text-sm font-medium text-slate-300 mb-3"
                  >
                    Color Secundario
                  </label>
                  <div className="flex gap-3">
                    <div className="relative">
                      <input
                        id="colorSecundario"
                        name="colorSecundario"
                        type="color"
                        value={formData.colorSecundario}
                        onChange={handleInputChange}
                        className="h-12 w-14 rounded-xl border-2 border-slate-700 cursor-pointer bg-slate-800"
                      />
                    </div>
                    <input
                      type="text"
                      value={formData.colorSecundario}
                      onChange={handleInputChange}
                      name="colorSecundario"
                      className="flex-1 px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all font-mono text-sm"
                    />
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </main>

      {/* Botones flotantes */}
      <div className="fixed bottom-0 left-0 right-0 p-6 bg-slate-950/95 backdrop-blur-lg border-t border-slate-800 shadow-2xl">
        <div className="max-w-4xl mx-auto flex gap-4">
          <Button
            onClick={() => setShowPreview(true)}
            className="flex-1 h-14 bg-slate-800 hover:bg-slate-700 text-white rounded-2xl font-semibold text-base transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] border border-slate-700"
          >
            Vista Previa
          </Button>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex-1">
                  <Button
                    onClick={handleSave}
                    disabled={!canSave() || isSaving}
                    className={`w-full h-14 rounded-2xl font-semibold text-base transition-all duration-300 ${
                      canSave() && !isSaving
                        ? "bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700 text-white shadow-lg shadow-blue-500/20 hover:scale-[1.02] active:scale-[0.98]"
                        : "bg-slate-800 text-slate-600 cursor-not-allowed border border-slate-700"
                    }`}
                  >
                    {isSaving
                      ? "Guardando..."
                      : isCreating
                      ? "Crear Menú"
                      : "Guardar Cambios"}
                  </Button>
                </div>
              </TooltipTrigger>
              {!canSave() && !isSaving && (
                <TooltipContent className="bg-slate-800 border-slate-700">
                  <p className="text-xs text-slate-300">
                    Completa el nombre y URLs válidas
                  </p>
                </TooltipContent>
              )}
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      {/* Modal de Preview */}
      {showPreview && (
        <div className="fixed inset-0 bg-black z-50 overflow-y-auto">
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

          <div className="min-h-screen" style={{ backgroundColor: formData.colorPrincipal }}>
            <div className="relative h-72 overflow-hidden">
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{
                  backgroundImage: formData.backgroundUrl
                    ? `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.6)), url(${formData.backgroundUrl})`
                    : `linear-gradient(135deg, ${formData.colorPrincipal}, ${formData.colorSecundario})`,
                }}
              />

              <div className="relative h-full flex flex-col items-center justify-center px-6">
                {formData.logoUrl && (
                  <div className="w-28 h-28 mb-4 bg-white rounded-3xl flex items-center justify-center shadow-2xl overflow-hidden ring-4 ring-white/50">
                    <img
                      src={formData.logoUrl}
                      alt="Logo"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                <h1 className="text-white text-4xl font-bold text-center drop-shadow-lg mb-2">
                  {formData.nombre || "Nombre del Menú"}
                </h1>
                <h2>
                  {formData.pos || "Ubicación / Puntos de Venta"}
                </h2>
              </div>
            </div>

            <div className="px-6 py-8 max-w-4xl mx-auto">
              <h2
                className="text-2xl font-bold mb-6"
                style={{ color: formData.colorSecundario }}
              >
                Ejemplo de Categoria
              </h2>

              <div className="space-y-4">
                {[1, 2, 3].map((item) => (
                  <div
                    key={item}
                    className="border-2 border-slate-200 rounded-2xl p-5 hover:shadow-lg transition-all duration-300 hover:border-slate-300 bg-white"
                  >
                    <div className="flex justify-between items-start gap-4">
                      <div className="flex-1">
                        <h3 className="font-bold text-slate-800 mb-2 text-lg">
                          Producto de Ejemplo {item}
                        </h3>
                        <p className="text-sm text-slate-600 mb-3">
                          Descripción del producto con ingredientes y detalles
                        </p>
                        <p
                          className="text-xl font-bold"
                          style={{ color: formData.colorSecundario }}
                        >
                          $12.99
                        </p>
                      </div>
                      <div className="w-24 h-24 bg-gradient-to-br from-slate-200 to-slate-300 rounded-2xl flex-shrink-0 flex items-center justify-center text-slate-400 text-xs font-medium">
                        Imagen
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 p-6 bg-slate-50 rounded-2xl text-center">
              <p className="text-slate-600 text-sm">
                ✨ Esta es una vista previa de tu menú
              </p>
              <p className="text-slate-500 text-xs mt-2">
                Los productos mostrados son solo de ejemplo
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
      <p className="mt-4 text-gray-600">Cargando editor...</p>
    </div>
  </div>
);

const MenuEditor = () => {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <MenuEditorContent />
    </Suspense>
  );
};

export default MenuEditor;
