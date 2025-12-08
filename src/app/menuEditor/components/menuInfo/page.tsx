"use client";

import React, { useEffect, useState, useCallback } from "react";
import { Card, CardHeader, CardContent } from "@/common/components/ui/card";
import Image from "next/image";
import { BookImage, Edit, QrCode } from "lucide-react";
import { Spinner } from "@/common/components/ui/spinner";
import { Button } from "@/common/components/ui/button";
import { motion } from "framer-motion";
import { ImageIcon } from "lucide-react";
import InfoDialog from "./components/InfoDialog";
import { getMenu, getMenuQr } from "@/common/utils/api";
import { Menu } from "@/interfaces/menu";
import { jsPDF } from "jspdf";

interface InfoEditorProps {
  menuId: number;
  onMenuCreated: (newMenuId: number) => void;
}

const MenuInfoPage = ({ menuId, onMenuCreated }: InfoEditorProps) => {
  // estado del menuId seleccionado
  const [currentMenuId, setCurrentMenuId] = useState<number | undefined>(
    menuId
  );
  // estado para el menú
  const [menu, setMenu] = useState<Menu>({} as Menu);
  // estado de carga
  const [loading, setLoading] = useState(true);
  // estado para determinar si es un menú vacío (nuevo)
  const [isEmpty, setIsEmpty] = useState<boolean>(false);
  // estado para la imagen del QR
  const [qrImageUrl, setQrImageUrl] = useState<string>("");

  /*const [newMenuTitle, setNewMenuTitle] = useState<string>(""); // Título del nuevo menú
  const [newMenuLogo, setNewMenuLogo] = useState<string>("");*/


  // Simular delay (para demostraciones o pruebas)
  const simulateDelay = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  // 🔥 Función para cargar/recargar el menú desde la API
  const fetchMenuData = useCallback(async (id?: number) => {
    //console.log("📥 Intentando cargar menu con ID:", id);

    //si no hay menu
    if (!id) {
      setIsEmpty(true);
      setLoading(false);
      return;
    }

    setLoading(true);
    //si hay menu
    try {
      const fakeTime = Math.random() * 700 + 1500;
        await simulateDelay(fakeTime);
      const [menuData] = await Promise.all([getMenu(id)]);
      //console.log("📥 Menú cargado:", menuData);
      setMenu(menuData);
      setIsEmpty(false);
    } catch {
      console.error("❌ Error al obtener el menú");
    } finally {
      setLoading(false);
    }
  }, []);

  // Llamada inicial a la API para obtener el menú
  useEffect(() => {
    //console.log("🔍 Menu ID recibido:", menuId);
    setCurrentMenuId(menuId);
    fetchMenuData(menuId);
  }, [menuId, fetchMenuData]);

  //Crea el menu y lo actualiza

  const handleMenuCreated = (newMenuId: number) => {
    //console.log("🎉 Menú creado con ID:", newMenuId);
    onMenuCreated(newMenuId);

    setCurrentMenuId(newMenuId);
    fetchMenuData(newMenuId);
  };

  // 🎯 Función que se pasa al hijo para que notifique cambios
  const handleMenuUpdated = () => {
    //console.log("🔄 Menú actualizado, recargando...");
    fetchMenuData(currentMenuId); // Vuelve a hacer la petición GET
  };

  // Función helper mejorada para cargar imágenes con transparencia
const loadImageAsDataURL = (url: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    // Usar HTMLImageElement explícitamente
    const img = document.createElement('img') as HTMLImageElement;
    img.crossOrigin = 'anonymous';
    
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      
      if (ctx) {
        // Dibujar la imagen manteniendo la transparencia
        ctx.drawImage(img, 0, 0);
        resolve(canvas.toDataURL('image/png'));
      } else {
        reject(new Error('No se pudo obtener el contexto del canvas'));
      }
    };
    
    img.onerror = () => reject(new Error('Error al cargar la imagen'));
    img.src = url;
  });
};
  // Función para obtener el QR del menú
  const handleGenerateQr = async () => {
  if (!currentMenuId) return;

  try {
    const qrUrl = await getMenuQr(currentMenuId);
    const doc = new jsPDF();

    const title = menu.title || "Sin título";
    const pos = menu.pos;

    // ---------------------------------------------------
    // FONDO
    // ---------------------------------------------------
    doc.setFillColor(255, 250, 245);
    doc.rect(0, 0, 210, 297, "F");

    // ---------------------------------------------------
    // HEADER - TÍTULO Y DIRECCIÓN A LA IZQUIERDA, LOGO A LA DERECHA
    // ---------------------------------------------------
    const headerY = 25;
    
    // Título
    doc.setFont("helvetica", "bold");
    doc.setFontSize(26);
    doc.setTextColor(33, 33, 33);
    doc.text(title, 15, headerY);

    // Dirección/posición como subtítulo (si existe)
    let lineY = headerY + 23;
    if (pos) {
      doc.setFont("helvetica", "normal");
      doc.setFontSize(13);
      doc.setTextColor(102, 102, 102);
      doc.text(String(pos), 15, headerY + 8);
      lineY = headerY + 23;
    }

    // Logo a la derecha (si existe)
    if (menu.logo) {
      const logoDataURL = await loadImageAsDataURL(menu.logo);
      const logoSize = 25;
      const logoX = 210 - logoSize - 15;
      const logoY = 15;
      
      // Agregar imagen con transparencia
      doc.addImage(logoDataURL, 'PNG', logoX, logoY, logoSize, logoSize);
    }

    // Línea divisoria naranja - de borde a borde
    doc.setDrawColor(255, 107, 53);
    doc.setLineWidth(0.5);
    doc.line(0, lineY, 210, lineY);

    // ---------------------------------------------------
    // TARJETA CENTRAL CON QR
    // ---------------------------------------------------
    const cardY = lineY + 40;
    const cardHeight = 155;
    
    // Sombra de la tarjeta
    doc.setFillColor(220, 220, 220);
    doc.roundedRect(22, cardY + 2, 166, cardHeight, 4, 4, "F");
    
    // Tarjeta blanca
    doc.setFillColor(255, 255, 255);
    doc.roundedRect(20, cardY, 166, cardHeight, 4, 4, "F");

    // Título de la sección
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.setTextColor(33, 33, 33);
    doc.text("Escanea para ver el menú", 105, cardY + 20, { align: "center" });

    // Línea decorativa
    doc.setDrawColor(255, 107, 53);
    doc.setLineWidth(2);
    const decorLineY = cardY + 27;
    doc.line(80, decorLineY, 130, decorLineY);

    // QR Code
    const qrSize = 90;
    const qrX = (210 - qrSize) / 2;
    const qrY = cardY + 40;
    
    doc.addImage(qrUrl, "PNG", qrX, qrY, qrSize, qrSize);

    // Instrucción debajo del QR
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.setTextColor(102, 102, 102);
    doc.text("Apunta tu cámara aquí", 105, qrY + qrSize + 12, { align: "center" });

    // ---------------------------------------------------
    // FOOTER EN LA PARTE INFERIOR
    // ---------------------------------------------------
    const footerY = 285;
    
    // Línea decorativa
    doc.setDrawColor(220, 220, 220);
    doc.setLineWidth(0.5);
    doc.line(40, footerY, 170, footerY);

    // Texto del footer
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(140, 140, 140);
    doc.text("Gracias por usar nuestro servicio", 105, footerY + 5, { align: "center" });

    // ---------------------------------------------------
    // GUARDAR
    // ---------------------------------------------------
    doc.save(`${title}-QR.pdf`);

  } catch (error) {
    console.error("❌ Error al generar PDF:", error);
  }
};

  if (loading) {
    return (
      <div className="w-full flex justify-center items-center">
        <Spinner className="w-12 h-12 text-orange-500" />
      </div>
    );
  }
  // si NO hay menu en la BD, renderiza esto:
  if (isEmpty) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="w-full px-4"
      >
        <Card className="bg-white/80 backdrop-blur-sm border border-slate-200/50 rounded-2xl shadow-md p-6 w-full max-w-sm mx-auto">
          <div className="flex flex-col items-center text-center py-10 space-y-4">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.35 }}
            >
              <ImageIcon className="w-16 h-16 text-slate-300" />
            </motion.div>

            <h3 className="text-lg font-semibold text-slate-800">
              Sin información
            </h3>

            <p className="text-sm text-slate-500 max-w-[260px] leading-relaxed">
              Todavía no creaste un menú. Podés empezar desde el botón Crear.
            </p>

            <InfoDialog
              menuId={currentMenuId}
              onCreated={handleMenuCreated}
              trigger={
                <Button className="w-full mt-3 bg-orange-500 text-white py-6 rounded-xl">
                  Crear
                </Button>
              }
            />
          </div>
        </Card>
      </motion.div>
    );
  }
  // renderizado NORMAL
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="w-full px-4"
    >
      <Card className="bg-white/80 backdrop-blur-sm border border-slate-200/50 rounded-2xl shadow-lg pt-0 w-full max-w-sm mx-auto">
        <CardHeader className="bg-gradient-to-r from-orange-500 to-orange-600 text-white pt-8 pb-15 relative rounded-t-xl ">
          <div className="text-left space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wider opacity-90 mb-1">
              Información del menú
            </p>
            <h2 className="text-3xl font-extrabold tracking-tight">
              {menu.title}
            </h2>
          </div>
          {/* Círculo blanco con icono centrado */}
          <div className="absolute -bottom-14 left-1/2 transform -translate-x-1/2">
            <div className="w-28 h-28 bg-white rounded-full flex items-center justify-center border-4 border-white shadow-xl">
              {/* logo */}
              <div
                className={`w-28 h-28 rounded-full overflow-hidden flex items-center justify-center 
              ${
                menu.logo
                  ? "ring-2 ring-slate-200"
                  : "border-2 border-dashed border-slate-300"
              }`}
              >
                {menu.logo ? (
                  <Image
                    src={menu.logo}
                    alt="Logo preview"
                    width={80}
                    height={80}
                    className="object-cover"
                    priority
                  />
                ) : (
                  <BookImage className="w-12 h-12 text-slate-400" />
                )}
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-10 pb-6 px-6">
          {/* Botones */}
          <div className="flex align-center justify-center gap-6 pt-8">
            <div className="flex flex-row items-center justify-center gap-4 w-1/2">
              <InfoDialog
                menuId={currentMenuId}
                menuTitle={menu.title}
                menuPos={menu.pos}
                menuLogo={menu.logo}
                menuBackground={menu.backgroundImage}
                menuPrimary={menu.color?.primary}
                menuSecondary={menu.color?.secondary}
                onUpdated={handleMenuUpdated}
                trigger={
                  <Button className="w-full h-25 bg-orange-500 text-white rounded-xl flex flex-col items-center justify-center shadow-lg hover:shadow-2xl transition duration-300">
                    <Edit className="!w-8 !h-8" />
                    <span className="text-sm mt-2">Editar</span>
                  </Button>
                }
              />
              <Button
                onClick={handleGenerateQr}
                className="w-full h-25 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-xl shadow-lg transition-all duration-300 hover:shadow-2xl flex flex-col items-center justify-center"
              >
                <QrCode className="!w-8 !h-8" />
                <span className="text-sm mt-2">Generar QR</span>
              </Button>
              {qrImageUrl && (
  <div className="mt-8 text-center">
    <Image
      src={qrImageUrl} // Asegúrate de que esto sea la URL generada por createObjectURL
      alt="QR del Menú"
      width={300}
      height={300}
    />
  </div>
)}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default MenuInfoPage;
