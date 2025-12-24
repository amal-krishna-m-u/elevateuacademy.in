import { Metadata } from 'next';
import { client } from './contentful';

export interface SeoEntryFields {
    internalName: string;
    title: string;
    description: string;
    keywords: string[];
    noIndex: boolean;
    ogImage?: {
        fields: {
            title: string;
            file: {
                url: string;
                details: {
                    image: {
                        width: number;
                        height: number;
                    };
                };
            };
        };
    };
    structuredData?: Record<string, any>;
}

export interface SeoResult {
    metadata: Metadata;
    structuredData?: Record<string, any>;
    source: 'contentful' | 'default';
}

const DEFAULT_METADATA: Metadata = {
    title: 'Elevate U Academy',
    description: 'Master Logistics and Supply Chain Management.',
    robots: { index: true, follow: true },
};

export async function getSeoMetadata(internalName: string): Promise<SeoResult> {
    if (!client) {
        return { metadata: DEFAULT_METADATA, source: 'default' };
    }

    try {
        const response = await client.getEntries({
            content_type: 'seoMetadata',
            'fields.internalName': internalName,
            limit: 1,
            include: 2, // Include linked assets (images)
        });

        if (response.items.length === 0) {
            return { metadata: DEFAULT_METADATA, source: 'default' };
        }

        const fields = response.items[0].fields as unknown as SeoEntryFields;

        // 1. Construct Metadata
        const metadata: Metadata = {
            title: fields.title || DEFAULT_METADATA.title,
            description: fields.description || DEFAULT_METADATA.description,
            keywords: fields.keywords || [],
            robots: fields.noIndex
                ? { index: false, follow: false }
                : { index: true, follow: true },
        };

        // 2. OpenGraph Image
        if (fields.ogImage?.fields?.file?.url) {
            metadata.openGraph = {
                images: [
                    {
                        url: `https:${fields.ogImage.fields.file.url}`,
                        width: fields.ogImage.fields.file.details?.image?.width || 1200,
                        height: fields.ogImage.fields.file.details?.image?.height || 630,
                        alt: fields.ogImage.fields.title || fields.title,
                    },
                ],
            };
        }

        return {
            metadata,
            structuredData: fields.structuredData,
            source: 'contentful'
        };

    } catch (error) {
        console.error('Error fetching SEO metadata:', error);
        return { metadata: DEFAULT_METADATA, source: 'default' };
    }
}
