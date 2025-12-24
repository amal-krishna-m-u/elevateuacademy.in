"use client";

import { X, Calendar, Clock } from 'lucide-react';
import { MagneticButton } from '../ui/MagneticButton';
import { BlogPost } from '@/lib/contentful';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import { Document } from '@contentful/rich-text-types';

interface BlogModalProps {
    post: BlogPost | null;
    isOpen: boolean;
    onClose: () => void;
}

export const BlogModal = ({ post, isOpen, onClose }: BlogModalProps) => {
    if (!isOpen || !post) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-0 md:p-4 text-left">
            <div className="absolute inset-0 bg-black/95 backdrop-blur-xl" onClick={onClose}></div>
            <div className="bg-[#0a0a0a] w-full h-[100dvh] md:h-auto md:max-h-[95vh] md:max-w-4xl overflow-y-auto relative md:rounded-2xl shadow-2xl animate-in fade-in zoom-in duration-300 md:border md:border-gray-800">

                <button
                    onClick={onClose}
                    className="fixed md:absolute top-4 right-4 md:top-6 md:right-6 z-50 bg-black/50 hover:bg-[var(--brand-yellow)] text-white hover:text-black p-3 rounded-full transition-all backdrop-blur"
                >
                    <X size={24} />
                </button>

                <div className="h-64 md:h-96 relative">
                    {/* Using standard img for now to match logic, can upgrade to next/image but need width/height */}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={post.coverImage.url} alt={post.title} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent"></div>
                    <div className="absolute bottom-6 left-6 md:left-12">
                        <span className="bg-[var(--brand-yellow)] text-black px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-3 inline-block">
                            {post.category}
                        </span>
                        <div className="flex items-center gap-4 text-gray-300 text-sm">
                            <span className="flex items-center gap-2"><Calendar size={14} /> {post.date}</span>
                            <span className="flex items-center gap-2"><Clock size={14} /> 5 Min Read</span>
                        </div>
                    </div>
                </div>

                <div className="p-8 md:p-12">
                    <h2 className="text-3xl md:text-4xl font-black font-montserrat text-white mb-8 leading-tight">{post.title}</h2>

                    <div className="prose prose-invert prose-lg max-w-none text-gray-300">
                        <p className="lead text-xl text-white font-light mb-6">
                            {post.excerpt}
                        </p>

                        {post.content ? (
                            documentToReactComponents(post.content as Document)
                        ) : (
                            <>
                                {/* Fallback content if no Rich Text provided, matching mock */}
                                <p className="mb-6">
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                                </p>
                                <h3 className="text-2xl font-bold text-white mt-8 mb-4">Key Takeaways</h3>
                                <p className="mb-6">
                                    Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                                </p>
                                <ul className="list-disc pl-6 space-y-2 mb-8 marker:text-[var(--brand-yellow)]">
                                    <li>Understanding the fundamentals of the industry.</li>
                                    <li>Practical application of skills in real-world scenarios.</li>
                                    <li>The importance of continuous learning and adaptation.</li>
                                </ul>
                                <p>
                                    Ready to start your journey? Elevate U Academy provides the perfect launchpad for your career. Join our upcoming batch and transform your professional life.
                                </p>
                            </>
                        )}
                    </div>

                    <div className="mt-12 pt-8 border-t border-gray-800 flex justify-between items-center">
                        <p className="text-gray-500 italic">Written by Elevate U Editorial Team</p>
                        <MagneticButton variant="primary" onClick={() => { onClose(); document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' }) }}>
                            Enquire About Course
                        </MagneticButton>
                    </div>
                </div>
            </div>
        </div>
    );
};
