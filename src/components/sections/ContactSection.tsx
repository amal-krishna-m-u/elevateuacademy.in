"use client";

import { useActionState, useState } from 'react';
import { MagneticButton } from '../ui/MagneticButton';
import { submitEnquiry } from '@/app/actions';
import { Loader2 } from 'lucide-react';
import TurnstileWidget from '../ui/TurnstileWidget';

const initialState = {
    success: false,
    message: "",
};

function SubmitButton() {
    const { pending } = useFormStatus();

    return (
        <MagneticButton variant="primary" className="w-full justify-center" type="submit" disabled={pending}>
            {pending ? <Loader2 className="animate-spin mr-2" /> : null}
            {pending ? 'Submitting...' : 'Submit Application'}
        </MagneticButton>
    )
}

// Temporary: React 19 useActionState might be named differently in some Next.js RC versions or shimmed. 
// Standard hook in Next 14 is useFormState from react-dom.
// Since package.json says "react": "19.2.3", we should use `useActionState` (React 19) or `useFormState` (React 18 compat).
// IMPORTANT: `useActionState` is React 19.
import { useFormStatus } from 'react-dom';

export const ContactSection = () => {
    const [state, formAction] = useActionState(submitEnquiry, initialState);
    const [turnstileToken, setTurnstileToken] = useState('');

    return (
        <div className="bg-[#111] p-10 rounded-3xl border border-gray-800 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--brand-yellow)] blur-[80px] opacity-20"></div>
            <h3 className="text-2xl font-bold mb-8 text-white">Quick Enquiry</h3>

            {state.success ? (
                <div className="bg-green-900/20 border border-green-800 p-6 rounded-2xl text-center">
                    <h4 className="text-xl font-bold text-green-500 mb-2">Application Received!</h4>
                    <p className="text-gray-300">We'll get back to you shortly.</p>
                </div>
            ) : (
                <form className="space-y-6" action={formAction}>
                    <div>
                        <input name="name" type="text" placeholder="Your Name" required className="w-full bg-[#050505] border border-gray-800 p-4 rounded-xl text-white focus:border-[var(--brand-yellow)] focus:outline-none transition-colors" />
                        {state.message && typeof state.message === 'object' && state.message.name && (
                            <p className="text-red-500 text-sm mt-1">{state.message.name}</p>
                        )}
                    </div>
                    <div>
                        <input name="phone" type="tel" placeholder="Phone Number" required className="w-full bg-[#050505] border border-gray-800 p-4 rounded-xl text-white focus:border-[var(--brand-yellow)] focus:outline-none transition-colors" />
                        {state.message && typeof state.message === 'object' && state.message.phone && (
                            <p className="text-red-500 text-sm mt-1">{state.message.phone}</p>
                        )}
                    </div>
                    <div>
                        <select name="course" aria-label="Select Course" className="w-full bg-[#050505] border border-gray-800 p-4 rounded-xl text-white focus:border-[var(--brand-yellow)] focus:outline-none transition-colors appearance-none">
                            <option value="">Select Course...</option>
                            <option value="Logistics & Supply Chain">Logistics & Supply Chain</option>
                            <option value="Accounting & Finance">Accounting & Finance</option>
                        </select>
                    </div>
                    {/* Honeypot Field (Hidden) to trap bots */}
                    {/* Honeypot Field (Hidden) to trap bots */}
                    <input
                        type="text"
                        name="confirm_email"
                        style={{ display: 'none' }}
                        tabIndex={-1}
                        autoComplete="off"
                    />

                    {/* Turnstile Widget */}
                    <div className="flex justify-center mb-4">
                        <TurnstileWidget
                            siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || '1x00000000000000000000AA'}
                            onVerify={(token) => setTurnstileToken(token)}
                        />
                    </div>
                    {/* Send token to server */}
                    <input type="hidden" name="cf-turnstile-response" value={turnstileToken} />

                    <SubmitButton />
                    {state.message && typeof state.message === 'string' && (
                        <p className="text-red-500 text-sm text-center">{state.message}</p>
                    )}
                </form>
            )}
        </div>
    );
};
