"use client";

import { useActionState } from 'react'; // React 19 / Next.js 15
// If using Next 14, import { useFormState } from 'react-dom'; but package.json says react 19.
import { createAdminUser } from '@/app/actions/admin-actions';
import { MagneticButton } from '@/components/ui/MagneticButton';
import { Loader2 } from 'lucide-react';
import { useFormStatus } from 'react-dom';

const initialState = {
    success: false,
    message: '',
};

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <MagneticButton variant="primary" type="submit" disabled={pending} className="w-full justify-center">
            {pending ? <Loader2 className="animate-spin mr-2" /> : null}
            {pending ? 'Creating...' : 'Create Admin'}
        </MagneticButton>
    )
}

export function CreateAdminForm() {
    const [state, formAction] = useActionState(createAdminUser, initialState);

    return (
        <form action={formAction} className="space-y-4 max-w-md">
            <div>
                <label className="block text-sm text-gray-400 mb-1">Name</label>
                <input name="name" type="text" required className="w-full bg-black border border-gray-800 rounded-lg p-3 text-white focus:border-[var(--brand-yellow)] outline-none" placeholder="Jane Doe" />
                {state.message && typeof state.message === 'object' && state.message.name && (
                    <p className="text-red-500 text-xs mt-1">{state.message.name}</p>
                )}
            </div>

            <div>
                <label className="block text-sm text-gray-400 mb-1">Email</label>
                <input name="email" type="email" required className="w-full bg-black border border-gray-800 rounded-lg p-3 text-white focus:border-[var(--brand-yellow)] outline-none" placeholder="jane@elevateu.com" />
                {state.message && typeof state.message === 'object' && state.message.email && (
                    <p className="text-red-500 text-xs mt-1">{state.message.email}</p>
                )}
            </div>

            <div>
                <label className="block text-sm text-gray-400 mb-1">Password</label>
                <input name="password" type="password" required minLength={6} className="w-full bg-black border border-gray-800 rounded-lg p-3 text-white focus:border-[var(--brand-yellow)] outline-none" placeholder="••••••••" />
                {state.message && typeof state.message === 'object' && state.message.password && (
                    <p className="text-red-500 text-xs mt-1">{state.message.password}</p>
                )}
            </div>

            <div className="pt-2">
                <SubmitButton />
            </div>

            {state.message && typeof state.message === 'string' && (
                <p className={`text-sm text-center ${state.success ? 'text-green-500' : 'text-red-500'}`}>
                    {state.message}
                </p>
            )}
        </form>
    );
}
