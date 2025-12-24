import { getAllFaqs } from '@/lib/contentful';
import { getSeoMetadata } from '@/lib/seo';
import JsonLd from '@/components/JsonLd';
import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, MessagesSquare } from 'lucide-react';
import { CustomCursor } from '@/components/ui/CustomCursor';

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
    const { metadata } = await getSeoMetadata('SEO - FAQ Page');
    return metadata;
}

export default async function FAQPage() {
    // Parallel Fetch
    const [faqs, seo] = await Promise.all([
        getAllFaqs(),
        getSeoMetadata('SEO - FAQ Page')
    ]);

    // 🧠 AEO: Structured Data (FAQPage Schema)
    // If SEO entry has structuredData, use it. IF NOT, generate from FAQs.
    // The SEO Entry has seed data for FAQPage, but we can enhance it with ALL faqs if we want.
    // The prompt says: "Fetch the FAQ content and generate FAQPage schema (Question/Answer list) for the JSON-LD."
    // So we should generate it dynamically to ensure it matches current DB content.

    const dynamicJsonLd = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": faqs.map(faq => ({
            "@type": "Question",
            "name": faq.question,
            "acceptedAnswer": {
                "@type": "Answer",
                "text": faq.answer
            }
        }))
    };

    // Merge or Prefer dynamic
    const jsonLdData = dynamicJsonLd;

    return (
        <main className="min-h-screen bg-[#0a0a0a] text-white font-sans">
            <CustomCursor />
            <JsonLd data={jsonLdData} />

            {/* Navbar */}
            <nav className="fixed top-0 left-0 right-0 p-6 z-50 flex justify-between items-center mix-blend-difference text-white">
                <Link href="/" className="flex items-center gap-2 hover:text-[var(--brand-yellow)] transition-colors">
                    <ArrowLeft /> Back to Home
                </Link>
                <div className="font-bold font-montserrat tracking-widest">ELEVATE U</div>
            </nav>

            <div className="pt-32 pb-20 container mx-auto px-6 max-w-4xl">
                <div className="text-center mb-16">
                    <MessagesSquare className="w-12 h-12 text-[var(--brand-yellow)] mx-auto mb-4" />
                    <h1 className="text-4xl md:text-5xl font-black font-montserrat mb-4">
                        Frequently Asked Questions
                    </h1>
                    <p className="text-gray-400">
                        Everything you need to know about our courses and campus.
                    </p>
                </div>

                {/* Using the simple rendering since the FAQAccordion component might be tied to ScrollTrigger/Home context or specific animation props. 
                    Let's check if we can reuse or just render clean accessible details/summary.
                    The design standard has been "Accordion". 
                    I'll use a simple accessible accordion here to be safe and standalone.
                */}
                <div className="space-y-4">
                    {faqs.map((faq) => (
                        <details key={faq.sys.id} className="group bg-[#111] border border-gray-800 rounded-xl overflow-hidden">
                            <summary className="flex justify-between items-center p-6 cursor-pointer list-none hover:bg-white/5 transition-colors">
                                <span className="font-bold font-montserrat pr-4">{faq.question}</span>
                                <span className="transition-transform group-open:rotate-180">
                                    ▼
                                </span>
                            </summary>
                            <div className="px-6 pb-6 text-gray-400 leading-relaxed border-t border-gray-800/50 pt-4">
                                {faq.answer}
                            </div>
                        </details>
                    ))}
                </div>
            </div>
        </main>
    );
}
