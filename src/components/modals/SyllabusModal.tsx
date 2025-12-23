"use client";

import { X, BookOpen, Award, Star, Monitor } from 'lucide-react';
import { MagneticButton } from '../ui/MagneticButton';
import { Course } from '@/lib/contentful';
import clsx from 'clsx';

interface SyllabusModalProps {
    course: Course | null;
    isOpen: boolean;
    onClose: () => void;
}

export const SyllabusModal = ({ course, isOpen, onClose }: SyllabusModalProps) => {
    if (!isOpen || !course) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-0 md:p-4 text-left">
            <div className="absolute inset-0 bg-black/90 backdrop-blur-md" onClick={onClose}></div>
            <div className="bg-[#111] w-full h-[100dvh] md:h-auto md:max-h-[90vh] md:max-w-5xl overflow-y-auto relative md:border md:border-gray-800 md:rounded-2xl shadow-2xl animate-in fade-in zoom-in duration-300">

                <div className="p-6 md:p-12 border-b border-gray-800 sticky top-0 bg-[#111]/95 backdrop-blur z-20 flex justify-between items-start">
                    <div>
                        <span className="text-[var(--brand-yellow)] font-mono text-xs uppercase tracking-[0.2em] mb-2 block">Comprehensive Syllabus</span>
                        <h2 className="text-2xl md:text-5xl font-black font-montserrat text-white leading-tight">{course.title}</h2>
                    </div>
                    <button onClick={onClose} className="bg-white/10 hover:bg-[var(--brand-yellow)] hover:text-black text-white p-2 rounded-full transition-all flex-shrink-0 ml-4">
                        <X size={24} />
                    </button>
                </div>

                <div className="p-8 md:p-12 grid md:grid-cols-12 gap-12">
                    <div className="md:col-span-7 space-y-8">
                        <h3 className="text-2xl font-bold text-white flex items-center gap-3">
                            <BookOpen className="text-[var(--brand-yellow)]" /> Core Modules
                        </h3>
                        <div className="space-y-4">
                            {course.modules.map((mod, i) => (
                                <div key={i} className="group flex items-start gap-4 p-4 rounded-xl border border-gray-800 hover:border-[var(--brand-yellow)] hover:bg-white/5 transition-all">
                                    <span className="text-gray-500 font-mono text-sm group-hover:text-[var(--brand-yellow)]">0{i + 1}</span>
                                    <span className="text-gray-200 font-medium text-lg">{mod}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="md:col-span-5 space-y-10">
                        <div className="bg-[var(--brand-yellow)] p-8 rounded-2xl text-black relative overflow-hidden">
                            <div className="absolute -right-10 -bottom-10 opacity-10">
                                <Award size={150} />
                            </div>
                            <h3 className="text-xl font-bold mb-4 uppercase tracking-wider border-b border-black/20 pb-2">Includes</h3>
                            <ul className="space-y-3 font-medium">
                                {course.highlights.map((h, i) => (
                                    <li key={i} className="flex items-center gap-2">
                                        <Star size={18} fill="black" /> {h}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div>
                            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                                <Monitor className="text-[var(--brand-yellow)]" /> Tools & Tech
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {course.tools.map((t, i) => (
                                    <span key={i} className="px-3 py-1 rounded-full border border-gray-700 text-gray-300 text-sm hover:border-white transition-colors cursor-default">
                                        {t}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="p-8 border-t border-gray-800 flex justify-center">
                    <MagneticButton variant="primary" onClick={() => { onClose(); document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' }) }}>
                        Enquire For Admission
                    </MagneticButton>
                </div>
            </div>
        </div>
    );
};
