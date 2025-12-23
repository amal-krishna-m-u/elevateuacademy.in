import { CourseCard } from '../ui/CourseCard';
import { Course } from '@/lib/contentful';

interface ProgramsProps {
    courses: Course[];
}

export const Programs = ({ courses }: ProgramsProps) => {
    return (
        <section id="courses" className="py-32 bg-[#0a0a0a]">
            {/* ... header ... */}
            <div className="container mx-auto px-6">
                <div className="flex justify-between items-end mb-20">
                    <div>
                        <h2 className="text-5xl font-black font-montserrat mb-4">OUR PROGRAMS</h2>
                        <div className="w-24 h-1 bg-[var(--brand-yellow)]"></div>
                    </div>
                    <p className="hidden md:block text-gray-500 max-w-sm text-right">
                        Specialized diploma courses tailored for high-growth industries.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                    {courses.map((course) => (
                        <CourseCard key={course.sys.id} course={course} />
                    ))}
                </div>
            </div>
        </section>
    );
};
