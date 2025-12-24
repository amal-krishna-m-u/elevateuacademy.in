import { LandingPageClient } from "@/components/LandingPageClient";
import { getLandingPageData } from "@/lib/contentful";
import { getSeoMetadata } from "@/lib/seo";
import JsonLd from "@/components/JsonLd";
import { Metadata } from "next";

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  const { metadata } = await getSeoMetadata('SEO - Home Page');
  return metadata;
}

export default async function Home() {
  const [data, seo] = await Promise.all([
    getLandingPageData(2, 3),
    getSeoMetadata('SEO - Home Page')
  ]);

  return (
    <>
      <JsonLd data={seo.structuredData} />
      <LandingPageClient data={data} />
    </>
  );
}
