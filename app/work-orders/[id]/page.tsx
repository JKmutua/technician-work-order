// app/work-orders/[id]/page.tsx
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getWorkOrderById } from '@/lib/data';
import DeleteButton from '@/app/components/DeleteButton';

export const revalidate = 0;

interface PageProps {
    params: Promise<{ id: string }>;
}

function getPriorityConfig(priority: string) {
    switch (priority) {
        case 'High':
            return {
                bg: 'bg-red-50',
                text: 'text-red-700',
                ring: 'ring-2 ring-red-600/20',
                icon: '🔴',
                gradient: 'from-red-500 to-red-600'
            };
        case 'Medium':
            return {
                bg: 'bg-amber-50',
                text: 'text-amber-700',
                ring: 'ring-2 ring-amber-600/20',
                icon: '🟡',
                gradient: 'from-amber-500 to-amber-600'
            };
        case 'Low':
            return {
                bg: 'bg-emerald-50',
                text: 'text-emerald-700',
                ring: 'ring-2 ring-emerald-600/20',
                icon: '🟢',
                gradient: 'from-emerald-500 to-emerald-600'
            };
        default:
            return {
                bg: 'bg-gray-50',
                text: 'text-gray-700',
                ring: 'ring-2 ring-gray-600/20',
                icon: '⚪',
                gradient: 'from-gray-500 to-gray-600'
            };
    }
}

function getStatusConfig(status: string) {
    switch (status) {
        case 'Done':
            return {
                bg: 'bg-emerald-50',
                text: 'text-emerald-700',
                ring: 'ring-2 ring-emerald-600/20',
                icon: '✅',
                gradient: 'from-emerald-500 to-emerald-600'
            };
        case 'In Progress':
            return {
                bg: 'bg-blue-50',
                text: 'text-blue-700',
                ring: 'ring-2 ring-blue-600/20',
                icon: '🔵',
                gradient: 'from-blue-500 to-blue-600'
            };
        case 'Open':
            return {
                bg: 'bg-slate-50',
                text: 'text-slate-700',
                ring: 'ring-2 ring-slate-600/20',
                icon: '⚪',
                gradient: 'from-slate-500 to-slate-600'
            };
        default:
            return {
                bg: 'bg-gray-50',
                text: 'text-gray-700',
                ring: 'ring-2 ring-gray-600/20',
                icon: '⚪',
                gradient: 'from-gray-500 to-gray-600'
            };
    }
}

export default async function WorkOrderDetailPage({ params }: PageProps) {
    const { id } = await params;
    const order = await getWorkOrderById(id);

    if (!order) {
        notFound();
    }

    const priorityConfig = getPriorityConfig(order.priority);
    const statusConfig = getStatusConfig(order.status);

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Breadcrumb */}
                <div className="mb-8">
                    <Link
                        href="/work-orders"
                        className="inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-700 transition-colors"
                    >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Back to Work Orders
                    </Link>
                </div>

                {/* Main Content Card */}
                <div className="bg-white shadow-xl rounded-2xl border border-gray-100 overflow-hidden">
                    {/* Header Section */}
                    <div className="bg-gradient-to-r from-indigo-500 to-purple-600 px-8 py-6">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                    </div>
                                    <span className="text-white/80 text-sm font-medium">Work Order Details</span>
                                </div>
                                <h1 className="text-2xl font-bold text-white mb-2">{order.title}</h1>
                                <p className="text-white/70 text-sm">Created: {new Date(order.createdAt).toLocaleDateString()}</p>
                            </div>
                            <div className="flex gap-2">
                                <Link
                                    href={`/work-orders/${order.id}/edit`}
                                    className="inline-flex items-center px-4 py-2.5 bg-white text-indigo-600 font-semibold rounded-lg hover:bg-indigo-50 transition-colors shadow-lg"
                                >
                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                    </svg>
                                    Edit
                                </Link>
                                <DeleteButton workOrderId={order.id} />
                            </div>
                        </div>
                    </div>

                    {/* Status Cards Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-8 bg-gray-50">
                        {/* Priority Card */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
                            <div className="flex items-center gap-3 mb-3">
                                <div className={`w-10 h-10 bg-gradient-to-br ${priorityConfig.gradient} rounded-lg flex items-center justify-center`}>
                                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</p>
                                    <p className="text-lg font-bold text-gray-900">{order.priority}</p>
                                </div>
                            </div>
                            <span className={`inline-flex items-center gap-2 px-3 py-2 text-sm font-bold rounded-lg ${priorityConfig.bg} ${priorityConfig.text} ${priorityConfig.ring}`}>
                                <span className="text-base">{priorityConfig.icon}</span>
                                {order.priority} Priority
                            </span>
                        </div>

                        {/* Status Card */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
                            <div className="flex items-center gap-3 mb-3">
                                <div className={`w-10 h-10 bg-gradient-to-br ${statusConfig.gradient} rounded-lg flex items-center justify-center`}>
                                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Status</p>
                                    <p className="text-lg font-bold text-gray-900">{order.status}</p>
                                </div>
                            </div>
                            <span className={`inline-flex items-center gap-2 px-3 py-2 text-sm font-bold rounded-lg ${statusConfig.bg} ${statusConfig.text} ${statusConfig.ring}`}>
                                <span className="text-base">{statusConfig.icon}</span>
                                {order.status}
                            </span>
                        </div>

                        {/* Updated Card */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-10 h-10 bg-gradient-to-br from-gray-500 to-gray-600 rounded-lg flex items-center justify-center">
                                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Last Updated</p>
                                    <p className="text-lg font-bold text-gray-900">
                                        {new Date(order.updatedAt).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>
                            <p className="text-sm text-gray-600">
                                {new Date(order.updatedAt).toLocaleTimeString()}
                            </p>
                        </div>
                    </div>

                    {/* Description Section */}
                    <div className="p-8">
                        <div className="flex items-center gap-2 mb-4">
                            <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
                            </svg>
                            <h3 className="text-xl font-bold text-gray-900">Description</h3>
                        </div>
                        <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
                            {order.description ? (
                                <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">{order.description}</p>
                            ) : (
                                <div className="flex items-center gap-2 text-gray-500 italic">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    No description provided.
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Timeline Section */}
                    <div className="px-8 pb-8">
                        <div className="flex items-center gap-2 mb-4">
                            <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <h3 className="text-xl font-bold text-gray-900">Timeline</h3>
                        </div>
                        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-6 border border-indigo-100">
                            <div className="space-y-4">
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="font-semibold text-gray-900">Work Order Created</p>
                                        <p className="text-sm text-gray-600">{new Date(order.createdAt).toLocaleString()}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="font-semibold text-gray-900">Last Updated</p>
                                        <p className="text-sm text-gray-600">{new Date(order.updatedAt).toLocaleString()}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}