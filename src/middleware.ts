import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("authToken")?.value;

  const publicPaths = ["/"];            // login **agregar aqui la ruta del qr*
  const currentPath = request.nextUrl.pathname;
  const isPublic = publicPaths.includes(currentPath);

  // 🚫 No tiene token → y quiere entrar a una ruta privada
  if (!token && !isPublic) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // 🔄 Ya tiene token → y quiere volver al login
  if (token && currentPath === "/") {
    return NextResponse.redirect(new URL("/home", request.url));
  }

  return NextResponse.next();
}


// 👇 Define qué rutas controla el middleware
export const config = {
  matcher: [
    "/((?!_next|.*\\..*).*)",
  ],
};
