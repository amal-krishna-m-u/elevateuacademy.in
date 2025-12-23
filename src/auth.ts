import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { z } from 'zod';

export const { handlers, auth, signIn, signOut } = NextAuth({
    providers: [
        Credentials({
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            authorize: async (credentials) => {
                const parsedCredentials = z
                    .object({ email: z.string().email(), password: z.string().min(6) })
                    .safeParse(credentials);

                if (parsedCredentials.success) {
                    const { email, password } = parsedCredentials.data;

                    // Verify against Environment Variables
                    const adminEmail = process.env.ADMIN_EMAIL;
                    const adminPw = process.env.ADMIN_PASSWORD;

                    if (email === adminEmail && password === adminPw) {
                        return { id: '1', name: 'Admin', email: adminEmail };
                    }
                }

                console.log('Invalid credentials');
                return null;
            },
        }),
    ],
});
