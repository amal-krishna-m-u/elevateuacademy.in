import NextAuth from "next-auth";
import { authConfig } from "./auth.config";
import { NextResponse } from "next/server";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
    // const isLoggedIn = !!req.auth;
    // console.log(`[Middleware] Path: ${req.nextUrl.pathname} | LoggedIn: ${isLoggedIn}`);

    // authorized callback in auth.config.ts should handle the rest, 
    // but using 'auth' wrapper executes it automatically.
    // However, we want to be sure.
    // The wrapper automatically calls 'authorized' and handles redirects.
    // We are just adding logging here.
})

export const config = {
    // Match all request paths except for the ones starting with:
    // - _next/static (static files)
    // - _next/image (image optimization files)
    // - favicon.ico (favicon file)
    // REMOVED 'api' from exclusion so we can intercept /api/auth/signin and redirect if logged in
    matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
