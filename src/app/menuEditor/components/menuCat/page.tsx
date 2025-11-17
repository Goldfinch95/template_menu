import React from "react";
import { motion } from "framer-motion";
import { Card } from "@/common/components/ui/card";
import { Button } from "@/common/components/ui/button";
import { Plus, Edit2, Trash2, X } from "lucide-react";
import CatDialog from "./components/CatDialog";

interface CatEditorProps {
  menuId: number;
}

const MenuCatPage = ({ menuId }: CatEditorProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="w-full px-4"
    >
      <Card className="bg-white/80 backdrop-blur-sm border border-slate-200/50 rounded-2xl shadow-md p-6 w-full max-w-sm mx-auto">
        <div className="text-center mb-4">
          <p className="text-sm font-medium text-slate-500 uppercase tracking-wider mb-2">
            Menú
          </p>
          {/*abir dialogo de crear categoria */}
          <CatDialog
            menuId={menuId}
            trigger={
              <Button className="w-full mt-3 bg-orange-500 text-white py-6 rounded-xl">
                <Plus className="w-4 h-4" />
              </Button>
            }
          />
          {/*mostrar categorias de la BD */}
          <div className="space-y-3"></div>
        </div>
      </Card>
    </motion.div>
  );
};

export default MenuCatPage;
