"use client";

import { TrendingUp, Award, Users } from 'lucide-react';
import { RevealText } from '../ui/RevealText';
import { useOnScreen } from '@/hooks/useOnScreen';

export const FeatureStack = () => {
    const features = [
        { icon: TrendingUp, title: "Future Ready", desc: "Curriculum designed for tomorrow's job market. We focus on skills that are in high demand and future-proof." },
        { icon: Award, title: "Certified Excellence", desc: "Earn recognized certifications that add immense value to your resume and professional profile." },
        { icon: Users, title: "Expert Mentors", desc: "Learn directly from professionals who are currently working in top positions in Logistics and Finance." },
    ];

    return (
        <section className="py-32 relative bg-[#050505]">
            <div className="container mx-auto px-6">
                <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
                    <div className="relative lg:sticky lg:top-32 lg:h-fit">
                        <RevealText>
                            <span className="text-[var(--brand-yellow)] font-mono uppercase tracking-widest text-sm">Why Choose Us</span>
                        </RevealText>
                        <RevealText delay={100}>
                            <h2 className="text-5xl md:text-7xl font-black font-montserrat text-white mt-4 mb-8 leading-tight">
                                WE BUILD <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--brand-yellow)] to-white">CAREERS</span>, NOT <br />
                                JUST RESUMES.
                            </h2>
                        </RevealText>
                        <RevealText delay={200}>
                            <p className="text-gray-400 text-lg max-w-md leading-relaxed">
                                Elevate U is built on the foundation of practical skills. We strip away the theory that doesn't matter and focus 100% on what gets you hired.
                            </p>
                        </RevealText>
                    </div>

                    <div className="space-y-16 lg:space-y-32 pt-8 lg:pt-12">
                        {features.map((f, i) => {
                            // eslint-disable-next-line react-hooks/rules-of-hooks
                            const [ref, visible] = useOnScreen({ threshold: 0.5 });
                            return (
                                <div
                                    key={i}
                                    ref={ref}
                                    className={`transition-all duration-700 transform ${visible ? 'opacity-100 translate-y-0' : 'opacity-20 translate-y-20'}`}
                                >
                                    <div className="w-20 h-20 rounded-2xl bg-[#111] border border-gray-800 flex items-center justify-center text-[var(--brand-yellow)] mb-6 shadow-[0_0_30px_rgba(255,212,0,0.1)]">
                                        <f.icon size={40} />
                                    </div>
                                    <h3 className="text-3xl font-bold text-white mb-4 font-montserrat">{f.title}</h3>
                                    <p className="text-gray-400 text-xl leading-relaxed border-l-2 border-[var(--brand-yellow)] pl-6">
                                        {f.desc}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
};
