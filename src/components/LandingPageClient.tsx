"use client";

import { useState } from 'react';
import { Course, BlogPost, FAQ, LandingPageData } from '@/lib/contentful';
import { Navbar } from './sections/Navbar';
import { Hero } from './sections/Hero';
import { Marquee } from './ui/Marquee';
import { FeatureStack } from './sections/FeatureStack';
import { Programs } from './sections/Programs';
import { BlogSection } from './sections/BlogSection';
import { FAQSection } from './sections/FAQ';
import { Footer } from './sections/Footer';
import { SyllabusModal } from './modals/SyllabusModal';
import { BlogModal } from './modals/BlogModal';
import { CustomCursor } from './ui/CustomCursor';
import { MagneticButton } from './ui/MagneticButton';
import { Menu, X } from 'lucide-react';

export const LandingPageClient = ({ data }: { data: LandingPageData }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
    const [selectedBlogPost, setSelectedBlogPost] = useState<BlogPost | null>(null);

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

    return (
        <>
            <CustomCursor />

            {/* Modals */}
            <SyllabusModal course={selectedCourse} isOpen={!!selectedCourse} onClose={() => setSelectedCourse(null)} />
            <BlogModal post={selectedBlogPost} isOpen={!!selectedBlogPost} onClose={() => setSelectedBlogPost(null)} />

            {/* Navigation */}
            <Navbar isMenuOpen={isMenuOpen} toggleMenu={toggleMenu} />

            {/* Mobile Fullscreen Menu */}
            <div className={`fixed inset-0 bg-black z-40 transition-transform duration-300 ease-in-out md:hidden flex flex-col items-center justify-center gap-8 ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                {['Courses', 'About', 'Blog', 'FAQ'].map((item) => (
                    <a
                        key={item}
                        href={`#${item.toLowerCase()}`}
                        onClick={toggleMenu}
                        className="text-3xl font-black font-montserrat uppercase hover:text-[var(--brand-yellow)] transition-colors"
                    >
                        {item}
                    </a>
                ))}
                <div className="mt-8">
                    <MagneticButton variant="primary" onClick={() => { toggleMenu(); document.getElementById('contact')?.scrollIntoView(); }}>
                        Enquire Now
                    </MagneticButton>
                </div>
            </div>

            <main>
                <Hero />
                <Marquee />
                <FeatureStack />
                <Programs courses={data.courses} onSelectCourse={setSelectedCourse} />
                <BlogSection posts={data.blogPosts} onSelectPost={setSelectedBlogPost} />
                <FAQSection faqs={data.faqs} />
                <Footer />
            </main>
        </>
    );
};
