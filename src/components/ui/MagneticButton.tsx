"use client";

import React, { useRef, useState, useEffect, MouseEvent } from 'react';
import clsx from 'clsx';

interface MagneticButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'outline' | 'ghost';
    children: React.ReactNode;
}

export const MagneticButton = ({
    children,
    variant = 'primary',
    className,
    onClick,
    ...props
}: MagneticButtonProps) => {
    const btnRef = useRef<HTMLButtonElement>(null);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        setIsMobile(window.matchMedia('(hover: none) and (pointer: coarse)').matches);
    }, []);

    const handleMouseMove = (e: MouseEvent<HTMLButtonElement>) => {
        if (isMobile || !btnRef.current) return;
        const { clientX, clientY } = e;
        const { left, top, width, height } = btnRef.current.getBoundingClientRect();
        const x = (clientX - (left + width / 2)) * 0.3;
        const y = (clientY - (top + height / 2)) * 0.3;
        setPosition({ x, y });
    };

    const handleMouseLeave = () => {
        setPosition({ x: 0, y: 0 });
    };

    const baseStyle = "relative px-8 py-4 font-bold uppercase tracking-widest text-sm transition-all duration-300 overflow-hidden group cursor-pointer border z-10 rounded-full";

    // Note: Tailwind v4 using CSS vars setup in globals.css
    // Using inline styles for colors that might not be in utility classes yet if dynamic,
    // but we defined --color-brand-yellow.
    // The original code used dynamic template literals like `bg-[${BrandColors.yellow}]`.
    // Here we use the Tailwind utilities we generated.

    const variants = {
        primary: "bg-[var(--brand-yellow)] text-black hover:bg-white border-transparent",
        outline: "border-white/20 text-white hover:border-[var(--brand-yellow)] hover:text-[var(--brand-yellow)]",
        ghost: "border-transparent text-white hover:text-[var(--brand-yellow)]",
    };

    return (
        <button
            ref={btnRef}
            onClick={onClick}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{ transform: `translate(${position.x}px, ${position.y}px)` }}
            className={clsx(baseStyle, variants[variant], className, "ease-out")}
            {...props}
        >
            <span className="relative z-10 flex items-center gap-2">{children}</span>
        </button>
    );
};
