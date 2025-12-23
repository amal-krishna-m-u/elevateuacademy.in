import { auth } from "@/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
    // Protected Admin Routes
    if (!req.auth && req.nextUrl.pathname.startsWith("/admin")) {
        return NextResponse.redirect(new URL("/api/auth/signin", req.nextUrl));
    }
    return NextResponse.next();
});

export const config = {
    // CRITICAL: Only match /admin routes to prevent redirect loops on /api/auth
    matcher: ["/admin/:path*"],
};
