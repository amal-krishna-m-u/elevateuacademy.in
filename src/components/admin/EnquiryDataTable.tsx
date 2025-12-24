"use client";

import { useState, useMemo } from 'react';
import { deleteEnquiries } from '@/app/actions';
import { Trash2, Download, Search, Filter, Loader2, CheckSquare, Square } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface Enquiry {
    id: number;
    name: string;
    phone: string;
    course_interest: string;
    status: string;
    created_at: string;
}

interface EnquiryDataTableProps {
    initialEnquiries: Enquiry[];
}

export default function EnquiryDataTable({ initialEnquiries }: EnquiryDataTableProps) {
    const router = useRouter();
    const [searchTerm, setSearchTerm] = useState('');
    const [filterDate, setFilterDate] = useState('all'); // all, 7days, 30days
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [isDeleting, setIsDeleting] = useState(false);

    // Derived State: Filtered Enquiries
    const filteredEnquiries = useMemo(() => {
        return initialEnquiries.filter(enq => {
            // 1. Search Filter
            const searchLower = searchTerm.toLowerCase();
            const matchesSearch =
                enq.name.toLowerCase().includes(searchLower) ||
                enq.phone.includes(searchLower) ||
                (enq.course_interest || '').toLowerCase().includes(searchLower);

            // 2. Date Filter
            let matchesDate = true;
            if (filterDate !== 'all') {
                const date = new Date(enq.created_at);
                const now = new Date();
                const diffTime = Math.abs(now.getTime() - date.getTime());
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

                if (filterDate === '7days') matchesDate = diffDays <= 7;
                if (filterDate === '30days') matchesDate = diffDays <= 30;
            }

            return matchesSearch && matchesDate;
        });
    }, [initialEnquiries, searchTerm, filterDate]);

    // Selection Logic
    const toggleSelectAll = () => {
        if (selectedIds.length === filteredEnquiries.length && filteredEnquiries.length > 0) {
            setSelectedIds([]);
        } else {
            setSelectedIds(filteredEnquiries.map(e => e.id.toString()));
        }
    };

    const toggleSelectRow = (id: string) => {
        if (selectedIds.includes(id)) {
            setSelectedIds(selectedIds.filter(prevId => prevId !== id));
        } else {
            setSelectedIds([...selectedIds, id]);
        }
    };

    // CSV Export Logic
    const downloadCSV = (data: Enquiry[], filename: string) => {
        const headers = ["Date", "Name", "Phone", "Course Interest", "Status"];
        const rows = data.map(e => [
            new Date(e.created_at).toLocaleDateString('en-GB'),
            `"${e.name}"`, // Wrap in quotes to handle commas
            `"${e.phone}"`,
            `"${e.course_interest}"`,
            `"${e.status}"`
        ]);

        const csvContent = [
            headers.join(','),
            ...rows.map(r => r.join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', filename);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleBulkDelete = async () => {
        if (!confirm(`Are you sure you want to delete ${selectedIds.length} enquiries? This cannot be undone.`)) return;

        setIsDeleting(true);
        const res = await deleteEnquiries(selectedIds);
        setIsDeleting(false);

        if (res.success) {
            setSelectedIds([]);
            router.refresh(); // Refresh filtered lists
        } else {
            alert(res.message || "Failed to delete");
        }
    };

    return (
        <div className="space-y-6">
            {/* Toolbar */}
            <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-[#111] p-4 rounded-xl border border-gray-800">
                <div className="flex gap-4 w-full md:w-auto">
                    <div className="relative group w-full md:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[var(--brand-yellow)]" size={18} />
                        <input
                            type="text"
                            placeholder="Search name, phone..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-black border border-gray-800 rounded-lg pl-10 pr-4 py-2 text-sm focus:border-[var(--brand-yellow)] focus:outline-none transition-colors"
                        />
                    </div>
                    <select
                        value={filterDate}
                        onChange={(e) => setFilterDate(e.target.value)}
                        className="bg-black border border-gray-800 rounded-lg px-4 py-2 text-sm focus:border-[var(--brand-yellow)] focus:outline-none"
                    >
                        <option value="all">All Time</option>
                        <option value="7days">Last 7 Days</option>
                        <option value="30days">Last 30 Days</option>
                    </select>
                </div>

                <div className="flex gap-3">
                    <button
                        onClick={() => downloadCSV(filteredEnquiries, 'enquiries_view.csv')}
                        className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm font-medium transition-colors"
                        title="Export Current View"
                    >
                        <Download size={16} />
                        <span className="hidden sm:inline">Export View</span>
                    </button>
                </div>
            </div>

            {/* Bulk Action Bar (Floating) */}
            {selectedIds.length > 0 && (
                <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 bg-[#1a1a1a] border border-[var(--brand-yellow)] rounded-full px-6 py-3 shadow-[0_0_50px_rgba(0,0,0,0.5)] flex items-center gap-6 animate-in slide-in-from-bottom-4">
                    <span className="text-sm font-bold">{selectedIds.length} selected</span>
                    <div className="h-4 w-px bg-gray-700"></div>
                    <button
                        onClick={() => {
                            const selectedData = initialEnquiries.filter(e => selectedIds.includes(e.id.toString()));
                            downloadCSV(selectedData, 'selected_enquiries.csv');
                        }}
                        className="flex items-center gap-2 text-sm hover:text-[var(--brand-yellow)] transition-colors"
                    >
                        <Download size={16} />
                        Export
                    </button>
                    <button
                        onClick={handleBulkDelete}
                        disabled={isDeleting}
                        className="flex items-center gap-2 text-sm text-red-400 hover:text-red-300 transition-colors disabled:opacity-50"
                    >
                        {isDeleting ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
                        Delete
                    </button>
                    <button onClick={() => setSelectedIds([])} className="ml-2 text-xs text-gray-500 hover:text-white">
                        Clear
                    </button>
                </div>
            )}

            {/* Data Grid */}
            <div className="bg-[#111] border border-gray-800 rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-300">
                        <thead className="text-xs text-[var(--brand-yellow)] uppercase bg-[#0a0a0a] border-b border-gray-800">
                            <tr>
                                <th className="p-4 w-10">
                                    <button onClick={toggleSelectAll} className="hover:text-white transition-colors">
                                        {selectedIds.length === filteredEnquiries.length && filteredEnquiries.length > 0 ? (
                                            <CheckSquare size={18} />
                                        ) : (
                                            <Square size={18} />
                                        )}
                                    </button>
                                </th>
                                <th className="px-6 py-4">Date</th>
                                <th className="px-6 py-4">Name</th>
                                <th className="px-6 py-4">Interest</th>
                                <th className="px-6 py-4">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredEnquiries.map((enq) => {
                                const isSelected = selectedIds.includes(enq.id.toString());
                                return (
                                    <tr
                                        key={enq.id}
                                        className={`border-b border-gray-800 transition-colors ${isSelected ? 'bg-[var(--brand-yellow)]/5' : 'hover:bg-[#1a1a1a]'}`}
                                    >
                                        <td className="p-4">
                                            <button
                                                onClick={() => toggleSelectRow(enq.id.toString())}
                                                className={`transition-colors ${isSelected ? 'text-[var(--brand-yellow)]' : 'text-gray-600 hover:text-gray-400'}`}
                                            >
                                                {isSelected ? <CheckSquare size={18} /> : <Square size={18} />}
                                            </button>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">{new Date(enq.created_at).toLocaleDateString('en-GB')}</td>
                                        <td className="px-6 py-4">
                                            <div className="font-bold text-white">{enq.name}</div>
                                            <div className="text-xs text-gray-500 font-normal font-mono mt-1">{enq.phone}</div>
                                        </td>
                                        <td className="px-6 py-4">{enq.course_interest}</td>
                                        <td className="px-6 py-4">
                                            <span
                                                className={`px-2 py-1 rounded text-xs border ${enq.status === 'New'
                                                    ? 'bg-green-900/30 text-green-400 border-green-900/50'
                                                    : 'bg-blue-900/30 text-blue-400 border-blue-900/50'
                                                    }`}
                                            >
                                                {enq.status}
                                            </span>
                                        </td>
                                    </tr>
                                );
                            })}

                            {filteredEnquiries.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center">
                                        <div className="flex flex-col items-center gap-2">
                                            <Search size={32} className="text-gray-700" />
                                            <p className="text-gray-500 italic">No enquiries match your filters</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="text-xs text-gray-600 text-center">
                Showing {filteredEnquiries.length} of {initialEnquiries.length} total enquiries
            </div>
        </div>
    );
}
