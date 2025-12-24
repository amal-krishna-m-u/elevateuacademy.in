import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Admin Dashboard | Elevate U',
    robots: {
        index: false,
        follow: false,
        googleBot: {
            index: false,
            follow: false,
        },
    },
};

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="admin-layout">
            {children}
        </div>
    );
}
