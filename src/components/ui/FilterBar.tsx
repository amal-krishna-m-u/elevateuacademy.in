"use client";

import { useState } from 'react';
import { Search } from 'lucide-react';
import { MagneticButton } from './MagneticButton';

interface FilterBarProps {
    categories: string[];
    onFilterChange: (category: string) => void;
    onSearchChange?: (query: string) => void;
    showSearch?: boolean;
    activeCategory: string;
}

export const FilterBar = ({
    categories,
    onFilterChange,
    onSearchChange,
    showSearch = false,
    activeCategory
}: FilterBarProps) => {
    return (
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-12">
            <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                {categories.map((cat) => (
                    <button
                        key={cat}
                        onClick={() => onFilterChange(cat)}
                        className={`px-6 py-2 rounded-full text-sm font-bold uppercase tracking-wider transition-all border ${activeCategory === cat
                            ? 'bg-[var(--brand-yellow)] text-black border-[var(--brand-yellow)]'
                            : 'bg-[#111] text-gray-300 border-gray-800 hover:border-gray-600'
                            }`}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {showSearch && onSearchChange && (
                <div className="relative w-full md:w-auto min-w-[300px]">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                    <input
                        type="text"
                        placeholder="Search topics..."
                        onChange={(e) => onSearchChange(e.target.value)}
                        className="w-full bg-[#111] border border-gray-800 rounded-full py-3 pl-12 pr-6 text-white text-sm focus:outline-none focus:border-[var(--brand-yellow)] transition-colors placeholder:text-gray-600"
                    />
                </div>
            )}
        </div>
    );
};
