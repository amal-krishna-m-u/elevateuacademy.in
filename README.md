# 🚀 Dynamic SEO & AEO Strategy

This project uses a dynamic, database-backed approach to Search Engine Optimization (SEO) and Answer Engine Optimization (AEO). Instead of hardcoding meta tags, we fetch them from Contentful, allowing non-technical updates.

## 🧠 How It Works

### 1. Metadata Injection (Google Search)
We fetch `title`, `description`, `keywords`, and `openGraph` images from Contentful on the server.
- **File**: `src/lib/seo.ts`
- **Function**: `getSeoMetadata(internalName)`
- **Benefit**: Ensures every page has unique, optimized tags for Google ranking.

### 2. AEO & Structured Data (ChatGPT / Gemini / AI)
We inject standard **JSON-LD** (JavaScript Object Notation for Linked Data) into the `<body>` of the page.
- **Component**: `<JsonLd />`
- **Benefit**: AI models (like Gemini) read this structured data to understand "Who you are", "Where you are", and "What you offer". This powers things like "Rich Snippets" (Stars, Location Maps, FAQs) in search results.

---

## 📍 Where is it Implemented?

### ✅ 1. Home Page (`/`)
- **Internal Name in CMS**: `SEO - Home Page`
- **Data Source**: `src/app/page.tsx` matches this string to fetch data.
- **Structured Data**: `EducationalOrganization` (Location, Logo, SameAs links).

### ⏳ 2. Logistics Course Page (Pending Integration)
- **Internal Name in CMS**: `SEO - Logistics Course`
- **Target Page**: `src/app/courses/[slug]/page.tsx` (Needs update)
- **Structured Data**: `Course` (Outcome, Provider, Duration).

### ⏳ 3. FAQ Page (Pending Integration)
- **Internal Name in CMS**: `SEO - FAQ Page`
- **Target Page**: `src/app/faq/page.tsx` or similar.
- **Structured Data**: `FAQPage` (Question/Answer pairs).

---

## 🛠 How to Add SEO to New Pages

1.  **Contentful**: Create a new `SEO Metadata` entry.
    *   Set `Internal Name` (e.g., "SEO - Contact Page").
    *   Fill in Title, Description, etc.
2.  **Code (`page.tsx`)**:
    ```typescript
    import { getSeoMetadata } from "@/lib/seo";
    import JsonLd from "@/components/JsonLd";

    export async function generateMetadata() {
      const { metadata } = await getSeoMetadata('SEO - Contact Page');
      return metadata;
    }

    export default async function Page() {
       const { structuredData } = await getSeoMetadata('SEO - Contact Page');
       return (
         <>
           <JsonLd data={structuredData} />
           {/* Page Content */}
         </>
       )
    }
    ```

## ⚡ Managing SEO

Go to `/admin` dashboard and click **"Manage SEO"**.
This takes you directly to the Contentful view where you can edit these tags live.
