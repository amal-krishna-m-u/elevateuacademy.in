import { createClient, Entry } from 'contentful';
import { Document } from '@contentful/rich-text-types';

// Suppress 'url.parse' deprecation warning from Contentful SDK (Node 22+)
if (typeof process !== 'undefined') {
    const originalEmit = process.emit;
    (process as any).emit = function (name: any, data: any, ...args: any[]) {
        if (
            name === 'warning' &&
            typeof data === 'object' &&
            data.name === 'DeprecationWarning' &&
            data.message.includes('url.parse')
        ) {
            return false;
        }
        return originalEmit.apply(process, [name, data, ...args] as any);
    };
}

// --- Types ---

export interface Course {
    sys: { id: string };
    slug: string;
    title: string;
    category: string;
    duration: string;
    description: string;
    modules: string[];
    highlights: string[];
    tools: string[];
    syllabus?: Record<string, any>; // JSON object
}

export interface BlogPost {
    sys: { id: string };
    slug: string;
    title: string;
    excerpt: string;
    coverImage: {
        url: string;
        title: string;
        width?: number;
        height?: number;
    };
    date: string;
    category: string;
    content?: Document;
}

export interface FAQ {
    sys: { id: string };
    question: string;
    answer: string;
    order: number;
}

export interface LandingPageData {
    courses: Course[];
    blogPosts: BlogPost[];
    faqs: FAQ[];
}

// --- Client ---

const isContentfulEnabled =
    process.env.CONTENTFUL_SPACE_ID &&
    process.env.CONTENTFUL_ACCESS_TOKEN;

const client = isContentfulEnabled
    ? createClient({
        space: process.env.CONTENTFUL_SPACE_ID!,
        accessToken: process.env.CONTENTFUL_ACCESS_TOKEN!,
    })
    : null;

// --- Mock Data (Fallback) ---
// Kept for development without keys or network errors

const MOCK_COURSES: Course[] = [
    {
        sys: { id: '1' },
        slug: "logistics-supply-chain",
        title: "Logistics & Supply Chain",
        category: "Management",
        duration: "6 Months",
        description: "Master global trade, inventory systems, and shipping documentation.",
        modules: ["Supply Chain Strategy", "Warehouse Ops", "Inventory Mgmt"],
        highlights: ["100% Placement", "Industrial Visits"],
        tools: ["SAP", "Excel"]
    },
    {
        sys: { id: '2' },
        slug: "accounting-taxation",
        title: "Accounting & Taxation",
        category: "Finance",
        duration: "6 Months",
        description: "From Tally Prime to Gulf VAT, become a complete finance professional.",
        modules: ["Manual Accounting", "Tally Prime", "GST Filing"],
        highlights: ["Placement Guarantee", "Uniforms"],
        tools: ["Tally", "SAP B1"]
    }
];

const MOCK_BLOG_POSTS: BlogPost[] = [
    {
        sys: { id: '1' },
        slug: "future-global-logistics-2025",
        title: "The Future of Global Logistics: 2025 Trends",
        excerpt: "From AI-driven supply chains to sustainable shipping, discover what the future holds.",
        date: "Oct 24, 2024",
        category: "Industry Insights",
        coverImage: { url: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800", title: "Logistics", width: 800, height: 600 }
    }
];

const MOCK_FAQS: FAQ[] = [
    { sys: { id: '1' }, order: 1, question: "Sample Question?", answer: "Sample Answer." }
];

// --- Helpers ---

// Defensive helper to return an array or empty array if undefined
function safeMapList(list: any[] | undefined): string[] {
    if (!Array.isArray(list)) return [];
    return list.map(item => String(item));
}

// --- Fetcher ---

export async function getLandingPageData(limitCourses?: number, limitBlogs?: number): Promise<LandingPageData> {
    if (!client) {
        console.warn("⚠️ Contentful credentials not found. Using mock data.");
        return {
            courses: limitCourses ? MOCK_COURSES.slice(0, limitCourses) : MOCK_COURSES,
            blogPosts: limitBlogs ? MOCK_BLOG_POSTS.slice(0, limitBlogs) : MOCK_BLOG_POSTS,
            faqs: MOCK_FAQS,
        };
    }

    try {
        // 1. Sort Blog Posts by Date desc ('-fields.date')
        // 2. Sort FAQs by Order asc ('fields.order')
        const coursesQuery: any = { content_type: 'course', include: 2 };
        if (limitCourses) coursesQuery.limit = limitCourses;

        const blogsQuery: any = { content_type: 'blogPost', order: '-fields.date', include: 2 };
        if (limitBlogs) blogsQuery.limit = limitBlogs;

        const [coursesRes, blogPostsRes, faqsRes] = await Promise.all([
            client.getEntries(coursesQuery),
            client.getEntries(blogsQuery),
            client.getEntries({ content_type: 'faq', order: 'fields.order', include: 2 } as any),
        ]);

        // Map entries with defensive checks
        const mapCourse = (entry: Entry<any>): Course => {
            const fields = entry.fields;
            return {
                sys: { id: entry.sys.id },
                slug: String(fields.slug || entry.sys.id), // Fallback to ID if slug missing
                title: String(fields.title || ""),
                category: String(fields.category || ""),
                duration: String(fields.duration || ""),
                description: String(fields.description || ""),
                modules: safeMapList(fields.modules as any[]),
                highlights: safeMapList(fields.highlights as any[]),
                tools: safeMapList(fields.tools as any[]),
                syllabus: (fields.syllabus as Record<string, any>) || {},
            };
        };

        const mapBlogPost = (entry: Entry<any>): BlogPost => {
            const fields = entry.fields;
            let coverImage = { url: '', title: '', width: 0, height: 0 };

            if (fields.coverImage && (fields.coverImage as any).fields && (fields.coverImage as any).fields.file) {
                const imageFields = (fields.coverImage as any).fields;
                const file = imageFields.file;
                coverImage = {
                    url: 'https:' + file.url,
                    title: String(imageFields.title || ''),
                    width: file.details?.image?.width || 0,
                    height: file.details?.image?.height || 0
                };
            }

            return {
                sys: { id: entry.sys.id },
                slug: String(fields.slug || entry.sys.id),
                title: String(fields.title || ""),
                excerpt: String(fields.excerpt || ""),
                date: String(fields.date || ""),
                category: String(fields.category || ""),
                content: fields.content as Document | undefined,
                coverImage
            };
        };

        const mapFAQ = (entry: Entry<any>): FAQ => {
            const fields = entry.fields;
            return {
                sys: { id: entry.sys.id },
                question: String(fields.question || ""),
                answer: String(fields.answer || ""),
                order: Number(fields.order || 0)
            };
        };

        console.log("✅ Successfully fetched live data from Contentful!");

        return {
            courses: coursesRes.items.map(mapCourse),
            blogPosts: blogPostsRes.items.map(mapBlogPost),
            faqs: faqsRes.items.map(mapFAQ),
        };

    } catch (error) {
        console.error("Error fetching data from Contentful:", error);
        return {
            courses: MOCK_COURSES,
            blogPosts: MOCK_BLOG_POSTS,
            faqs: MOCK_FAQS,
        };
    }
}
