'use server';

import { z } from 'zod';
import { sql } from '@vercel/postgres';
import { revalidatePath } from 'next/cache';

const schema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    phone: z.string().regex(/^\+?[\d\s-]{10,}$/, "Invalid phone number"),
    course: z.string().optional(),
});

export async function submitEnquiry(prevState: any, formData: FormData) {
    // 🛡️ Security: Honeypot Check
    // If the hidden 'confirm_email' field is filled, it's a bot.
    const honeypot = formData.get('confirm_email');
    if (honeypot) {
        // Return fake success to deceive the bot and prevent retries
        return { success: true, message: 'Enquiry submitted successfully!' };
    }

    // 🛡️ Security: Basic IP Rate Limiting (Optional Placeholder)
    // To implement: Import headers(), get 'x-forwarded-for', and check against a store (Redis/KV).

    const validatedFields = schema.safeParse({
        name: formData.get('name'),
        phone: formData.get('phone'),
        course: formData.get('course'),
    });

    if (!validatedFields.success) {
        return {
            success: false,
            message: validatedFields.error.flatten().fieldErrors,
        };
    }

    const { name, phone, course } = validatedFields.data;

    try {
        await sql`
            INSERT INTO enquiries (name, phone, course_interest, status)
            VALUES (${name}, ${phone}, ${course || 'General'}, 'New')
        `;
        revalidatePath('/admin');
        return { success: true, message: 'Enquiry submitted successfully!' };
    } catch (e) {
        console.error(e);
        return { success: false, message: 'Database Error: Failed to save enquiry.' };
    }
}

export async function deleteEnquiries(ids: string[]) {
    try {
        // Convert string IDs to numbers (since DB uses SERIAL)
        const numericIds = ids.map(id => parseInt(id, 10)).filter(id => !isNaN(id));

        if (numericIds.length === 0) {
            return { success: false, message: 'No valid IDs provided' };
        }

        // Use ANY to delete multiple rows efficiently
        // Note: implicit casting or looping might be needed depending on driver version, 
        // but passing array to ANY usually works in pg. 
        // However, vercel/postgres is strict.
        // Let's use a safe looped query or formatted entries if the list is small (it usually is).
        // Actually, easiest standard way tailored for vercel/postgres template literal:

        for (const id of numericIds) {
            await sql`DELETE FROM enquiries WHERE id = ${id}`;
        }

        // Optimization: For huge batches, a single query is better, but loop is safe for <50 items.

        revalidatePath('/admin');
        return { success: true, count: numericIds.length };
    } catch (e) {
        console.error('Delete Error:', e);
        return { success: false, message: 'Failed to delete enquiries' };
    }
}
