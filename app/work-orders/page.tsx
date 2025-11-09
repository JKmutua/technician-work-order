import Link from 'next/link';
import { getAllWorkOrders } from '../../lib/data';
import StatusFilter from '../components/StatusFilter';
import DeleteButton from '../components/DeleteButton';

export const revalidate = 0;

interface PageProps {
    searchParams: Promise<{ status?: string }>;
}

function getPriorityColor(priority: string) {
    switch (priority) {
        case 'High': return 'bg-red-50 text-red-700 ring-1 ring-red-600/20';
        case 'Medium': return 'bg-amber-50 text-amber-700 ring-1 ring-amber-600/20';
        case 'Low': return 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600/20';
        default: return 'bg-gray-50 text-gray-700 ring-1 ring-gray-600/20';
    }
}

function getStatusColor(status: string) {
    switch (status) {
        case 'Done': return 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600/20';
        case 'In Progress': return 'bg-blue-50 text-blue-700 ring-1 ring-blue-600/20';
        case 'Open': return 'bg-slate-50 text-slate-700 ring-1 ring-slate-600/20';
        default: return 'bg-gray-50 text-gray-700 ring-1 ring-gray-600/20';
    }
}

export default async function WorkOrdersPage({ searchParams }: PageProps) {
    const { status } = await searchParams;
    const orders = await getAllWorkOrders(status);

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Stats Overview */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Total Orders</p>
                                <p className="text-3xl font-bold text-gray-900 mt-1">{orders.length}</p>
                            </div>
                            <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                                <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">In Progress</p>
                                <p className="text-3xl font-bold text-blue-600 mt-1">
                                    {orders.filter(o => o.status === 'In Progress').length}
                                </p>
                            </div>
                            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Completed</p>
                                <p className="text-3xl font-bold text-emerald-600 mt-1">
                                    {orders.filter(o => o.status === 'Done').length}
                                </p>
                            </div>
                            <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
                                <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Header Section */}
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">
                            Work Orders
                        </h1>
                        <p className="text-gray-600 mt-1">Manage and track all your work orders efficiently</p>
                    </div>
                    <Link
                        href="/work-orders/new"
                        className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 shadow-lg shadow-indigo-500/25 transition-all duration-200 hover:shadow-xl hover:shadow-indigo-500/30 hover:scale-105"
                    >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                        </svg>
                        Create New Order
                    </Link>
                </div>

                {/* Filter Section */}
                <div className="mb-6">
                    <StatusFilter />
                </div>

                {/* Content Section */}
                {orders.length === 0 ? (
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-16 text-center">
                        <div className="w-20 h-20 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-6 transform rotate-3">
                            <svg className="w-10 h-10 text-indigo-600 transform -rotate-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">No work orders yet</h3>
                        <p className="text-gray-600 mb-6 max-w-md mx-auto">Get started by creating your first work order to track and manage your tasks efficiently.</p>
                        <Link
                            href="/work-orders/new"
                            className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors"
                        >
                            Create Your First Order
                        </Link>
                    </div>
                ) : (
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead>
                                    <tr className="bg-gray-50">
                                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                                            Title
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                                            Priority
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                                            Status
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                                            Last Updated
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {orders.map((order) => (
                                        <tr
                                            key={order.id}
                                            className="hover:bg-indigo-50/50 transition-all duration-200 group"
                                        >
                                            <td className="px-6 py-5">
                                                <Link
                                                    href={`/work-orders/${order.id}`}
                                                    className="text-gray-900 hover:text-indigo-600 font-semibold group-hover:underline decoration-2 underline-offset-4 transition-all flex items-center"
                                                >
                                                    {order.title}
                                                    <svg className="w-4 h-4 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                    </svg>
                                                </Link>
                                            </td>
                                            <td className="px-6 py-5 whitespace-nowrap">
                                                <span className={`inline-flex items-center px-3 py-1.5 text-xs font-bold rounded-lg ${getPriorityColor(order.priority)}`}>
                                                    {order.priority}
                                                </span>
                                            </td>
                                            <td className="px-6 py-5 whitespace-nowrap">
                                                <span className={`inline-flex items-center px-3 py-1.5 text-xs font-bold rounded-lg ${getStatusColor(order.status)}`}>
                                                    <span className="w-1.5 h-1.5 rounded-full bg-current mr-2"></span>
                                                    {order.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-5 whitespace-nowrap text-sm text-gray-600 font-medium">
                                                {new Date(order.updatedAt).toLocaleString()}
                                            </td>
                                            <td className="px-6 py-5 whitespace-nowrap text-sm">
                                                <div className="flex items-center gap-2">
                                                    <Link
                                                        href={`/work-orders/${order.id}`}
                                                        className="inline-flex items-center px-3 py-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 rounded-lg hover:bg-emerald-100 transition-colors"
                                                    >
                                                        <svg className="w-3.5 h-3.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                        </svg>
                                                        View
                                                    </Link>
                                                    <Link
                                                        href={`/work-orders/${order.id}/edit`}
                                                        className="inline-flex items-center px-3 py-1.5 text-xs font-semibold text-indigo-700 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors"
                                                    >
                                                        <svg className="w-3.5 h-3.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                        </svg>
                                                        Edit
                                                    </Link>
                                                    <DeleteButton workOrderId={order.id} variant="icon" />
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}