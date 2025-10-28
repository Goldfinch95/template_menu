"use client";
import React from "react";
import { Button } from "@/common/components/ui/button";
import { ArrowLeft, Eye } from "lucide-react";

interface MenuEditorHeaderProps {
  pageTitle: string;
  isCreating: boolean;
  
  menuId: string | null;
  handleViewMenu: () => void;
}

const NavbarEditor: React.FC<MenuEditorHeaderProps> = ({
  pageTitle,
  isCreating,
  menuId,
  handleViewMenu,
}) => {
    return (
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
    );
};

export default NavbarEditor;