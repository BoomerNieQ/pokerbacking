import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

const UNDER_CONSTRUCTION = false; // Zet op false om de site te openen

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Under construction: redirect alles behalve de pagina zelf
  if (UNDER_CONSTRUCTION && pathname !== "/under-construction") {
    return NextResponse.redirect(new URL("/under-construction", request.url));
  }

  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return request.cookies.getAll(); },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();

  if (pathname.startsWith("/dashboard") && !user) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
  if (pathname === "/login" && user) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return supabaseResponse;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|images).*)" ],
};
