"use client";

import React, { useState } from "react";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/common/components/ui/accordion";
import { ArrowLeft } from "lucide-react";  
import { useRouter } from "next/navigation";  

export default function FaqPage() {
  const [open, setOpen] = useState<string | undefined>(undefined);
  const router = useRouter();  // Usamos useRouter para la redirección

  const faqs = [
    {
      question: "¿Cómo crear un menú digital?",
      answer:
        "Para crear un menú digital, simplemente haz clic en 'Crear nuevo menú' y sigue los pasos para personalizarlo con tus platos y categorías.",
    },
    {
      question: "¿Puedo agregar varios menús?",
      answer:
        "Sí, puedes agregar varios menús y gestionarlos desde tu perfil. Solo tienes que crear un nuevo menú cada vez que quieras agregar uno.",
    },
    {
      question: "¿Es posible modificar un menú después de crearlo?",
      answer:
        "Sí, puedes modificar un menú en cualquier momento desde la vista de edición de menús. Solo selecciona el menú y haz los cambios necesarios.",
    },
    {
      question: "¿Cómo puedo compartir mi menú con los clientes?",
      answer:
        "Puedes compartir tu menú digital generando un código QR que los clientes pueden escanear.",
    },
    {
      question: "¿Necesito pagar para usar la plataforma?",
      answer:
        "No, la plataforma es completamente gratuita. Puedes crear y gestionar menús sin ningún costo.",
    },
  ];

  return (
    <main className="min-h-screen w-full flex flex-col justify-center bg-gradient-to-b from-white via-[#FFF3EC] to-[#FFE6D3] px-6 py-8">
      <div className="w-full max-w-3xl mx-auto bg-white/85 backdrop-blur-xl rounded-3xl p-8 shadow-xl border border-white/40 space-y-6">
        {/* Botón de retroceso */}
        <button
          onClick={() => router.back()}  // Redirige a la página anterior
          className="absolute left-5 top-5 p-2 rounded-full bg-orange-500 text-white shadow-md hover:bg-orange-600 active:scale-95 transition-all"
        >
          <ArrowLeft className="w-5 h-5"  />
        </button>

        {/* Título */}
        <div className="text-center pb-2">
          <h2 className="text-3xl font-extrabold text-slate-900">
            Preguntas Frecuentes
          </h2>
          <p className="text-slate-600 text-base mt-2">
            Encontrá respuestas a las dudas más comunes
          </p>
        </div>

        {/* Accordion */}
        <Accordion
          type="single"
          collapsible
          value={open}
          onValueChange={setOpen}
          className="space-y-3"
        >
          {faqs.map((faq, index) => (
            <AccordionItem
              key={index}
              value={index.toString()}
              className="border-0"
            >
              <AccordionTrigger
                className="flex items-center justify-between w-full text-left
                  px-5 py-4 rounded-xl
                  bg-white border border-slate-200 shadow-sm
                  hover:bg-orange-50 hover:border-orange-300
                  transition-all duration-200
                  text-base font-semibold text-slate-800
                  [&[data-state=open]]:bg-gradient-to-r [&[data-state=open]]:from-orange-400 [&[data-state=open]]:to-orange-500
                  [&[data-state=open]]:text-white [&[data-state=open]]:border-orange-500
                  [&[data-state=open]]:shadow-md
                  group
                  [&[data-state=open]>svg]:text-white
                "
              >
                <span className="flex-1 pr-4 text-base">{faq.question}</span>
              </AccordionTrigger>
              <AccordionContent
                className="mt-2 px-5 py-4 rounded-xl
                  bg-white/80 backdrop-blur-sm
                  border border-slate-200 shadow-sm
                  text-slate-600 text-sm leading-relaxed"
              >
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </main>
  );
}
