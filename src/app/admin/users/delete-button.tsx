"use client";

import { deleteAdminUser } from '@/app/actions/admin-actions';
import { Trash2, Loader2 } from 'lucide-react';
import { useState } from 'react';

export function DeleteAdminButton({ userId, userName }: { userId: string, userName: string }) {
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async () => {
        if (!confirm(`Are you sure you want to remove ${userName}?`)) return;

        setIsDeleting(true);
        const res = await deleteAdminUser(userId);
        setIsDeleting(false);

        if (!res.success) {
            alert(res.message);
        }
    };

    return (
        <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="text-red-500 hover:text-red-400 p-2 rounded hover:bg-red-900/20 transition-colors disabled:opacity-50"
            title="Remove User"
        >
            {isDeleting ? <Loader2 size={18} className="animate-spin" /> : <Trash2 size={18} />}
        </button>
    );
}
