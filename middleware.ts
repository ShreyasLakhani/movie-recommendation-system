import { NextResponse } from 'next/server';
import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/login", // this is your login page
  },
});

// Protect routes that require authentication
export const config = {
  matcher: [
    "/search/:path*",
    "/watchlist/:path*",
    "/playlists/:path*",
    "/profile/:path*",
    "/settings/:path*",
    "/movie/:path*/rate",
    "/movie/:path*/review",
  ]
};
