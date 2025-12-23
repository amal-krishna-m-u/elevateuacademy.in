"use client";

import { useState, useMemo } from 'react';
import { Course } from '@/lib/contentful';
import { Navbar } from '@/components/sections/Navbar';
import { Footer } from '@/components/sections/Footer';
import { CourseCard } from '@/components/ui/CourseCard';
import { FilterBar } from '@/components/ui/FilterBar';
import { RevealText } from '@/components/ui/RevealText';
import { CustomCursor } from '@/components/ui/CustomCursor';
import { MagneticButton } from '@/components/ui/MagneticButton';

// Note: To make this work as a Server Component for initial fetch but Client for filtering details,
// we usually fetch data in a parent SC and pass to a Client Wrapper.
// However, 'app/courses/page.tsx' can be an async SC that fetches data
// and passes it to a 'CoursesIndexClient' component.
// OR we can make this page a Client Component if we don't mind fetching on client (bad for SEO).
// Requirement: "Fetch all entries from Contentful ... Server-Side Fetching (SSG)".
// Solution: This file will be the Server Component, and we'll make a client wrapper for the list.

// Let's check if the user asked specifically for the PAGE code or the CLIENT logic.
// "Code for app/courses/page.tsx."
// "Filtering (Client-Side)... from content passed down."
// So I will create a CoursesClient component first.

// --- CoursesIndexClient.tsx (inline for simplicity or separate if needed. I'll make separate logic inside a new client component to keep page.tsx clean as SC)

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export const CoursesIndexClient = ({ courses }: { courses: Course[] }) => {
    const [selectedCategory, setSelectedCategory] = useState('All');

    // Extract unique categories
    const categories = ['All', ...Array.from(new Set(courses.map(c => c.category)))];

    const filteredCourses = useMemo(() => {
        if (selectedCategory === 'All') return courses;
        return courses.filter(c => c.category === selectedCategory);
    }, [courses, selectedCategory]);

    return (
        <div className="min-h-screen bg-[#0a0a0a]">
            <CustomCursor />
            {/* We need Navbar here to reuse layout? Or user Layout wrapper? 
                 The Landing Page uses Navbar inside LandingPageClient. 
                 Global Layout does NOT include Navbar. So include it here. 
             */}
            {/* Hack: Navbar needs internal state for mobile menu... reusing the one from sections/Navbar which handles its own state? 
                 Wait, Navbar.tsx in sections is a controlled component: `isMenuOpen`, `toggleMenu`.
                 We need to wrap this page with similar state state or Refactor Navbar to be self-contained. 
                 Looking at `Navbar.tsx` (viewed earlier):
                 export const Navbar = ({ isMenuOpen, toggleMenu }: NavbarProps)
                 It's controlled.
                 I need to manage that state here too.
             */}
            <NavigationWrapper>
                <main className="container mx-auto px-6 py-32">

                    <div className="mb-20">
                        <RevealText>
                            <Link href="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-[var(--brand-yellow)] transition-colors mb-6 text-sm font-mono uppercase tracking-widest">
                                <ArrowLeft size={16} /> Back to Home
                            </Link>
                        </RevealText>
                        <RevealText delay={100}>
                            <h1 className="text-5xl md:text-7xl font-black font-montserrat text-white mb-6">
                                OUR <span className="text-[var(--brand-yellow)]">COURSES</span>
                            </h1>
                        </RevealText>
                        <RevealText delay={200}>
                            <p className="text-xl text-gray-400 max-w-2xl">
                                Explore our industry-leading diploma programs designed to get you hired.
                            </p>
                        </RevealText>
                    </div>

                    <FilterBar
                        categories={categories}
                        activeCategory={selectedCategory}
                        onFilterChange={setSelectedCategory}
                    />

                    {filteredCourses.length > 0 ? (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {filteredCourses.map((course) => (
                                <CourseCard key={course.sys.id} course={course} />
                            ))}
                        </div>
                    ) : (
                        <div className="py-20 text-center border border-dashed border-gray-800 rounded-3xl">
                            <h3 className="text-2xl font-bold font-montserrat text-white mb-2">No courses found</h3>
                            <p className="text-gray-500">Try adjusting your category filter.</p>
                        </div>
                    )}

                </main>
            </NavigationWrapper>
        </div>
    );
};

// Helper for Navigation State (Since Navbar is controlled)
const NavigationWrapper = ({ children }: { children: React.ReactNode }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    return (
        <>
            <Navbar isMenuOpen={isMenuOpen} toggleMenu={() => setIsMenuOpen(!isMenuOpen)} />
            {/* Mobile Fullscreen Menu Logic (Reused) */}
            <div className={`fixed inset-0 bg-black z-40 transition-transform duration-300 ease-in-out md:hidden flex flex-col items-center justify-center gap-8 ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                {['Home', 'Courses', 'Blog', 'Contact'].map((item) => (
                    <Link
                        key={item}
                        href={item === 'Home' ? '/' : `/${item.toLowerCase()}`}
                        onClick={() => setIsMenuOpen(false)}
                        className="text-3xl font-black font-montserrat uppercase hover:text-[var(--brand-yellow)] transition-colors"
                    >
                        {item}
                    </Link>
                ))}
            </div>
            {children}
            <Footer />
        </>
    )
}
