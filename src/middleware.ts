import NextAuth from "next-auth";
import { authConfig } from "./auth.config";

export default NextAuth(authConfig).auth;

export const config = {
    // CRITICAL: Only match /admin routes to prevent redirect loops on /api/auth
    matcher: ["/admin/:path*"],
};
