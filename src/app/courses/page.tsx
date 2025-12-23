import { getLandingPageData } from '@/lib/contentful';
import { CoursesIndexClient } from './CoursesIndexClient';

export const revalidate = 3600; // 1 Hour ISR

export default async function CoursesIndexPage() {
    const data = await getLandingPageData();
    return <CoursesIndexClient courses={data.courses} />;
}
