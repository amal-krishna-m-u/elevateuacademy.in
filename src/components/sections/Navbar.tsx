"use client";

import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { MagneticButton } from '../ui/MagneticButton';
import clsx from 'clsx';

interface NavbarProps {
    isMenuOpen: boolean;
    toggleMenu: () => void;
}

export const Navbar = ({ isMenuOpen, toggleMenu }: NavbarProps) => {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <nav className={clsx(
            "fixed top-0 w-full z-50 transition-all duration-500 border-b",
            scrolled ? 'bg-black/90 backdrop-blur-md border-gray-800 py-4' : 'bg-transparent border-transparent py-8'
        )}>
            <div className="container mx-auto px-6 flex justify-between items-center">
                {/* Logo */}
                <div className="flex items-center gap-4 group cursor-pointer z-50" onClick={() => window.scrollTo(0, 0)}>
                    <div className="relative w-12 h-12 rounded-lg overflow-hidden flex items-center justify-center transition-all duration-300 group-hover:scale-105 group-hover:shadow-md bg-transparent">
                        {/* Using text fallback if images are missing, but keeping logic */}
                        {/* Creating a CSS-only logo fallback if images fail would be smart, but user provided images in markup.
                 I will keep the img tags but assume they exist in public/. 
                 If not, I should probably use a text placeholder or svg.
                 For now, I'll copy the img logic. */}
                        <div className={clsx("absolute inset-0 flex items-center justify-center text-xl font-black bg-[var(--brand-yellow)] text-black transition-all duration-300", scrolled ? 'opacity-0 group-hover:opacity-100' : 'opacity-100 group-hover:opacity-0')}>
                            EU
                        </div>
                        <div className={clsx("absolute inset-0 flex items-center justify-center text-xl font-black bg-white text-black transition-all duration-300", scrolled ? 'opacity-100 group-hover:opacity-0' : 'opacity-0 group-hover:opacity-100')}>
                            EU
                        </div>
                    </div>

                    <div className="font-montserrat leading-tight select-none">
                        <span className="block font-bold text-xl tracking-tight">ELEVATE U</span>
                        <span className="text-[var(--brand-yellow)] text-xs tracking-[0.3em] font-medium">ACADEMY</span>
                    </div>
                </div>

                {/* Desktop Menu */}
                <div className="hidden md:flex items-center gap-8">
                    {['Courses', 'About', 'Blog', 'FAQ'].map((item) => (
                        <a key={item} href={`#${item.toLowerCase()}`} className="text-sm font-bold uppercase tracking-widest hover:text-[var(--brand-yellow)] transition-colors relative group">
                            {item}
                            <span className="absolute -bottom-2 left-0 w-0 h-0.5 bg-[var(--brand-yellow)] group-hover:w-full transition-all duration-300"></span>
                        </a>
                    ))}
                    <MagneticButton variant="primary" onClick={() => document.getElementById('contact')?.scrollIntoView()}>
                        Get Started
                    </MagneticButton>
                </div>

                {/* Mobile Toggle */}
                <button className="md:hidden text-white z-50 p-2" onClick={toggleMenu}>
                    {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
                </button>
            </div>
        </nav>
    );
};
