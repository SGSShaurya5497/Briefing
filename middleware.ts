import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    // Allow request to proceed — auth is enforced by withAuth
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

// Protect these routes — unauthenticated users get redirected to /auth/signin
export const config = {
  matcher: ["/app/:path*", "/gallery/:path*", "/api/generate", "/api/generations"],
};
