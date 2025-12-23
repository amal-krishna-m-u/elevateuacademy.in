import { LandingPageClient } from "@/components/LandingPageClient";
import { getLandingPageData } from "@/lib/contentful";

export const revalidate = 3600;

export default async function Home() {
  const data = await getLandingPageData();

  return <LandingPageClient data={data} />;
}
