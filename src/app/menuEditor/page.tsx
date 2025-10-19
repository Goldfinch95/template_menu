"use client";

import React, { useState } from "react";
import { Button } from "@/common/components/ui/button";
import { useSearchParams, useRouter } from "next/navigation";
import { ArrowLeft, Eye } from "lucide-react";
import Menupage from "../menu/page";

const handleBack = () => {
  console.log("Volver a inicio");
};

const MenuEditor = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const menuId = searchParams.get("id");

  const handleViewMenu = () => {
    router.push(`/menu?id=${menuId}`);
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
    </div>
  );
};

export default MenuEditor;
