"use client";

import { useEffect, useRef } from 'react';

interface TurnstileWidgetProps {
    siteKey: string;
    onVerify: (token: string) => void;
}

declare global {
    interface Window {
        turnstile?: {
            render: (element: HTMLElement, options: any) => string;
            reset: (widgetId: string) => void;
        };
        onTurnstileLoad?: () => void;
    }
}

export default function TurnstileWidget({ siteKey, onVerify }: TurnstileWidgetProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const widgetId = useRef<string | null>(null);

    // Use ref for onVerify to prevent re-running effect when parent function changes
    const onVerifyRef = useRef(onVerify);

    // Update ref when prop changes
    useEffect(() => {
        onVerifyRef.current = onVerify;
    }, [onVerify]);

    useEffect(() => {
        // Function to render the widget
        const renderWidget = () => {
            if (window.turnstile && containerRef.current && !widgetId.current) {
                widgetId.current = window.turnstile.render(containerRef.current, {
                    sitekey: siteKey,
                    callback: (token: string) => onVerifyRef.current(token),
                    'expired-callback': () => onVerifyRef.current(''),
                    'error-callback': () => onVerifyRef.current(''),
                    theme: 'dark', // Matches our dark UI
                });
            }
        };

        // Load Script if not present
        if (!document.getElementById('turnstile-script')) {
            const script = document.createElement('script');
            script.id = 'turnstile-script';
            script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?onload=onTurnstileLoad';
            script.async = true;
            script.defer = true;
            document.head.appendChild(script);

            window.onTurnstileLoad = renderWidget;
        } else if (window.turnstile) {
            renderWidget();
        }

        return () => {
            // Cleanup if needed, but usually we keep the script. 
            // We could reset the widget on unmount if we wanted.
            if (widgetId.current && window.turnstile) {
                try {
                    window.turnstile.reset(widgetId.current);
                    widgetId.current = null;
                } catch (e) {
                    // Ignore reset errors
                }
            }
            // Don't remove the script tag as other components might use it
        };
    }, [siteKey]); // Removed onVerify from dependency array

    return (
        <div ref={containerRef} className="min-h-[65px] flex items-center justify-center" />
    );
}
