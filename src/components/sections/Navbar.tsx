"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Menu, X } from 'lucide-react';
import { MagneticButton } from '../ui/MagneticButton';
import clsx from 'clsx';
import Link from 'next/link';

export const Navbar = () => {
    const [scrolled, setScrolled] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

    const navItems = [
        { label: 'Courses', href: '/courses' },
        { label: 'About', href: '/#about' },
        { label: 'FAQ', href: '/#faq' }
    ];

    return (
        <>
            <nav className={clsx(
                "fixed top-0 w-full z-50 transition-all duration-500 border-b",
                // Revert to Dark Theme: Black/95 on scroll, transparent at top
                scrolled ? 'bg-black/95 md:bg-black/90 md:backdrop-blur-md border-gray-800 py-3' : 'bg-transparent border-transparent py-8'
            )}>
                <div className="container mx-auto px-6 flex justify-between items-center">
                    {/* Logo - Zoomed Content, Black/Yellow (No Filter) */}
                    {/* Logo - Zoomed Content, Black/Yellow (No Filter) */}
                    <Link href="/" className="flex items-center gap-4 group cursor-pointer z-50 py-2" aria-label="Home">
                        {/* Logo Container: Constrained height to keep navbar small */}
                        <div className={clsx(
                            "relative flex items-center justify-start transition-all duration-500 bg-transparent",
                            // Scroll: h-12 (48px) mobile, h-16 (64px) desktop -> keeps navbar small
                            // Top: h-16 mobile, h-24 desktop -> respectable size but not huge
                            scrolled ? "w-48 h-12 md:w-80 md:h-16" : "w-64 h-16 md:w-96 md:h-24"
                        )}>
                            {/* Fixed Ambient Light (White) - Increased opacity for visibility */}
                            <div className="absolute top-1/2 left-0 w-[600px] h-[600px] bg-white/40 rounded-full blur-[100px] -translate-y-1/2 -translate-x-1/2 -z-10 pointer-events-none"></div>

                            <Image
                                src="/brand_logo.svg"
                                alt="Elevate U Logo"
                                fill
                                className={clsx(
                                    "object-contain object-left transition-all duration-500 origin-left",
                                    // Zoom effect
                                    "scale-[1.8]",
                                    // Removed stacked filters, relying on Ambient Light
                                    "drop-shadow-sm"
                                )}
                            />
                        </div>
                    </Link>

                    {/* Desktop Menu - Revert to White Text */}
                    <div className="hidden md:flex items-center gap-8">
                        {navItems.map((item) => (
                            <Link key={item.label} href={item.href} className="text-sm font-bold uppercase tracking-widest text-white hover:text-[var(--brand-yellow)] transition-colors relative group">
                                {item.label}
                                <span className="absolute -bottom-2 left-0 w-0 h-0.5 bg-[var(--brand-yellow)] group-hover:w-full transition-all duration-300"></span>
                            </Link>
                        ))}
                        <MagneticButton variant="primary" onClick={() => document.getElementById('contact')?.scrollIntoView()}>
                            Get Started
                        </MagneticButton>
                    </div>

                    {/* Mobile Toggle */}
                    <button className="md:hidden text-white z-50 p-2" onClick={toggleMenu} aria-label="Toggle Menu">
                        {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
                    </button>
                </div>
            </nav>

            {/* Mobile Fullscreen Menu */}
            <div className={`fixed inset-0 bg-black z-40 transition-transform duration-300 ease-in-out md:hidden flex flex-col items-center justify-center gap-8 ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                <Link href="/" onClick={toggleMenu} className="text-3xl font-black font-montserrat uppercase text-white hover:text-[var(--brand-yellow)] transition-colors">Home</Link>
                {navItems.map((item) => (
                    <Link
                        key={item.label}
                        href={item.href}
                        onClick={toggleMenu}
                        className="text-3xl font-black font-montserrat uppercase text-white hover:text-[var(--brand-yellow)] transition-colors"
                    >
                        {item.label}
                    </Link>
                ))}
                <div className="mt-8">
                    <MagneticButton variant="primary" onClick={() => { toggleMenu(); document.getElementById('contact')?.scrollIntoView(); }}>
                        Enquire Now
                    </MagneticButton>
                </div>
            </div>
        </>
    );
};
