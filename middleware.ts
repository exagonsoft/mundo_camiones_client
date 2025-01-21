import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const origin = req.headers.get("origin");

  // Define allowed origins
  const allowedOrigins = [
    "http://localhost:3000", // Local development
    "https://yourdomain.com",
    "https://master.d2bdppuk7eu8fy.amplifyapp.com",
    "https://subastas.client.martinnotaryfl.com"
  ];

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

  return response;
}

export const config = {
  matcher: "/api/:path*", // Apply only to API routes
};
