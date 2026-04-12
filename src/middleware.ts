import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Laat de under-construction pagina zelf door
  if (pathname === "/under-construction") {
    return NextResponse.next();
  }

  // Redirect alles naar under-construction
  return NextResponse.redirect(new URL("/under-construction", req.url));
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|under-construction).*)",
  ],
};
