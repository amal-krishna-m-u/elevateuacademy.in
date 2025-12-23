import { getLandingPageData } from '@/lib/contentful';
import { BlogIndexClient } from './BlogIndexClient';

export const revalidate = 3600;

export default async function BlogIndexPage() {
    const data = await getLandingPageData();
    return <BlogIndexClient posts={data.blogPosts} />;
}
