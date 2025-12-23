import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { CourseCard } from '../ui/CourseCard';
import { Course } from '@/lib/contentful';

interface ProgramsProps {
    courses: Course[];
    onItemClick?: (course: Course) => void;
    mode?: 'link' | 'modal';
}

export const Programs = ({ courses, onItemClick, mode = 'link' }: ProgramsProps) => {
    return (
        <section id="courses" className="py-32 bg-[#0a0a0a]">
            {/* ... header ... */}
            <div className="container mx-auto px-6">
                <div className="flex justify-between items-end mb-20">
                    <div>
                        <h2 className="text-5xl font-black font-montserrat mb-4">OUR PROGRAMS</h2>
                        <div className="w-24 h-1 bg-[var(--brand-yellow)]"></div>
                    </div>
                    {/* View All Button for Home Page */}
                    {mode === 'modal' && (
                        <Link href="/courses" className="hidden md:flex items-center gap-2 text-gray-500 hover:text-[var(--brand-yellow)] transition-colors font-mono uppercase tracking-widest text-sm">
                            Explore Courses <ArrowRight size={16} />
                        </Link>
                    )}
                    <p className="hidden md:block text-gray-500 max-w-sm text-right">
                        Specialized diploma courses tailored for high-growth industries.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                    {courses.map((course) => (
                        <CourseCard
                            key={course.sys.id}
                            course={course}
                            mode={mode}
                            onClick={() => onItemClick?.(course)}
                        />
                    ))}
                </div>

                {mode === 'modal' && (
                    <div className="mt-12 flex justify-center md:hidden">
                        <Link href="/courses" className="flex items-center gap-2 text-[var(--brand-yellow)] font-bold uppercase tracking-wider">
                            Explore Courses <ArrowRight size={16} />
                        </Link>
                    </div>
                )}
            </div>
        </section>
    );
};
