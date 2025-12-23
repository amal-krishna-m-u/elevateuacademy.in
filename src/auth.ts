import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { z } from 'zod';

import { authConfig } from './auth.config';
import { sql } from '@vercel/postgres';
import bcrypt from 'bcryptjs';

export const { handlers, auth, signIn, signOut } = NextAuth({
    ...authConfig,

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

                    try {
                        const { rows } = await sql`SELECT * FROM users WHERE email = ${email}`;
                        const user = rows[0];

                        if (!user) return null;

                        const passwordsMatch = await bcrypt.compare(password, user.password);
                        if (passwordsMatch) {
                            return {
                                id: user.id,
                                name: user.name,
                                email: user.email,
                                role: user.role
                            };
                        }
                    } catch (error) {
                        console.error('Auth Error:', error);
                        return null;
                    }
                }

                console.log('Invalid credentials');
                return null;
            },
        }),
    ],
});
