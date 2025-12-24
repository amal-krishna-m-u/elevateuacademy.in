import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getLandingPageData, BlogPost } from '@/lib/contentful';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import { BLOCKS, INLINES } from '@contentful/rich-text-types';
import { ArrowLeft, Calendar, Tag } from 'lucide-react';
import { CustomCursor } from '@/components/ui/CustomCursor';
import { DateFormatter } from '@/components/ui/DateFormatter';

// Generate static params for all blog posts
export async function generateStaticParams() {
    const data = await getLandingPageData();
    return data.blogPosts.map((post) => ({
        slug: post.slug,
    }));
}

export const revalidate = 1200;

// Rich Text Options
const richTextOptions = {
    renderNode: {
        [BLOCKS.EMBEDDED_ASSET]: (node: any) => {
            // Logic for embedded assets if needed
            return (
                <div className="my-8 rounded-xl overflow-hidden">
                    {/* Fallback or specific logic for assets inside content */}
                    <span className="text-gray-500 text-sm p-4 block bg-gray-900">Embedded Media</span>
                </div>
            );
        },
        [BLOCKS.PARAGRAPH]: (node: any, children: any) => <p className="mb-6 text-gray-300 leading-relaxed text-lg">{children}</p>,
        [BLOCKS.HEADING_2]: (node: any, children: any) => <h2 className="text-3xl font-bold font-montserrat text-white mt-12 mb-6">{children}</h2>,
        [BLOCKS.HEADING_3]: (node: any, children: any) => <h3 className="text-2xl font-bold font-montserrat text-white mt-8 mb-4">{children}</h3>,
        [BLOCKS.UL_LIST]: (node: any, children: any) => <ul className="list-disc list-inside space-y-2 mb-8 text-gray-300 ml-4">{children}</ul>,
        [BLOCKS.OL_LIST]: (node: any, children: any) => <ol className="list-decimal list-inside space-y-2 mb-8 text-gray-300 ml-4">{children}</ol>,
        [INLINES.HYPERLINK]: (node: any, children: any) => <a href={node.data.uri} className="text-[var(--brand-yellow)] hover:underline">{children}</a>,
    },
};

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
    const data = await getLandingPageData();
    const { slug } = await params;
    const post = data.blogPosts.find((p) => p.slug === slug);

    if (!post) {
        notFound();
    }

    return (
        <main className="min-h-screen bg-[#0a0a0a] text-white">
            <CustomCursor />

            {/* Navigation */}
            <nav className="fixed top-0 left-0 right-0 p-6 z-50 flex justify-between items-center mix-blend-mode-difference text-white">
                <Link href="/" className="flex items-center gap-2 hover:text-[var(--brand-yellow)] transition-colors bg-black/50 p-2 rounded-lg backdrop-blur">
                    <ArrowLeft /> Back
                </Link>
            </nav>

            <article className="max-w-4xl mx-auto pt-32 pb-20 px-6">

                {/* Header */}
                <div className="mb-12 text-center">
                    <div className="flex items-center justify-center gap-4 text-sm font-mono text-gray-400 mb-6">
                        <span className="flex items-center gap-2 px-3 py-1 rounded-full border border-gray-800">
                            <Tag size={12} /> {post.category}
                        </span>
                        <span className="flex items-center gap-2">
                            <Calendar size={12} /> <DateFormatter dateString={post.date} />
                        </span>
                    </div>

                    <h1 className="text-4xl md:text-6xl font-black font-montserrat leading-tight mb-8">
                        {post.title}
                    </h1>

                    <div className="relative aspect-video w-full rounded-3xl overflow-hidden border border-gray-800">
                        {post.coverImage.url ? (
                            <Image
                                src={post.coverImage.url}
                                alt={post.coverImage.title || post.title}
                                fill
                                priority
                                className="object-cover"
                                sizes="(max-width: 768px) 100vw, 1200px"
                            />
                        ) : (
                            <div className="w-full h-full bg-gray-900 flex items-center justify-center text-gray-700">No Image</div>
                        )}
                    </div>
                </div>

                {/* Content Body */}
                <div className="prose prose-invert prose-lg max-w-none">
                    <p className="lead text-xl text-gray-300 font-medium mb-12 border-l-4 border-[var(--brand-yellow)] pl-6 italic">
                        {post.excerpt}
                    </p>

                    {post.content ? documentToReactComponents(post.content, richTextOptions) : (
                        <p className="text-gray-500 italic">Content pending...</p>
                    )}
                </div>

            </article>
        </main>
    );
}
