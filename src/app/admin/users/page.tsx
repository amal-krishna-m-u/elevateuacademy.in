import { auth, signOut } from "@/auth";
import { sql } from "@vercel/postgres";
import { CreateAdminForm } from "./create-form"; // Client Component for form
import { DeleteAdminButton } from "./delete-button"; // Client Component for delete
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default async function AdminUsersPage() {
    const session = await auth();
    if (!session) {
        return (
            <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white gap-4">
                <h1 className="text-2xl font-bold">Access Denied</h1>
                <p className="text-gray-400">You do not have permission to view this page.</p>
                <form action={async () => {
                    'use server';
                    await signOut({ redirectTo: '/api/auth/signin' });
                }}>
                    <button className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg transition-colors">
                        Sign Out & Retry
                    </button>
                </form>
            </div>
        );
    }

    // Fetch Users
    const { rows: users } = await sql`SELECT id, name, email, role, created_at FROM users ORDER BY created_at DESC`;

    return (
        <div className="min-h-screen bg-black text-white p-8 font-sans">
            <header className="max-w-4xl mx-auto mb-12 flex items-center gap-4">
                <Link href="/admin" className="p-2 bg-gray-900 rounded-full hover:bg-gray-800 transition-colors">
                    <ArrowLeft size={20} />
                </Link>
                <div>
                    <h1 className="text-3xl font-bold font-montserrat text-[var(--brand-yellow)]">Manage Team</h1>
                    <p className="text-gray-400 text-sm">Add or remove administrators.</p>
                </div>
            </header>

            <main className="max-w-4xl mx-auto space-y-12">

                {/* Add New User Section */}
                <section className="bg-[#111] p-8 rounded-2xl border border-gray-800">
                    <h2 className="text-xl font-bold mb-6">Add New Admin</h2>
                    <CreateAdminForm />
                </section>

                {/* List Users Section */}
                <section>
                    <h2 className="text-xl font-bold mb-6">Current Admins</h2>
                    <div className="bg-[#111] border border-gray-800 rounded-xl overflow-hidden">
                        {users.map((user) => (
                            <div key={user.id} className="p-6 border-b border-gray-800 last:border-0 flex justify-between items-center group">
                                <div>
                                    <div className="font-bold">{user.name} <span className="text-xs font-normal text-gray-500 ml-2">({user.role})</span></div>
                                    <div className="text-sm text-gray-400">{user.email}</div>
                                </div>

                                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                    {session.user?.id !== user.id && (
                                        <DeleteAdminButton userId={user.id} userName={user.name} />
                                    )}
                                    {session.user?.id === user.id && (
                                        <span className="text-xs text-gray-600 italic">Current User</span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

            </main>
        </div>
    );
}
