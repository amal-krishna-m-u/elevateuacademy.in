import type { NextAuthConfig } from 'next-auth';

export const authConfig = {

    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.role = (user as any).role;
            }
            return token;
        },
        async session({ session, token }) {
            if (session?.user) {
                session.user.id = token.id as string;
                (session.user as any).role = token.role as string;
            }
            return session;
        },
        async redirect({ url, baseUrl }) {
            // 1. Standardize the URL
            const isRelative = url.startsWith("/");
            const targetUrl = isRelative ? `${baseUrl}${url}` : url;

            // 2. Security: Allow internal redirects
            if (targetUrl.startsWith(baseUrl)) {
                // If specifically going to root, prefer /admin
                if (targetUrl === baseUrl || targetUrl === `${baseUrl}/`) {
                    return `${baseUrl}/admin`;
                }
                return targetUrl;
            }

            // 3. Fallback default
            return `${baseUrl}/admin`;
        },
        authorized({ auth, request: { nextUrl } }) {
            const isLoggedIn = !!auth?.user;
            const isOnAdmin = nextUrl.pathname.startsWith('/admin');
            const isOnAuth = nextUrl.pathname.startsWith('/api/auth');

            // 1. Redirect logged-in users away from the Sign-In page to Admin
            if (isLoggedIn && nextUrl.pathname.includes('/signin')) {
                return Response.redirect(new URL('/admin', nextUrl));
            }

            // 2. Allow access to other Auth API routes (session, csrf, signout, etc.)
            if (isOnAuth) return true;

            // 3. Protect Admin Dashboard
            if (isOnAdmin && !isLoggedIn) return false;

            // 4. Allow public access
            return true;
        },
    },
    providers: [], // Providers added in auth.ts
} satisfies NextAuthConfig;
