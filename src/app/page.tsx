"use client"

import React, { useState, useEffect } from 'react';
import FoodMenuItem from "@/app/components/FoodMenuItem";

export default function Home() {
  
  const [activeCategory, setActiveCategory] = useState('promociones');

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['promociones', 'entradas', 'principales', 'postres'];
      
      for (const sectionId of sections) {
        const element = document.getElementById(sectionId);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 150 && rect.bottom >= 150) {
            setActiveCategory(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const categories = [
    { id: 'promociones', label: 'Promociones' },
    { id: 'entradas', label: 'Entradas' },
    { id: 'principales', label: 'Platos Principales' },
    { id: 'postres', label: 'Postres' }
  ];

  const menuData = {
    promociones: [
      {
        id: 1,
        name: "Combo Breakfast",
        description: "Pancakes con huevos revueltos, tocino y jugo de naranja natural",
        price: 450.00,
        image: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=200&h=200&fit=crop"
      },
      {
        id: 2,
        name: "Promo Hot Dog",
        description: "2 hot dogs completos con papas fritas y bebida incluida",
        price: 380.00,
        image: "https://images.unsplash.com/photo-1612392062798-2dbcedc36881?w=200&h=200&fit=crop"
      },
      {
        id: 3,
        name: "Especial del Día",
        description: "Plato del día con entrada, bebida y postre incluido",
        price: 520.00,
        image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200&h=200&fit=crop"
      },
      {
        id: 4,
        name: "Combo Pareja",
        description: "2 platos principales a elección más 2 bebidas y 1 postre para compartir",
        price: 850.00,
        image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=200&h=200&fit=crop"
      }
    ],
    entradas: [
      {
        id: 5,
        name: "Bruschetta Caprese",
        description: "Pan tostado con tomate fresco, mozzarella, albahaca y aceite de oliva",
        price: 180.00,
        image: "https://images.unsplash.com/photo-1572695157366-5e585ab2b69f?w=200&h=200&fit=crop"
      },
      {
        id: 6,
        name: "Nachos Supreme",
        description: "Nachos con queso fundido, guacamole, crema y jalapeños",
        price: 220.00,
        image: "https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?w=200&h=200&fit=crop"
      },
      {
        id: 7,
        name: "Ensalada César",
        description: "Lechuga romana, crutones, parmesano y aderezo césar casero",
        price: 200.00,
        image: "https://images.unsplash.com/photo-1546793665-c74683f339c1?w=200&h=200&fit=crop"
      },
      {
        id: 8,
        name: "Alitas Buffalo",
        description: "8 alitas de pollo crujientes con salsa buffalo y dip ranch",
        price: 250.00,
        image: "https://images.unsplash.com/photo-1608039755401-742074f0548d?w=200&h=200&fit=crop"
      }
    ],
    principales: [
      {
        id: 9,
        name: "Burger Deluxe",
        description: "Hamburguesa de carne angus con queso cheddar, tocino y papas fritas",
        price: 420.00,
        image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=200&h=200&fit=crop"
      },
      {
        id: 10,
        name: "Pasta Carbonara",
        description: "Pasta fresca con panceta, huevo, parmesano y pimienta negra",
        price: 380.00,
        image: "https://images.unsplash.com/photo-1612874742237-6526221588e3?w=200&h=200&fit=crop"
      },
      {
        id: 11,
        name: "Pizza Margherita",
        description: "Pizza artesanal con salsa de tomate, mozzarella fresca y albahaca",
        price: 350.00,
        image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=200&h=200&fit=crop"
      },
      {
        id: 12,
        name: "Pollo a la Parrilla",
        description: "Pechuga de pollo marinada con vegetales asados y puré de papas",
        price: 400.00,
        image: "https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=200&h=200&fit=crop"
      }
    ],
    postres: [
      {
        id: 13,
        name: "Tiramisú Clásico",
        description: "Postre italiano con café, mascarpone y cacao en polvo",
        price: 180.00,
        image: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=200&h=200&fit=crop"
      },
      {
        id: 14,
        name: "Brownie con Helado",
        description: "Brownie de chocolate caliente con helado de vainilla y salsa de chocolate",
        price: 200.00,
        image: "https://images.unsplash.com/photo-1607920591413-4ec007e70023?w=200&h=200&fit=crop"
      },
      {
        id: 15,
        name: "Cheesecake de Frutos",
        description: "Tarta de queso cremosa con coulis de frutos rojos",
        price: 190.00,
        image: "https://images.unsplash.com/photo-1524351199678-941a58a3df50?w=200&h=200&fit=crop"
      },
      {
        id: 16,
        name: "Flan Casero",
        description: "Flan tradicional con dulce de leche y crema chantilly",
        price: 150.00,
        image: "https://images.unsplash.com/photo-1587314168485-3236d6710814?w=200&h=200&fit=crop"
      }
    ]
  };

  const scrollToCategory = (categoryId) => {
    setActiveCategory(categoryId);
    const element = document.getElementById(categoryId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };
   
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-800 via-gray-900 to-black">
      {/* Header with background image */}
      <div className="relative h-48 rounded-b-3xl overflow-hidden bg-gray-900">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-60"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&h=400&fit=crop')",
          }}
        ></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-white text-4xl font-bold tracking-wider drop-shadow-lg">Different</h1>
            <p className="text-white text-2xl font-light mt-1 drop-shadow-lg">kind of Food</p>
          </div>
        </div>
      </div>

      {/* Category Navigation */}
      <div className="sticky top-0 z-10 bg-gray-900 border-b border-gray-800 shadow-lg flex items-center">
        <div className="max-w-2xl mx-auto px-2 py-3">
          <div className="flex gap-1.5 overflow-x-auto scrollbar-hide">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => scrollToCategory(category.id)}
                className={`flex-shrink-0 px-3 py-2 rounded-full text-xs font-semibold transition-all whitespace-nowrap ${
                  activeCategory === category.id
                    ? 'bg-red-500 text-white'
                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Menu Content */}
      <div className="max-w-2xl mx-auto px-4 py-6">
        {categories.map((category) => (
          <div key={category.id} id={category.id} className="mb-8">
            <div className="mb-4 flex items-end gap-2">
              <h2 className="text-white text-2xl font-bold">{category.label}</h2>
              <div className="h-0.5 w-full bg-red-500 rounded mb-1"></div>
            </div>

            <div>
              {menuData[category.id].map((item) => (
                <FoodMenuItem key={item.id} {...item} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
