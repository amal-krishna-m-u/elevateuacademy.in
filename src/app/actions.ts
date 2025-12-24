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
    const honeypot = formData.get('confirm_email');
    if (honeypot) {
        return { success: true, message: 'Enquiry submitted successfully!' };
    }

    // 🤖 Bot Protection: Cloudflare Turnstile
    const token = formData.get('cf-turnstile-response');
    if (!token) {
        return { success: false, message: 'Please complete the bot challenge.' };
    }

    // Verify Token with Cloudflare
    // Using dummy secret for dev/build if not set, or process.env.TURNSTILE_SECRET_KEY
    const secretKey = process.env.TURNSTILE_SECRET_KEY || '1x0000000000000000000000000000000AA'; // Standard Test Secret

    // Note: In strict production we must enforce this check. 
    // We'll wrap in try/catch to not crash if network fails, but default to fail safe.
    try {
        const verifyRes = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
            method: 'POST',
            body: JSON.stringify({
                secret: secretKey,
                response: token,
            }),
            headers: { 'Content-Type': 'application/json' },
        });

        const verifyData = await verifyRes.json();
        if (!verifyData.success) {
            return { success: false, message: 'Bot validation failed. Please try again.' };
        }
    } catch (err) {
        console.error('Turnstile Verification Error:', err);
        // Fail open or closed? Better fail open for user UX if external service is down? 
        // Or fail closed for security? 
        // User instruction: "If success === false, return 'Bot detected' error."
        // I will return error on catch to be safe.
        return { success: false, message: 'Validation service unavailable.' };
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

import { auth } from '@/auth';

export async function deleteEnquiries(ids: string[]) {
    const session = await auth();
    // Check 1: Is user logged in?
    // Check 2: Does user have the 'admin' role?
    if (!session?.user || (session.user as any).role !== 'admin') {
        return {
            success: false,
            message: "Unauthorized: You do not have permission to perform this action."
        };
    }

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
