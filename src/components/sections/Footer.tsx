"use client";

import { Phone, MapPin, Mail } from 'lucide-react';
import { ContactSection } from './ContactSection';

export const Footer = () => {
    return (
        <>
            <section id="contact" className="py-32 bg-black relative border-t border-gray-900">
                <div className="container mx-auto px-6 grid lg:grid-cols-2 gap-20">
                    <div>
                        <h2 className="text-6xl md:text-8xl font-black font-montserrat mb-12 leading-[0.8] tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-800">
                            READY TO<br />ASCEND?
                        </h2>
                        <div className="space-y-8">
                            <div className="flex items-center gap-6 group">
                                <div className="w-16 h-16 rounded-full border border-gray-800 flex items-center justify-center text-white group-hover:bg-[var(--brand-yellow)] group-hover:text-black transition-all">
                                    <Phone size={24} />
                                </div>
                                <div>
                                    <p className="text-gray-500 text-sm uppercase tracking-widest">Call Us</p>
                                    <p className="text-2xl font-bold font-mono">80756 47771</p>
                                    <p className="text-xl font-bold font-mono text-gray-400 group-hover:text-white transition-colors">70343 34489</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-6 group">
                                <div className="w-16 h-16 rounded-full border border-gray-800 flex items-center justify-center text-white group-hover:bg-[var(--brand-yellow)] group-hover:text-black transition-all">
                                    <Mail size={24} />
                                </div>
                                <div>
                                    <p className="text-gray-500 text-sm uppercase tracking-widest">Email Us</p>
                                    <p className="text-xl font-bold break-all">elevateuacademy25@gmail.com</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-6 group">
                                <div className="w-16 h-16 rounded-full border border-gray-800 flex items-center justify-center text-white group-hover:bg-[var(--brand-yellow)] group-hover:text-black transition-all">
                                    <MapPin size={24} />
                                </div>
                                <div>
                                    <p className="text-gray-500 text-sm uppercase tracking-widest">Visit Campus</p>
                                    <p className="text-lg font-bold leading-tight max-w-xs text-gray-200">
                                        3rd Floor Paragon Tower,<br />
                                        On top of Royal Enfield showroom,<br />
                                        Near Lulu Mall, Mankave, Calicut.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <ContactSection />
                </div>
            </section>

            <footer className="py-8 text-center text-gray-600 text-sm border-t border-gray-900 bg-black">
                <p>&copy; 2025 Elevate U Academy. All rights reserved.</p>
            </footer>
        </>
    );
};
