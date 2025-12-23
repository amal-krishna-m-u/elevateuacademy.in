"use client";

import { ArrowRight, Calendar } from 'lucide-react';
import { MagneticButton } from '../ui/MagneticButton';
import { BlogPost } from '@/lib/contentful';

interface BlogSectionProps {
    posts: BlogPost[];
    onSelectPost: (post: BlogPost) => void;
}

export const BlogSection = ({ posts, onSelectPost }: BlogSectionProps) => {
    return (
        <section id="blog" className="py-32 bg-[#0a0a0a] border-t border-gray-900">
            <div className="container mx-auto px-6">
                <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
                    <div>
                        <span className="text-[var(--brand-yellow)] font-mono uppercase tracking-widest text-sm mb-2 block">Knowledge Hub</span>
                        <h2 className="text-5xl font-black font-montserrat text-white">LATEST INSIGHTS</h2>
                    </div>
                    <MagneticButton variant="outline" className="hidden md:flex">
                        View All Articles
                    </MagneticButton>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {posts.map((post) => (
                        <div key={post.sys.id} className="group cursor-pointer" onClick={() => onSelectPost(post)}>
                            <div className="relative aspect-[4/3] bg-[#111] rounded-2xl overflow-hidden mb-6 border border-gray-800">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    src={post.coverImage.url}
                                    alt={post.title}
                                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-80 group-hover:opacity-100"
                                />

                                {/* Hover overlay */}
                                <div className="absolute inset-0 bg-[var(--brand-yellow)] opacity-0 group-hover:opacity-10 transition-opacity duration-500 mix-blend-overlay"></div>
                                <div className="absolute top-4 left-4">
                                    <span className="bg-black/80 backdrop-blur text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border border-white/10">
                                        {post.category}
                                    </span>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 text-gray-500 text-xs font-mono mb-3">
                                <Calendar size={12} /> {post.date}
                            </div>

                            <h3 className="text-2xl font-bold font-montserrat text-white mb-4 group-hover:text-[var(--brand-yellow)] transition-colors leading-tight">
                                {post.title}
                            </h3>

                            <div className="flex items-center gap-2 text-sm font-bold text-white uppercase tracking-wider group/link">
                                Read Article <ArrowRight size={16} className="group-hover/link:translate-x-2 transition-transform" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};
