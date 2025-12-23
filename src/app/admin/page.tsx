import { auth, signOut } from "@/auth";
import { sql } from "@vercel/postgres";
import { getLandingPageData } from "@/lib/contentful";
import EnquiryDataTable from '@/components/admin/EnquiryDataTable';

export default async function AdminPage() {
    const session = await auth();
    if (!session) return <div>Access Denied</div>;

    // Fetch Enquiries & Serialize for Client Component
    const { rows } = await sql`SELECT * FROM enquiries ORDER BY created_at DESC LIMIT 100;`;
    const enquiries = rows.map(row => ({
        ...row,
        id: row.id,
        name: row.name,
        phone: row.phone,
        course_interest: row.course_interest,
        status: row.status,
        created_at: row.created_at.toISOString() // Convert Date to String
    }));

    // Fetch Content Shortcuts
    const { courses, blogPosts, faqs } = await getLandingPageData(5, 5);

    return (
        <div className="min-h-screen bg-black text-white p-8 font-sans">
            <header className="max-w-7xl mx-auto flex justify-between items-center mb-12 border-b border-gray-800 pb-8">
                <div>
                    <h1 className="text-3xl font-bold font-montserrat text-[var(--brand-yellow)]">Admin Console</h1>
                    <p className="text-gray-400 text-sm">Welcome back, {session.user?.email}</p>
                </div>
                <form action={async () => {
                    "use server";
                    await signOut();
                }}>
                    <button className="bg-red-900/30 text-red-400 px-4 py-2 rounded-lg text-sm border border-red-900 hover:bg-red-900/50 transition-colors">
                        Sign Out
                    </button>
                </form>
            </header>

            <main className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12">

                {/* Left Col: Enquiry Manager */}
                <section className="space-y-6">
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-bold font-montserrat">Enquiry Management</h2>
                    </div>

                    <EnquiryDataTable initialEnquiries={enquiries as any} />
                </section>

                {/* Right Col: Content Shortcuts */}
                <section className="space-y-8">
                    <div>
                        <h2 className="text-xl font-bold font-montserrat mb-6">Quick Actions</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <a
                                href={`https://app.contentful.com/spaces/${process.env.CONTENTFUL_SPACE_ID}/views/entries?id=en4mO3mqmEMv0WNA`}
                                target="_blank"
                                className="p-6 bg-[#111] border border-gray-800 rounded-xl hover:border-[var(--brand-yellow)] hover:text-[var(--brand-yellow)] transition-all flex flex-col items-center justify-center gap-2 text-center"
                            >
                                <span className="text-2xl font-black">+</span>
                                <span className="text-sm font-bold uppercase tracking-widest">View/Add Course</span>
                            </a>
                            <a
                                href={`https://app.contentful.com/spaces/${process.env.CONTENTFUL_SPACE_ID}/views/entries?id=Mi5mDmhyVNpcMdD7`}
                                target="_blank"
                                className="p-6 bg-[#111] border border-gray-800 rounded-xl hover:border-[var(--brand-yellow)] hover:text-[var(--brand-yellow)] transition-all flex flex-col items-center justify-center gap-2 text-center"
                            >
                                <span className="text-2xl font-black">+</span>
                                <span className="text-sm font-bold uppercase tracking-widest">View/Add Blog Post</span>
                            </a>
                            <a
                                href={`https://app.contentful.com/spaces/${process.env.CONTENTFUL_SPACE_ID}/views/entries?id=anfAog4Ba949g71C`}
                                target="_blank"
                                className="p-6 bg-[#111] border border-gray-800 rounded-xl hover:border-[var(--brand-yellow)] hover:text-[var(--brand-yellow)] transition-all flex flex-col items-center justify-center gap-2 text-center"
                            >
                                <span className="text-2xl font-black">+</span>
                                <span className="text-sm font-bold uppercase tracking-widest">View/Add FAQs</span>
                            </a>
                        </div>
                    </div>

                    <div>
                        <h2 className="text-xl font-bold font-montserrat mb-4">Latest Content</h2>
                        <div className="bg-[#111] border border-gray-800 rounded-xl p-6 space-y-4">

                            {/* Recent Courses */}
                            <h3 className="text-xs uppercase tracking-widest text-gray-500 mb-2">Recent Courses</h3>
                            {courses.slice(0, 3).map(c => (
                                <div key={c.sys.id} className="flex justify-between items-center group">
                                    <span className="text-sm text-gray-300 group-hover:text-white truncate">{c.title}</span>
                                    <a href={`https://app.contentful.com/spaces/${process.env.CONTENTFUL_SPACE_ID}/entries/${c.sys.id}`} target="_blank" className="text-xs text-[var(--brand-yellow)] underline transition-opacity">Edit</a>
                                </div>
                            ))}

                            <div className="h-px bg-gray-800 my-4"></div>

                            {/* Recent Blogs */}
                            <h3 className="text-xs uppercase tracking-widest text-gray-500 mb-2">Recent Blogs</h3>
                            {blogPosts.slice(0, 3).map(b => (
                                <div key={b.sys.id} className="flex justify-between items-center group">
                                    <span className="text-sm text-gray-300 group-hover:text-white truncate">{b.title}</span>
                                    <a href={`https://app.contentful.com/spaces/${process.env.CONTENTFUL_SPACE_ID}/entries/${b.sys.id}`} target="_blank" className="text-xs text-[var(--brand-yellow)] underline transition-opacity">Edit</a>
                                </div>
                            ))}

                            <div className="h-px bg-gray-800 my-4"></div>

                            {/* Recent FAQs */}
                            <h3 className="text-xs uppercase tracking-widest text-gray-500 mb-2">Recent FAQs</h3>
                            {faqs.slice(0, 3).map(f => (
                                <div key={f.sys.id} className="flex justify-between items-center group">
                                    <span className="text-sm text-gray-300 group-hover:text-white truncate">{f.question}</span>
                                    <a href={`https://app.contentful.com/spaces/${process.env.CONTENTFUL_SPACE_ID}/entries/${f.sys.id}`} target="_blank" className="text-xs text-[var(--brand-yellow)] underline transition-opacity">Edit</a>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
}
