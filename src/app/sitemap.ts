import { MetadataRoute } from 'next';
import { getAllCourseSlugs, getAllBlogPostSlugs } from '@/lib/contentful';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.elevateuacademy.in';

    // 1. Static Routes
    const staticRoutes: MetadataRoute.Sitemap = [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 1.0,
        },
        {
            url: `${baseUrl}/courses`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.8,
        },
        {
            url: `${baseUrl}/blog`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.8,
        },
    ];

    // 2. Dynamic Course Routes
    const courseSlugs = await getAllCourseSlugs();
    const courseRoutes: MetadataRoute.Sitemap = courseSlugs.map((item) => ({
        url: `${baseUrl}/courses/${item.slug}`,
        lastModified: new Date(item.updatedAt),
        changeFrequency: 'weekly',
        priority: 0.9,
    }));

    // 3. Dynamic Blog Routes
    const blogSlugs = await getAllBlogPostSlugs();
    const blogRoutes: MetadataRoute.Sitemap = blogSlugs.map((item) => ({
        url: `${baseUrl}/blog/${item.slug}`,
        lastModified: new Date(item.updatedAt),
        changeFrequency: 'monthly',
        priority: 0.7,
    }));

    return [...staticRoutes, ...courseRoutes, ...blogRoutes];
}
