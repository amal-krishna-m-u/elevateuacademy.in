"use client";

import { useState, useEffect } from 'react';
import { useOnScreen } from '@/hooks/useOnScreen';

interface RevealTextProps {
    children: React.ReactNode;
    delay?: number;
    className?: string;
}

export const RevealText = ({ children, delay = 0, className = "" }: RevealTextProps) => {
    const [ref, observerVisible] = useOnScreen({ threshold: 0.1 });
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        // Force visible on mobile to prevent scroll lag/white space
        const checkMobile = () => setIsMobile(window.matchMedia('(max-width: 768px)').matches);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const visible = isMobile ? true : observerVisible;

    return (
        <div ref={ref} className={`overflow-hidden ${className}`}>
            <div
                className={`transition-transform duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] ${visible ? 'translate-y-0' : 'translate-y-full'}`}
                style={{ transitionDelay: isMobile ? '0ms' : `${delay}ms` }}
            >
                {children}
            </div>
        </div>
    );
};
