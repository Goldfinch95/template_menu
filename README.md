# 🍽️ Template Menu - Proyecto Next.js

Sistema de gestión de **menús digitales para restaurantes**, construido con **Next.js 15**, **React 19** y **Tailwind CSS 4**.  
Permite crear, editar y mostrar menús de forma dinámica, personalizable y adaptable a cualquier dispositivo.

---

## 📋 Requisitos Previos

Asegúrate de tener instalado:

- **Node.js** `>= 18.18.0`
- Gestor de paquetes: `npm`, `yarn`, `pnpm` o `bun`
- Acceso a la API backend en `http://localhost:3000`

---

## 🚀 Instalación

### 1. Clonar el repositorio

```bash
git clone <url-del-repositorio>
cd template_menu
npm install
# o
yarn install
# o
pnpm install
# o
bun install
```
Configuración
Variables de Entorno (Opcional)

Si necesitas configurar la URL del backend:

Crea un archivo .env.local:

Configuración del Backend

La API debe estar corriendo y exponer los siguientes endpoints:

| Método | Endpoint         | Descripción             |
| ------ | ---------------- | ----------------------- |
| GET    | `/api/menus/`    | Obtener todos los menús |
| GET    | `/api/menus/:id` | Obtener menú específico |
| POST   | `/api/menus/`    | Crear nuevo menú        |
| PUT    | `/api/menus/:id` | Actualizar menú         |
| DELETE | `/api/menus/:id` | Eliminar menú           |

Header requerido:
x-tenant-subdomain: amaxlote

----

Ejecutar el Proyecto

Modo Desarrollo

npm run dev
# o
yarn dev
# o
pnpm dev
# o
bun dev

App disponible en: http://localhost:3000 o si el backend esta conectado http://localhost:3001.

Modo Producción

npm run build
npm start

----
📁 Estructura del Proyecto
src/
├── app/
│   ├── components/           # Componentes específicos de la app
│   ├── menu/                 # Página de visualización del menú
│   ├── menuEditor/           # Editor de menús
│   ├── layout.tsx            # Layout principal
│   └── page.tsx              # Página de inicio
├── common/
│   ├── components/ui/        # Componentes UI reutilizables
│   └── utils/                # Funciones helper
├── interfaces/
│   └── menu.ts               # Tipos e interfaces TS
└── styles/
    └── globals.css           # Estilos globales

----
🎨 Características

✨ Crear, editar y eliminar menús digitales

📱 Diseño responsive

🎨 Personalización de colores, logos e imágenes de fondo

📂 Organización por categorías

🖼️ Soporte para imágenes externas

👁️ Vista previa antes de publicar

🌓 Modo Dark/Light

----

🛠️ Tecnologías Utilizadas

| Tecnología   | Versión          |
| ------------ | ---------------- |
| Next.js      | 15.5.4           |
| React        | 19.1.0           |
| TypeScript   | 5.x              |
| Tailwind     | 4                |
| Radix UI     | Dialog / Tooltip |
| Lucide React | Iconografía      |

----

📝 Scripts Disponibles

{
  "dev": "next dev --turbopack",
  "build": "next build --turbopack",
  "start": "next start",
  "lint": "eslint"
}

----

🔑 Rutas Principales

| Ruta          | Descripción            |
| ------------- | ---------------------- |
| `/`           | Listado de menús       |
| `/menuEditor` | Crear/editar menú      |
| `/menu`       | Vista pública del menú |

----

📦 Dependencias Principales

{
  "@radix-ui/react-dialog": "^1.1.15",
  "@radix-ui/react-tooltip": "^1.2.8",
  "class-variance-authority": "^0.7.1",
  "lucide-react": "^0.545.0",
  "next": "15.5.4",
  "react": "19.1.0",
  "tailwind-merge": "^3.3.1"
}

----

🤝 Soporte

Si tienes problemas:

-Verifica que el backend está corriendo

-Reinstala dependencias

-Confirma la versión de Node.js

----

📄 Licencia

Este proyecto es privado.

⚠️ Nota: Requiere backend funcional para operar correctamente.
