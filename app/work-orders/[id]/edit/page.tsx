import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getWorkOrderById } from '@/lib/data';
import WorkOrderForm from '@/app/components/WorkOrderForm';

export const revalidate = 0;

interface PageProps {
    params: Promise<{ id: string }>;
}

export default async function EditWorkOrderPage({ params }: PageProps) {
    const { id } = await params;
    const order = await getWorkOrderById(id);

    if (!order) {
        notFound();
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Header Section */}
                <div className="mb-8">
                    <Link
                        href="/work-orders"
                        className="inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-700 mb-4 transition-colors"
                    >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Back to Work Orders
                    </Link>
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/30">
                            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Edit Work Order</h1>
                            <p className="text-gray-600 mt-1 text-sm">Update the details of work order #{order.id}</p>
                        </div>
                    </div>
                </div>

                {/* Grid Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                    {/* Form Section - 3 columns */}
                    <div className="lg:col-span-3">
                        <div className="bg-white shadow-xl rounded-2xl border border-gray-100 p-8">
                            <WorkOrderForm mode="edit" workOrder={order} />
                        </div>
                    </div>

                    {/* Help Section - 2 columns */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Tips Card */}
                        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl border border-indigo-100 p-6 sticky top-6">
                            <div className="flex items-start gap-3 mb-4">
                                <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <svg className="w-5 h-5 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900">Editing Tips</h3>
                                    <p className="text-sm text-gray-600 mt-1">Best practices when updating work orders</p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="bg-white rounded-xl p-4 shadow-sm">
                                    <div className="flex items-start gap-3">
                                        <span className="text-2xl">📝</span>
                                        <div>
                                            <h4 className="font-semibold text-gray-900 text-sm mb-1">Update Title if Needed</h4>
                                            <p className="text-sm text-gray-600">Make sure the title still accurately reflects the task</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white rounded-xl p-4 shadow-sm">
                                    <div className="flex items-start gap-3">
                                        <span className="text-2xl">🔄</span>
                                        <div>
                                            <h4 className="font-semibold text-gray-900 text-sm mb-1">Reflect Current Status</h4>
                                            <p className="text-sm text-gray-600">Update priority or status if circumstances have changed</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white rounded-xl p-4 shadow-sm">
                                    <div className="flex items-start gap-3">
                                        <span className="text-2xl">💬</span>
                                        <div>
                                            <h4 className="font-semibold text-gray-900 text-sm mb-1">Add Progress Notes</h4>
                                            <p className="text-sm text-gray-600">Use description to log updates, fixes, or new findings</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white rounded-xl p-4 shadow-sm">
                                    <div className="flex items-start gap-3">
                                        <span className="text-2xl">✅</span>
                                        <div>
                                            <h4 className="font-semibold text-gray-900 text-sm mb-1">Mark as Complete</h4>
                                            <p className="text-sm text-gray-600">Set status to "Completed" when work is fully done</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-6 pt-6 border-t border-indigo-200">
                                <div className="flex items-center gap-2 text-sm text-indigo-700">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                    </svg>
                                    <span className="font-medium">Need help? Contact support</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}