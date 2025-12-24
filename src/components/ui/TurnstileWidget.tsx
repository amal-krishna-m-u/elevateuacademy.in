"use client";

import { useEffect, useRef, useState } from 'react';

interface TurnstileWidgetProps {
    siteKey: string;
    onVerify: (token: string) => void;
}

declare global {
    interface Window {
        turnstile?: {
            render: (element: HTMLElement, options: any) => string;
            reset: (widgetId: string) => void;
            remove: (widgetId: string) => void;
            getResponse: (widgetId: string) => string | undefined;
        };
        onTurnstileLoad?: () => void;
    }
}

export default function TurnstileWidget({ siteKey, onVerify }: TurnstileWidgetProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const widgetId = useRef<string | null>(null);
    const [scriptLoaded, setScriptLoaded] = useState(false);

    // Use ref for onVerify to prevent re-running effect when parent function changes
    const onVerifyRef = useRef(onVerify);

    useEffect(() => {
        onVerifyRef.current = onVerify;
    }, [onVerify]);

    useEffect(() => {
        let cancelled = false;

        const cleanupWidget = () => {
            if (widgetId.current && window.turnstile) {
                window.turnstile.remove(widgetId.current);
                widgetId.current = null;
            }
            // Also ensure container is empty to be safe against double appends
            if (containerRef.current) {
                containerRef.current.innerHTML = '';
            }
        };

        const renderWidget = () => {
            if (cancelled) return;
            if (!containerRef.current || !window.turnstile) return;

            // Clean up any existing widget before rendering a new one
            if (widgetId.current) {
                window.turnstile.remove(widgetId.current);
            }

            try {
                const id = window.turnstile.render(containerRef.current, {
                    sitekey: siteKey,
                    callback: (token: string) => {
                        if (!cancelled) onVerifyRef.current(token);
                    },
                    'expired-callback': () => {
                        if (!cancelled) onVerifyRef.current('');
                    },
                    'error-callback': () => {
                        if (!cancelled) onVerifyRef.current('');
                    },
                    theme: 'dark',
                });
                widgetId.current = id;
            } catch (e) {
                console.error("Turnstile render error", e);
            }
        };

        // Check if script is already loaded
        if (window.turnstile) {
            renderWidget();
        } else {
            // Setup Global Callback
            const existingOnLoad = window.onTurnstileLoad;
            window.onTurnstileLoad = () => {
                if (existingOnLoad) existingOnLoad();
                setScriptLoaded(true); // Trigger re-run
            };

            // Inject Script if missing
            if (!document.getElementById('turnstile-script')) {
                const script = document.createElement('script');
                script.id = 'turnstile-script';
                script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?onload=onTurnstileLoad';
                script.async = true;
                script.defer = true;
                document.head.appendChild(script);
            }
        }

        return () => {
            cancelled = true;
            cleanupWidget();
        };
    }, [siteKey, scriptLoaded]); // Re-run when script loads

    return (
        <div ref={containerRef} className="min-h-[65px] flex items-center justify-center w-full" />
    );
}
