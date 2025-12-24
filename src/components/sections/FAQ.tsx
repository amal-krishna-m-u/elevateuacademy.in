"use client";

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { FAQ as FAQType } from '@/lib/contentful';

interface FAQSectionProps {
    faqs: FAQType[];
}

export const FAQSection = ({ faqs }: FAQSectionProps) => {
    const [openIndex, setOpenIndex] = useState<number>(0);

    return (
        <section id="faq" className="py-32 bg-black relative overflow-hidden">
            <div className="absolute top-1/2 left-0 w-96 h-96 bg-[var(--brand-yellow)] rounded-full blur-[150px] opacity-5 -translate-y-1/2 pointer-events-none"></div>

            <div className="container mx-auto px-6 max-w-4xl">
                <div className="text-center mb-20">
                    <span className="text-[var(--brand-yellow)] font-mono uppercase tracking-widest text-sm mb-2 block">Support</span>
                    <h2 className="text-5xl font-black font-montserrat text-white">COMMON QUERIES</h2>
                    <p className="text-gray-300 mt-4 max-w-2xl mx-auto">
                        Everything you need to know about our courses and campus.
                    </p>
                </div>

                <div className="space-y-4">
                    {faqs.map((faq, i) => (
                        <div
                            key={faq.sys.id}
                            className={`border border-gray-800 rounded-2xl overflow-hidden transition-all duration-300 ${openIndex === i ? 'bg-[#111] border-[var(--brand-yellow)] shadow-[0_0_20px_rgba(255,212,0,0.05)]' : 'bg-transparent hover:bg-white/5'}`}
                        >
                            <button
                                onClick={() => setOpenIndex(openIndex === i ? -1 : i)}
                                className="w-full flex justify-between items-center p-6 text-left"
                                aria-expanded={openIndex === i}
                            >
                                <span className={`text-xl font-bold font-montserrat ${openIndex === i ? 'text-[var(--brand-yellow)]' : 'text-white'}`}>
                                    {faq.question}
                                </span>
                                <div className={`p-2 rounded-full border transition-all duration-300 ${openIndex === i ? 'bg-[var(--brand-yellow)] border-[var(--brand-yellow)] text-black rotate-180' : 'border-gray-700 text-gray-500'}`}>
                                    <ChevronDown size={20} />
                                </div>
                            </button>

                            <div
                                className={`transition-all duration-300 ease-in-out overflow-hidden ${openIndex === i ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0'}`}
                            >
                                <div className="px-6 pb-6 text-gray-300 leading-relaxed border-t border-gray-800/50 pt-4">
                                    {faq.answer}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};
