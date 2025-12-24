"use client";

import { ArrowUpRight, ChevronDown, PlayCircle } from 'lucide-react';
import { MagneticButton } from '../ui/MagneticButton';
import { RevealText } from '../ui/RevealText';

export const Hero = () => {
    return (
        <header className="min-h-screen flex items-center relative overflow-hidden pt-20">
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[var(--brand-yellow)] rounded-full blur-3xl md:blur-[180px] opacity-10 -translate-y-1/2 translate-x-1/2 animate-pulse"></div>

            <div className="container mx-auto px-6 relative z-10">
                <div className="max-w-5xl">
                    <RevealText delay={0}>
                        <div className="flex items-center gap-4 mb-6">
                            <span className="w-12 h-[1px] bg-[var(--brand-yellow)]"></span>
                            <span className="text-[var(--brand-yellow)] font-mono uppercase tracking-widest text-sm">Admissions Open 2025</span>
                        </div>
                    </RevealText>

                    <RevealText delay={100}>
                        <h1 className="text-6xl md:text-8xl lg:text-9xl font-black font-montserrat leading-[0.9] mb-8 tracking-tight">
                            ELEVATE <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-200 to-gray-500">YOURSELF</span>.
                        </h1>
                    </RevealText>

                    <RevealText delay={200}>
                        <p className="text-xl text-gray-300 max-w-2xl leading-relaxed mb-12 border-l border-gray-800 pl-6">
                            The gap between education and employment ends here.
                            Practical training in <span className="text-white font-bold">Logistics</span> & <span className="text-white font-bold">Finance</span> designed to get you hired.
                        </p>
                    </RevealText>

                    <div className="flex flex-col md:flex-row gap-6">
                        <MagneticButton variant="primary" onClick={() => document.getElementById('courses')?.scrollIntoView({ behavior: 'smooth' })}>
                            Explore Courses <ArrowUpRight className="ml-2" size={20} />
                        </MagneticButton>
                        <MagneticButton variant="outline">
                            <PlayCircle className="mr-2" size={20} /> Watch Video
                        </MagneticButton>
                    </div>
                </div>
            </div>

            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-50 animate-bounce">
                <span className="text-[10px] uppercase tracking-widest">Scroll</span>
                <ChevronDown />
            </div>
        </header>
    );
};
