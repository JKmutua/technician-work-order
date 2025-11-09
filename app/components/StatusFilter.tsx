'use client';

import { useRouter, useSearchParams } from 'next/navigation';

export default function StatusFilter() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const currentStatus = searchParams.get('status') || '';

    const handleStatusChange = (status: string) => {
        const params = new URLSearchParams(searchParams.toString());

        if (status) {
            params.set('status', status);
        } else {
            params.delete('status');
        }

        router.push(`/work-orders?${params.toString()}`);
    };

    const statuses = [
        { value: '', label: 'All Orders', icon: '📋', color: 'indigo' },
        { value: 'Open', label: 'Open', icon: '⚪', color: 'slate' },
        { value: 'In Progress', label: 'In Progress', icon: '🔵', color: 'blue' },
        { value: 'Done', label: 'Done', icon: '✅', color: 'emerald' },
    ];

    const getButtonClasses = (status: string) => {
        const isActive = currentStatus === status;

        const colorClasses = {
            indigo: isActive
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30'
                : 'bg-white text-gray-700 hover:bg-indigo-50 border-gray-200',
            slate: isActive
                ? 'bg-slate-600 text-white shadow-lg shadow-slate-500/30'
                : 'bg-white text-gray-700 hover:bg-slate-50 border-gray-200',
            blue: isActive
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                : 'bg-white text-gray-700 hover:bg-blue-50 border-gray-200',
            emerald: isActive
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/30'
                : 'bg-white text-gray-700 hover:bg-emerald-50 border-gray-200',
        };

        return colorClasses[status as keyof typeof colorClasses] || colorClasses.indigo;
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                    </svg>
                    <span className="text-sm font-semibold text-gray-900">Filter by Status</span>
                </div>

                <div className="flex flex-wrap gap-2">
                    {statuses.map((status) => (
                        <button
                            key={status.value}
                            onClick={() => handleStatusChange(status.value)}
                            className={`
                                inline-flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium text-sm
                                border transition-all duration-200
                                ${getButtonClasses(status.color)}
                                ${currentStatus === status.value ? 'scale-105' : 'hover:scale-105'}
                            `}
                        >
                            <span className="text-base">{status.icon}</span>
                            <span>{status.label}</span>
                            {currentStatus === status.value && (
                                <svg className="w-4 h-4 ml-1" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                            )}
                        </button>
                    ))}
                </div>
            </div>

            {currentStatus && (
                <div className="mt-3 pt-3 border-t border-gray-100">
                    <button
                        onClick={() => handleStatusChange('')}
                        className="inline-flex items-center gap-1.5 text-sm text-gray-600 hover:text-gray-900 font-medium transition-colors"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        Clear filter
                    </button>
                </div>
            )}
        </div>
    );
}