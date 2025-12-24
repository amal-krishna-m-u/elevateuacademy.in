"use client";

import { useState, useEffect } from 'react';
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
        { label: 'Blog', href: '/blog' },
        { label: 'About', href: '/#about' },
        { label: 'FAQ', href: '/#faq' }
    ];

    return (
        <>
            <nav className={clsx(
                "fixed top-0 w-full z-50 transition-all duration-500 border-b",
                scrolled ? 'bg-black/95 md:bg-black/90 md:backdrop-blur-md border-gray-800 py-4' : 'bg-transparent border-transparent py-8'
            )}>
                <div className="container mx-auto px-6 flex justify-between items-center">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-4 group cursor-pointer z-50">
                        <div className="relative w-12 h-12 rounded-lg overflow-hidden flex items-center justify-center transition-all duration-300 group-hover:scale-105 group-hover:shadow-md bg-transparent">
                            <div className={clsx("absolute inset-0 flex items-center justify-center text-xl font-black bg-[var(--brand-yellow)] text-black transition-all duration-300", scrolled ? 'opacity-0 group-hover:opacity-100' : 'opacity-100 group-hover:opacity-0')}>
                                EU
                            </div>
                            <div className={clsx("absolute inset-0 flex items-center justify-center text-xl font-black bg-white text-black transition-all duration-300", scrolled ? 'opacity-100 group-hover:opacity-0' : 'opacity-0 group-hover:opacity-100')}>
                                EU
                            </div>
                        </div>

                        <div className="font-montserrat leading-tight select-none">
                            <span className="block font-bold text-xl tracking-tight text-white">ELEVATE U</span>
                            <span className="text-[var(--brand-yellow)] text-xs tracking-[0.3em] font-medium">ACADEMY</span>
                        </div>
                    </Link>

                    {/* Desktop Menu */}
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
