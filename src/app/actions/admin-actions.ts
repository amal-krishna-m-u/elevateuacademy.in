'use server';

import { z } from 'zod';
import { sql } from '@vercel/postgres';
import { revalidatePath } from 'next/cache';
import { auth } from '@/auth';
import bcrypt from 'bcryptjs';

const createUserSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
});

export async function createAdminUser(prevState: any, formData: FormData) {
    // 1. Verify Auth
    const session = await auth();
    // Check 1: Is user logged in?
    // Check 2: Does user have the 'admin' role?
    if (!session?.user || (session.user as any).role !== 'admin') {
        return {
            success: false,
            message: "Unauthorized: You do not have permission to perform this action."
        };
    }

    // 2. Validate Input
    const validatedFields = createUserSchema.safeParse({
        name: formData.get('name'),
        email: formData.get('email'),
        password: formData.get('password'),
    });

    if (!validatedFields.success) {
        return {
            success: false,
            message: validatedFields.error.flatten().fieldErrors,
        };
    }

    const { name, email, password } = validatedFields.data;

    try {
        // 3. Hash Password
        const hashedPassword = await bcrypt.hash(password, 10);

        // 4. Insert into DB
        await sql`
            INSERT INTO users (name, email, password, role)
            VALUES (${name}, ${email}, ${hashedPassword}, 'admin')
        `;

        revalidatePath('/admin/users');
        return { success: true, message: 'Admin user created successfully!' };
    } catch (e: any) {
        if (e.code === '23505') { // Unique violation for email
            return { success: false, message: 'Email already exists.' };
        }
        console.error('Create Admin Error:', e);
        return { success: false, message: 'Failed to create admin user.' };
    }
}

export async function deleteAdminUser(userId: string) {
    const session = await auth();
    // Check 1: Is user logged in?
    // Check 2: Does user have the 'admin' role?
    if (!session?.user || (session.user as any).role !== 'admin') {
        return {
            success: false,
            message: "Unauthorized: You do not have permission to perform this action."
        };
    }

    // Prevent self-deletion? 
    // Usually good practice, but not strictly required by prompt. 
    // Let's implement it for safety if we can match ID. 
    // session.user.id is available from our auth.ts update.

    if (session.user.id === userId) {
        return { success: false, message: "You cannot delete your own account." };
    }

    // Explicitly prevent deleting the Super Admin defined in env
    const superAdminEmail = process.env.ADMIN_EMAIL;
    // We need to fetch the email of the user being deleted to check against superAdminEmail
    // Or just rely on the fact that if YOU are the super admin, the check above catches it.
    // But if another admin tries to delete the super admin?
    // Let's fetch the user to be safe.
    try {
        const { rows } = await sql`SELECT email FROM users WHERE id = ${userId}`;
        if (rows.length > 0 && rows[0].email === superAdminEmail) {
            return { success: false, message: "Cannot delete the Root Admin." };
        }
    } catch (e) {
        // ignore
    }

    try {
        await sql`DELETE FROM users WHERE id = ${userId}`;
        revalidatePath('/admin/users');
        return { success: true, message: 'User deleted.' };
    } catch (e) {
        console.error('Delete Admin Error:', e);
        return { success: false, message: 'Failed to delete user.' };
    }
}
