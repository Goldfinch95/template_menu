import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("authToken")?.value;

  const publicPaths  = ["/", "/password"];
  const currentPath = request.nextUrl.pathname;

  const isPublic = publicPaths.includes(currentPath);

  // ❌ NO TIENE TOKEN → solo puede entrar a "/"
  if (!token && !isPublic) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // ✔ Tiene token → puede entrar a cualquier ruta, incluso "/"
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next|.*\\..*).*)",
  ],
};
