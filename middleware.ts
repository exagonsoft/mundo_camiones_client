import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  const origin = req.headers.get("origin");

  // Define allowed origins
  const allowedOrigins = [
    "http://localhost:3000", // Local development
    "https://yourdomain.com",
    "https://master.d2bdppuk7eu8fy.amplifyapp.com",
    "https://subastas.client.martinnotaryfl.com"
  ];

  // Block requests from disallowed origins
  if (origin && !allowedOrigins.includes(origin)) {
    return new NextResponse(null, {
      status: 403,
      statusText: "Forbidden",
    });
  }

  const response = NextResponse.next();

  // Set CORS headers
  response.headers.set("Access-Control-Allow-Origin", origin || "*");
  response.headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");

  // Authentication & Session Validation
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET || "mundo_camiones_secret" });
  const { pathname } = req.nextUrl;

  // 🚀 **Redirect to Login if Token is Expired or Missing**
  if (!token && pathname.startsWith("/client") || pathname.startsWith("/admin")) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // 🚀 **Redirect Logged-In Users Trying to Access `/auth/login`**
  if (token && pathname === "/auth/login") {
    const dashboard = token.role === "admin" ? "/admin/dashboard" : "/client/dashboard";
    return NextResponse.redirect(new URL(dashboard, req.url));
  }

  return response;
}

// Apply middleware to API routes & authentication-required routes
export const config = {
  matcher: ["/api/:path*", "/auth/login", "/client/:path*", "/admin/:path*"],
};
