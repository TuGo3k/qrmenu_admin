import { NextResponse } from "next/server";

const protectedRoutes = [
  "/category", "/order", "/subcategory", "/slider", "/product", "/user", "/company", "/tablecategory" , "/profile"
];

const publicRoutes = ["/", "/auth/login", "/auth/register"];

export function middleware(request) {
  const token = request.cookies.get("auth_token")?.value;
  const { pathname } = request.nextUrl;

  // Шалгаж байгаа route-ууд яг match болох эсвэл prefix-ээр эхэлж байгаа эсэх
  const isProtectedRoute = protectedRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );

  const isPublicRoute = publicRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );

  // Хэрвээ хамгаалагдсан route руу tokenгүй орж байвал redirect хийнэ
  if (isProtectedRoute && !token) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  return NextResponse.next();
}

// Matcher нь зөвхөн frontend URL-д ажиллана
export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon\\.ico).*)",
  ],
};
