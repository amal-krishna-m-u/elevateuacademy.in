"use client";

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { BlogPost } from '@/lib/contentful';
import { Navbar } from '@/components/sections/Navbar';
import { Footer } from '@/components/sections/Footer';
import { BlogCard } from '@/components/ui/BlogCard';
import { FilterBar } from '@/components/ui/FilterBar';
import { RevealText } from '@/components/ui/RevealText';
import { CustomCursor } from '@/components/ui/CustomCursor';

export const BlogIndexClient = ({ posts }: { posts: BlogPost[] }) => {
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');

    const categories = ['All', ...Array.from(new Set(posts.map(p => p.category)))];

    const filteredPosts = useMemo(() => {
        return posts.filter(post => {
            const matchesCategory = selectedCategory === 'All' || post.category === selectedCategory;
            const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
            return matchesCategory && matchesSearch;
        });
    }, [posts, selectedCategory, searchQuery]);

    return (
        <div className="min-h-screen bg-[#0a0a0a]">
            <CustomCursor />
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
                                KNOWLEDGE <span className="text-[var(--brand-yellow)]">HUB</span>
                            </h1>
                        </RevealText>
                    </div>

                    <FilterBar
                        categories={categories}
                        activeCategory={selectedCategory}
                        onFilterChange={setSelectedCategory}
                        showSearch={true}
                        onSearchChange={setSearchQuery}
                    />

                    {filteredPosts.length > 0 ? (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {filteredPosts.map((post, index) => (
                                <BlogCard key={post.sys.id} post={post} priority={index < 6} />
                            ))}
                        </div>
                    ) : (
                        <div className="py-20 text-center border border-dashed border-gray-800 rounded-3xl">
                            <h3 className="text-2xl font-bold font-montserrat text-white mb-2">No articles found</h3>
                            <p className="text-gray-500">Try adjusting your search or category.</p>
                        </div>
                    )}

                </main>
            </NavigationWrapper>
        </div>
    );
};

const NavigationWrapper = ({ children }: { children: React.ReactNode }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    return (
        <>
            <Navbar isMenuOpen={isMenuOpen} toggleMenu={() => setIsMenuOpen(!isMenuOpen)} />
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
