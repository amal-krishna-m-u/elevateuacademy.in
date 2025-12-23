import { ArrowUpRight } from 'lucide-react';

export const Marquee = () => {
    return (
        <div className="w-full bg-[var(--brand-yellow)] text-black py-4 overflow-hidden relative rotate-1 scale-105 z-20 border-y-4 border-black">
            <div className="flex whitespace-nowrap animate-marquee">
                {[...Array(10)].map((_, i) => (
                    <span key={i} className="mx-8 font-black text-2xl md:text-4xl uppercase tracking-tighter font-montserrat flex items-center gap-4">
                        Upward Movement <ArrowUpRight className="inline" size={32} /> Future Ready <span className="w-4 h-4 bg-black rounded-full inline-block"></span>
                    </span>
                ))}
            </div>
        </div>
    );
};
