import Link from 'next/link';
import { BlogPost } from '@/lib/contentful';
import { MagneticButton } from '../ui/MagneticButton';
import { BlogCard } from '../ui/BlogCard';

interface BlogSectionProps {
    posts: BlogPost[];
}

export const BlogSection = ({ posts }: BlogSectionProps) => {
    return (
        <section id="blog" className="py-32 bg-[#0a0a0a] border-t border-gray-900">
            <div className="container mx-auto px-6">
                <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
                    <div>
                        <span className="text-[var(--brand-yellow)] font-mono uppercase tracking-widest text-sm mb-2 block">Knowledge Hub</span>
                        <h2 className="text-5xl font-black font-montserrat text-white">LATEST INSIGHTS</h2>
                    </div>
                    <Link href="/blog">
                        <MagneticButton variant="outline" className="hidden md:flex">
                            View All Articles
                        </MagneticButton>
                    </Link>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {posts.map((post) => (
                        <BlogCard key={post.sys.id} post={post} />
                    ))}
                </div>
            </div>
        </section>
    );
};
