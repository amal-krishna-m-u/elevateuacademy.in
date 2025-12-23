"use client";

import { useEffect, useRef } from 'react';

export const CustomCursor = () => {
    const cursorRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Hide system cursor when this component is mounted
        document.documentElement.classList.add('hide-system-cursor');

        const moveCursor = (e: MouseEvent) => {
            if (cursorRef.current) {
                cursorRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
            }
        };
        window.addEventListener('mousemove', moveCursor);

        return () => {
            window.removeEventListener('mousemove', moveCursor);
            // Restore system cursor when component logic unmounts
            document.documentElement.classList.remove('hide-system-cursor');
        };
    }, []);

    return (
        <div
            ref={cursorRef}
            className="fixed top-0 left-0 w-4 h-4 bg-[var(--brand-yellow)] rounded-full pointer-events-none z-[9999] mix-blend-difference hidden md:block -mt-2 -ml-2 transition-transform duration-75 ease-out"
        />
    );
};
