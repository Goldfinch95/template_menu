import React from 'react';
import { Button } from '@/common/components/ui/button';
import { FoodMenuItemProps } from '@/interfaces/menu';

const FoodMenuItem: React.FC<FoodMenuItemProps> = ({ title, description, price, image }) => {
  return (
     <div className="py-4 border-b border-gray-700 last:border-b-0">
  <div className="flex gap-3 items-center">
    <div className="flex-shrink-0">
      <div className="w-20 h-20 rounded-lg overflow-hidden ">
        <img 
          src={image} 
          alt={title}
          className="w-full h-full object-cover rounded-full"
        />
      </div>
    </div>
    
   {/* <div className="flex-1 min-w-0">
      <h3 className="text-white font-bold text-lg  mb-1">{name}</h3>
      <p className="text-gray-400 text-base mb-2 line-clamp-2">{description}</p>
      <div className="flex items-center justify-between">
        <span className="text-white font-bold  text-xl">$ {price.toFixed(2)}</span>
        <Button 
          size="sm"
          className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-full px-4 py-1 h-8 text-xs font-semibold"
        >
          Editar
        </Button>
      </div>
    </div>/*}
  
    {/* other */}
    <div className="flex-1 min-w-0 grid grid-cols-[1fr_auto] gap-4">
  <div className="min-w-0 flex flex-col">
    <h3 className="text-white font-bold text-lg mb-1">{title}</h3>
    <p className="text-gray-400 text-base mb-2">{description}</p>
    <span className="text-white font-bold text-xl mt-auto">$ {price}</span>
  </div>
  {/*}
  <div className="flex items-end">
    <Button 
      size="sm"
      className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-full px-4 py-1 h-8 text-xs font-semibold"
    >
      Editar
    </Button>
  </div>*/}
</div>
  </div>
</div>
  );
};

export default FoodMenuItem;