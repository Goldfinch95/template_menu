Template Menu - Proyecto Next.js
Sistema de gestión de menús digitales para restaurantes construido con Next.js 15, React 19 y Tailwind CSS 4.
📋 Requisitos Previos

Node.js 18.18.0 o superior
npm, yarn, pnpm o bun
Acceso a la API backend en http://localhost:3000

🚀 Instalación

Clonar el repositorio

bashgit clone <url-del-repositorio>
cd template_menu

Instalar dependencias

bashnpm install
# o
yarn install
# o
pnpm install
# o
bun install
🔧 Configuración
Variables de Entorno (Opcional)
Si necesitas configurar la URL de la API, crea un archivo .env.local:
envNEXT_PUBLIC_API_URL=http://localhost:3000
Configuración del Backend
Asegúrate de que tu API backend esté corriendo en http://localhost:3000 y que tenga los siguientes endpoints disponibles:

GET /api/menus/ - Obtener todos los menús
GET /api/menus/:id - Obtener un menú específico
POST /api/menus/ - Crear nuevo menú
PUT /api/menus/:id - Actualizar menú
DELETE /api/menus/:id - Eliminar menú

Header requerido: x-tenant-subdomain: amaxlote
🏃 Ejecución del Proyecto
Modo Desarrollo
bashnpm run dev
# o
yarn dev
# o
pnpm dev
# o
bun dev
La aplicación estará disponible en http://localhost:3000
Modo Producción
bash# Construir el proyecto
npm run build

# Iniciar servidor de producción
npm start
```

## 📁 Estructura del Proyecto
```
src/
├── app/
│   ├── components/           # Componentes específicos de la app
│   │   └── FoodMenuItem.tsx
│   ├── menu/                 # Página de visualización del menú
│   │   └── page.tsx
│   ├── menuEditor/           # Editor de menús
│   │   └── page.tsx
│   ├── layout.tsx            # Layout principal
│   └── page.tsx              # Página de inicio
├── common/
│   ├── components/ui/        # Componentes UI reutilizables
│   │   ├── alert.tsx
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── dialog.tsx
│   │   └── tooltip.tsx
│   └── utils/
│       └── utils.ts          # Utilidades (cn function)
├── interfaces/
│   └── menu.ts               # Interfaces TypeScript
└── styles/
    └── globals.css           # Estilos globales
🎨 Características

✨ Gestión de Menús: Crear, editar y eliminar menús digitales
📱 Responsive: Diseño adaptable a todos los dispositivos
🎨 Personalización: Colores, logo e imagen de fondo personalizables
📂 Categorías: Organiza platos por categorías
🖼️ Imágenes: Soporte para URLs de imágenes externas
👁️ Vista Previa: Previsualiza el menú antes de publicar
🌓 Dark Mode: Tema oscuro incluido

🛠️ Tecnologías Utilizadas

Framework: Next.js 15.5.4
React: 19.1.0
TypeScript: 5.x
Styling: Tailwind CSS 4
UI Components: Radix UI
Icons: Lucide React
Fonts: Google Fonts (Open Sans)

📝 Scripts Disponibles
json{
  "dev": "next dev --turbopack",          // Desarrollo con Turbopack
  "build": "next build --turbopack",      // Build de producción
  "start": "next start",                   // Servidor de producción
  "lint": "eslint"                         // Linter
}
🔑 Rutas Principales

/ - Listado de menús
/menuEditor - Editor de menús (crear/editar)
/menu - Vista pública del menú

📦 Dependencias Principales
json{
  "@radix-ui/react-dialog": "^1.1.15",
  "@radix-ui/react-tooltip": "^1.2.8",
  "class-variance-authority": "^0.7.1",
  "lucide-react": "^0.545.0",
  "next": "15.5.4",
  "react": "19.1.0",
  "tailwind-merge": "^3.3.1"
}
🤝 Soporte
Si encuentras algún problema o tienes preguntas:

Verifica que el backend esté corriendo
Revisa que todas las dependencias estén instaladas
Asegúrate de tener la versión correcta de Node.js

📄 Licencia
Este proyecto es privado.

Nota: Este proyecto requiere un backend API funcionando. Asegúrate de configurar correctamente la API antes de ejecutar el proyecto.
