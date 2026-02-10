import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getLandingPageData, getCourseBySlug } from '@/lib/contentful';
import { getSeoMetadata } from '@/lib/seo';
import JsonLd from '@/components/JsonLd';
import { ArrowLeft, CheckCircle, Clock, BookOpen, PenTool } from 'lucide-react';
import { MagneticButton } from '@/components/ui/MagneticButton';
import { CustomCursor } from '@/components/ui/CustomCursor';
import { Metadata } from 'next';
import { Footer } from '@/components/sections/Footer';

// Generate static params for all courses to enable SSG
export async function generateStaticParams() {
    const data = await getLandingPageData();
    return data.courses.map((course) => ({
        slug: course.slug,
    }));
}

export const revalidate = 3600;

// 🚀 Dynamic Metadata
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
    const { slug } = await params;
    const course = await getCourseBySlug(slug);

    if (!course) return {};

    const seoName = `SEO - ${course.title}`;
    const { metadata, source } = await getSeoMetadata(seoName);

    if (source === 'default') {
        // Fallback: Generate from Course Data
        return {
            title: `${course.title} | Elevate U Calicut`,
            description: course.description.slice(0, 160),
            keywords: course.modules,
            openGraph: {
                title: course.title,
                description: course.description,
            }
        };
    }

    return metadata;
}

export default async function CoursePage({ params }: { params: { slug: string } }) {
    const { slug } = await params;

    // Efficient Fetch
    const course = await getCourseBySlug(slug);

    if (!course) {
        notFound();
    }

    // 🧠 AEO: Structured Data (Course Schema)
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "Course",
        "name": course.title,
        "description": course.description,
        "provider": {
            "@type": "Organization",
            "name": "Elevate U",
            "sameAs": "https://elevateu.com"
        },
        "hasCourseInstance": {
            "@type": "CourseInstance",
            "courseMode": "Blended",
            "courseWorkload": course.duration
        },
        "offers": {
            "@type": "Offer",
            "category": course.category
        },
        "syllabusSections": course.modules.map(mod => ({
            "@type": "Syllabus",
            "name": mod
        }))
    };

    return (
        <main className="min-h-screen bg-[#0a0a0a] text-white">
            <JsonLd data={jsonLd} />
            <CustomCursor />

            {/* Navigation / Header */}
            <nav className="fixed top-0 left-0 right-0 p-6 z-50 flex justify-between items-center mix-blend-difference text-white">
                <Link href="/" className="flex items-center gap-2 hover:text-[var(--brand-yellow)] transition-colors">
                    <ArrowLeft /> Back to Home
                </Link>
                <div className="font-bold font-montserrat tracking-widest">ELEVATE U</div>
            </nav>

            <article className="pt-32 pb-20 container mx-auto px-6">

                {/* Hero section of Course */}
                <div className="mb-16">
                    <span className="text-[var(--brand-yellow)] font-mono text-sm uppercase tracking-widest mb-4 block">
                        {course.category}
                    </span>
                    <h1 className="text-5xl md:text-7xl font-black font-montserrat mb-8 leading-tight">
                        {course.title}
                    </h1>

                    <div className="flex flex-wrap gap-6 text-gray-400 font-mono text-sm mb-12">
                        <div className="flex items-center gap-2">
                            <Clock size={16} className="text-[var(--brand-yellow)]" />
                            {course.duration}
                        </div>
                        <div className="flex items-center gap-2">
                            <BookOpen size={16} className="text-[var(--brand-yellow)]" />
                            {course.modules.length} Modules
                        </div>
                    </div>

                    <p className="text-xl text-gray-300 max-w-3xl leading-relaxed mb-12 border-l-4 border-[var(--brand-yellow)] pl-6">
                        {course.description}
                    </p>

                    <div className="flex gap-4">
                        <Link href="#contact">
                            <MagneticButton variant="primary">Enquire Now</MagneticButton>
                        </Link>
                    </div>
                </div>

                <div className="grid md:grid-cols-3 gap-16">

                    {/* Main Content: Syllabus */}
                    <div className="md:col-span-2">
                        <h2 className="text-3xl font-bold font-montserrat mb-8 flex items-center gap-3">
                            <BookOpen className="text-[var(--brand-yellow)]" /> Course Syllabus
                        </h2>

                        <div className="space-y-6">
                            {course.modules.map((mod, index) => (
                                <div key={index} className="bg-[#111] border border-gray-800 p-6 rounded-2xl hover:border-gray-600 transition-colors">
                                    <div className="flex items-start gap-4">
                                        <span className="flex-shrink-0 w-8 h-8 rounded-full bg-[var(--brand-yellow)] text-black font-bold flex items-center justify-center">
                                            {index + 1}
                                        </span>
                                        <div>
                                            <h3 className="text-xl font-bold font-montserrat mb-2">{mod}</h3>
                                            {/* If syllabus JSON exists, we can try to find details for this module */}
                                            {course.syllabus?.modules && Array.isArray(course.syllabus.modules) ? (
                                                <ul className="list-disc list-inside text-gray-400 text-sm mt-3 space-y-1 ml-1">
                                                    {course.syllabus.modules[index]?.topics?.map((topic: string, i: number) => (
                                                        <li key={i}>{topic}</li>
                                                    ))}
                                                </ul>
                                            ) : null}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Sidebar: Highlights & Tools */}
                    <div className="space-y-12">

                        <div className="bg-[#111] p-8 rounded-3xl border border-gray-800">
                            <h3 className="text-xl font-bold font-montserrat mb-6 flex items-center gap-2">
                                <CheckCircle className="text-[var(--brand-yellow)]" /> Key Highlights
                            </h3>
                            <ul className="space-y-4">
                                {course.highlights.map((item, i) => (
                                    <li key={i} className="flex items-start gap-3 text-sm text-gray-300">
                                        <span className="text-[var(--brand-yellow)] mt-1">•</span>
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div>
                            <h3 className="text-xl font-bold font-montserrat mb-6 flex items-center gap-2">
                                <PenTool className="text-[var(--brand-yellow)]" /> Tools Covered
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {course.tools.map((tool, i) => (
                                    <span key={i} className="px-4 py-2 bg-[#111] border border-gray-800 rounded-lg text-sm font-mono text-gray-300">
                                        {tool}
                                    </span>
                                ))}
                            </div>
                        </div>

                    </div>
                </div>

            </article>

            <Footer />
        </main>
    );
}
