import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Calendar } from 'lucide-react';
import { BlogPost } from '@/lib/contentful';
import { DateFormatter } from './DateFormatter';

interface BlogCardProps {
    post: BlogPost;
    priority?: boolean;
    mode?: 'link' | 'modal';
    onClick?: () => void;
}

export const BlogCard = ({ post, priority = false, mode = 'link', onClick }: BlogCardProps) => {
    return (
        <Link href={`/blog/${post.slug}`} className="group cursor-pointer block h-full flex flex-col">
            <div className="relative aspect-[4/3] bg-[#111] rounded-2xl overflow-hidden mb-6 border border-gray-800">
                {post.coverImage.url ? (
                    <Image
                        src={post.coverImage.url}
                        alt={post.title}
                        fill
                        priority={priority}
                        className="object-cover transition-transform duration-700 group-hover:scale-110 opacity-80 group-hover:opacity-100"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                ) : (
                    <div className="w-full h-full bg-gray-900 flex items-center justify-center text-gray-700">No Image</div>
                )}


                {/* Hover overlay */}
                <div className="absolute inset-0 bg-[var(--brand-yellow)] opacity-0 group-hover:opacity-10 transition-opacity duration-500 mix-blend-overlay"></div>
                <div className="absolute top-4 left-4 z-10">
                    <span className="bg-black/80 backdrop-blur text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border border-white/10">
                        {post.category}
                    </span>
                </div>
            </div>

            <div className="flex items-center gap-3 text-gray-500 text-xs font-mono mb-3">
                <Calendar size={12} /> <DateFormatter dateString={post.date} />
            </div>

            <h3 className="text-2xl font-bold font-montserrat text-white mb-4 group-hover:text-[var(--brand-yellow)] transition-colors leading-tight line-clamp-2">
                {post.title}
            </h3>

            <p className="text-gray-400 text-sm mb-6 line-clamp-3 leading-relaxed flex-grow">
                {post.excerpt}
            </p>

            <div className="mt-auto flex items-center gap-2 text-sm font-bold text-white uppercase tracking-wider group/link">
                Read Article <ArrowRight size={16} className="group-hover/link:translate-x-2 transition-transform" />
            </div>
        </Link>
    );
};
