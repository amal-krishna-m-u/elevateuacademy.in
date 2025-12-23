"use client";

import { useState } from 'react';
import { LandingPageData, Course, BlogPost } from '@/lib/contentful';
import { Navbar } from './sections/Navbar';
import { Hero } from './sections/Hero';
import { Marquee } from './ui/Marquee';
import { FeatureStack } from './sections/FeatureStack';
import { Programs } from './sections/Programs';
import { BlogSection } from './sections/BlogSection';
import { FAQSection } from './sections/FAQ';
import { Footer } from './sections/Footer';
import { CustomCursor } from './ui/CustomCursor';
import { MagneticButton } from './ui/MagneticButton';
import { SyllabusModal } from './modals/SyllabusModal';
import { BlogModal } from './modals/BlogModal';
import Link from 'next/link';

export const LandingPageClient = ({ data }: { data: LandingPageData }) => {
    const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
    const [selectedBlogPost, setSelectedBlogPost] = useState<BlogPost | null>(null);

    return (
        <>
            <CustomCursor />

            {/* Modals for Quick View */}
            <SyllabusModal course={selectedCourse} isOpen={!!selectedCourse} onClose={() => setSelectedCourse(null)} />
            <BlogModal post={selectedBlogPost} isOpen={!!selectedBlogPost} onClose={() => setSelectedBlogPost(null)} />

            {/* Navigation (Self-contained) */}
            <Navbar />

            <main>
                <Hero />
                <Marquee />
                <FeatureStack />

                {/* Home Page uses "modal" mode for quick interaction */}
                <Programs
                    courses={data.courses.slice(0, 2)}
                    mode="modal"
                    onItemClick={setSelectedCourse}
                />

                <BlogSection
                    posts={data.blogPosts.slice(0, 3)}
                    mode="modal"
                    onItemClick={setSelectedBlogPost}
                />

                <FAQSection faqs={data.faqs} />
                <Footer />
            </main>
        </>
    );
};
