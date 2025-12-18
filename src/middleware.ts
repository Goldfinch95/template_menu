import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("authToken")?.value;
  const currentPath = request.nextUrl.pathname;
  const searchParams = request.nextUrl.searchParams;

  // Rutas públicas sin autenticación
  const publicPaths = ["/", "/password"];
  
  // Rutas con token temporal (deben tener el parámetro 'token' en la URL)
  const temporalTokenPaths = ["/password/create", "/password/recover", "/create"];
  
  // Rutas públicas con parámetros específicos
  const isPublicMenuRoute = currentPath === "/menu" && (
    searchParams.has("id") || 
    (searchParams.has("tenant") && searchParams.has("menuId"))
  );

  
  // Rutas privadas que requieren authToken
  const privatePaths = [
    "/menuShowcase",
    "/register",
    "/menuEditor"
  ];

  // ✔ Ruta completamente pública (ej: homepage)
  if (publicPaths.includes(currentPath)) {
    return NextResponse.next();
  }

  // ✔ Ruta pública con parámetro ID (ej: /menu?id=40 desde QR)
  if (isPublicMenuRoute) {
    return NextResponse.next();
  }

  // ✔ Rutas con token temporal (desde email)
  if (temporalTokenPaths.includes(currentPath)) {
    const temporalToken = searchParams.get("token");
    
    if (!temporalToken) {
      // No tiene token temporal → redirigir a home
      return NextResponse.redirect(new URL("/", request.url));
    }
    
    // Tiene token temporal → permitir acceso
    // Aquí podrías validar el token contra tu API si quieres
    return NextResponse.next();
  }

  // ❌ Rutas privadas sin authToken
  const isPrivateRoute = privatePaths.some(path => 
    currentPath === path || currentPath.startsWith(`${path}/`)
  );

  if (isPrivateRoute && !token) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // ✔ Si tiene token → puede acceder a cualquier ruta privada
  if (token) {
    return NextResponse.next();
  }

  // ❌ Cualquier otra ruta sin token → redirigir a home
  return NextResponse.redirect(new URL("/", request.url));
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)",
  ],
};