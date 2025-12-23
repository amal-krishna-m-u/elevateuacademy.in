"use client";

import { useEffect, useState } from 'react';

// Use this component to safely format dates on the client to avoid hydration mismatch,
// or use simple string splitting if the input is already a consistent string (Contentful dates are ISO usually, but our mock is "Oct 24, 2024").
// The user requirement says: "Format the date string to show Date only (No time)... Use a hydration-safe approach (e.g., format on the server)."
// If we receive an ISO string, we can format it. Contentful's 'date' was mapped from 'fields.date' which is often Text or Date/Time.
// If it's Date/Time field it's ISO. If it's text, it's whatever.
// Based on current mock data: "Oct 24, 2024", it's already formatted. 
// A generic "DateFormatter" usually takes a dateString.

export const DateFormatter = ({ dateString }: { dateString: string }) => {
    // If it's already a formatted string like "Oct 24, 2024", just render it.
    // If we need to parse, we should do it cautiously.
    // Assuming Contentful provides ISO string for real Date fields:
    // We can try to format it.

    // Simple hydration safe check:
    // If we just render the string, it matches server/client.
    // If we use `new Date(dateString).toLocaleDateString()`, it might vary by locale timezone.

    // Strategy: consistent server formatting or client-only formatting.
    // Let's implement client-only formatting for safety if parsing is needed.

    const [formattedDate, setFormattedDate] = useState<string | null>(null);

    useEffect(() => {
        try {
            const date = new Date(dateString);
            // Check if valid date
            if (!isNaN(date.getTime())) {
                setFormattedDate(new Intl.DateTimeFormat('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                }).format(date));
            } else {
                // Fallback to original string (might be "Oct 24, 2024" text)
                setFormattedDate(dateString);
            }
        } catch {
            setFormattedDate(dateString);
        }
    }, [dateString]);

    if (!formattedDate) {
        // Return a stable placeholder or the raw string to avoid layout shift, 
        // but ensure it matches server render if possible. 
        // If we render nothing on server and something on client -> hydration error? No, text content mismatch.
        // Safest is to render valid generic string or null (if acceptable).
        // Given our mock data is "Oct 24, 2024", let's just render the string initially.
        return <time dateTime={dateString}>{dateString}</time>;
    }

    return <time dateTime={dateString}>{formattedDate}</time>;
};
