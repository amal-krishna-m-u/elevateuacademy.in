"use client";

import { useOnScreen } from '@/hooks/useOnScreen';

interface RevealTextProps {
    children: React.ReactNode;
    delay?: number;
    className?: string;
}

export const RevealText = ({ children, delay = 0, className = "" }: RevealTextProps) => {
    const [ref, visible] = useOnScreen({ threshold: 0.1 });

    return (
        <div ref={ref} className={`overflow-hidden ${className}`}>
            <div
                className={`transition-transform duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] ${visible ? 'translate-y-0' : 'translate-y-full'}`}
                style={{ transitionDelay: `${delay}ms` }}
            >
                {children}
            </div>
        </div>
    );
};
