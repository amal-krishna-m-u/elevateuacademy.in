import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Course } from '@/lib/contentful';

interface CourseCardProps {
    course: Course;
    mode?: 'link' | 'modal';
    onClick?: () => void;
}

export const CourseCard = ({ course, mode = 'link', onClick }: CourseCardProps) => {
    const CardContent = () => (
        <>
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/80 z-10"></div>

            {/* Hover Glow Effect */}
            <div className="absolute -inset-full bg-[var(--brand-yellow)] opacity-0 group-hover:opacity-10 blur-[100px] transition-opacity duration-500"></div>

            <div className="relative z-20 p-10 h-full flex flex-col">
                <div className="flex justify-between items-start mb-8">
                    <span className="px-4 py-1 rounded-full border border-gray-700 text-xs uppercase tracking-widest text-gray-300">
                        {course.category}
                    </span>
                    <span className="text-[var(--brand-yellow)] font-mono">{course.duration}</span>
                </div>

                <h3 className="text-4xl font-bold font-montserrat mb-4 leading-tight group-hover:text-[var(--brand-yellow)] transition-colors">
                    {course.title}
                </h3>

                <p className="text-gray-400 mb-8 leading-relaxed line-clamp-3">
                    {course.description}
                </p>

                <div className="mt-auto pt-8 border-t border-gray-800 flex justify-between items-center">
                    <div className="flex gap-2">
                        {course.tools.slice(0, 3).map((t, i) => (
                            <span key={i} className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-[10px] text-gray-300" title={t}>
                                {t[0]}
                            </span>
                        ))}
                    </div>
                    <span className="flex items-center gap-2 font-bold uppercase tracking-wider text-sm hover:text-[var(--brand-yellow)] transition-colors z-30">
                        View Syllabus <ArrowRight size={16} />
                    </span>
                </div>
            </div>
        </>
    );

    const containerClasses = "group relative bg-[#111] border border-gray-800 rounded-3xl overflow-hidden hover:border-[var(--brand-yellow)] transition-all duration-500 flex flex-col h-full text-left w-full";

    if (mode === 'modal') {
        return (
            <button onClick={onClick} className={containerClasses}>
                <CardContent />
            </button>
        );
    }

    return (
        <Link href={`/courses/${course.slug}`} className={containerClasses}>
            <CardContent />
        </Link>
    );
};
