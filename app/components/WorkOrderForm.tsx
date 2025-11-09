'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { WorkOrder, Priority, Status } from '@/lib/types';

interface WorkOrderFormProps {
    workOrder?: WorkOrder;
    mode: 'create' | 'edit';
}

interface FormErrors {
    [key: string]: string;
}

export default function WorkOrderForm({ workOrder, mode }: WorkOrderFormProps) {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState<FormErrors>({});
    const [formData, setFormData] = useState({
        title: workOrder?.title || '',
        description: workOrder?.description || '',
        priority: workOrder?.priority || 'Medium' as Priority,
        status: workOrder?.status || 'Open' as Status
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setErrors({});

        try {
            const url = mode === 'create'
                ? '/api/work-orders'
                : `/api/work-orders/${workOrder?.id}`;

            const method = mode === 'create' ? 'POST' : 'PUT';

            const body = mode === 'create'
                ? { title: formData.title, description: formData.description, priority: formData.priority }
                : formData;

            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });

            const data = await response.json();

            if (!response.ok) {
                if (data.details) {
                    const fieldErrors: FormErrors = {};
                    data.details.forEach((err: { field: string; message: string }) => {
                        fieldErrors[err.field] = err.message;
                    });
                    setErrors(fieldErrors);
                } else {
                    setErrors({ general: data.error || 'An error occurred' });
                }
                setIsSubmitting(false);
                return;
            }

            router.push('/work-orders');
            router.refresh();
        } catch (error) {
            setErrors({ general: 'Failed to submit form. Please try again.' });
            setIsSubmitting(false);
        }
    };

    const priorities = [
        { value: 'Low', label: 'Low Priority', icon: '🟢', color: 'emerald' },
        { value: 'Medium', label: 'Medium Priority', icon: '🟡', color: 'amber' },
        { value: 'High', label: 'High Priority', icon: '🔴', color: 'red' },
    ];

    const statuses = [
        { value: 'Open', label: 'Open', icon: '⚪', color: 'slate' },
        { value: 'In Progress', label: 'In Progress', icon: '🔵', color: 'blue' },
        { value: 'Done', label: 'Done', icon: '✅', color: 'emerald' },
    ];

    return (
        <form onSubmit={handleSubmit} className="space-y-8">
            {errors.general && (
                <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg">
                    <div className="flex items-center">
                        <svg className="w-5 h-5 text-red-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                        <p className="text-red-700 font-medium">{errors.general}</p>
                    </div>
                </div>
            )}

            {/* Title Field */}
            <div className="space-y-2">
                <label htmlFor="title" className="flex items-center text-sm font-semibold text-gray-900">
                    <svg className="w-5 h-5 mr-2 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                    </svg>
                    Work Order Title
                    <span className="ml-1 text-red-500">*</span>
                </label>
                <input
                    type="text"
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g., Fix broken door handle in office 302"
                    className={`w-full px-4 py-3 border-2 rounded-xl shadow-sm transition-all duration-200 focus:outline-none focus:ring-4 ${errors.title
                        ? 'border-red-300 focus:border-red-500 focus:ring-red-100'
                        : 'border-gray-200 focus:border-indigo-500 focus:ring-indigo-100'
                        } placeholder:text-gray-400`}
                    required
                />
                {errors.title && (
                    <p className="flex items-center mt-2 text-sm text-red-600">
                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        {errors.title}
                    </p>
                )}
            </div>

            {/* Description Field */}
            <div className="space-y-2">
                <label htmlFor="description" className="flex items-center text-sm font-semibold text-gray-900">
                    <svg className="w-5 h-5 mr-2 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
                    </svg>
                    Description
                    <span className="ml-2 text-xs text-gray-500 font-normal">(Optional)</span>
                </label>
                <textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={5}
                    placeholder="Provide additional details about the work order..."
                    className={`w-full px-4 py-3 border-2 rounded-xl shadow-sm transition-all duration-200 focus:outline-none focus:ring-4 resize-none ${errors.description
                        ? 'border-red-300 focus:border-red-500 focus:ring-red-100'
                        : 'border-gray-200 focus:border-indigo-500 focus:ring-indigo-100'
                        } placeholder:text-gray-400`}
                />
                {errors.description && (
                    <p className="flex items-center mt-2 text-sm text-red-600">
                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        {errors.description}
                    </p>
                )}
                <p className="text-xs text-gray-500 flex items-center">
                    <svg className="w-3.5 h-3.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Add any relevant details, steps, or requirements
                </p>
            </div>

            {/* Priority Selection */}
            <div className="space-y-3">
                <label className="flex items-center text-sm font-semibold text-gray-900">
                    <svg className="w-5 h-5 mr-2 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    Priority Level
                    <span className="ml-1 text-red-500">*</span>
                </label>
                <div className="grid grid-cols-3 gap-3">
                    {priorities.map((priority) => (
                        <button
                            key={priority.value}
                            type="button"
                            onClick={() => setFormData({ ...formData, priority: priority.value as Priority })}
                            className={`relative p-4 rounded-xl border-2 transition-all duration-200 ${formData.priority === priority.value
                                ? `border-${priority.color}-500 bg-${priority.color}-50 shadow-lg scale-105`
                                : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-md'
                                }`}
                        >
                            <div className="flex flex-col items-center gap-2">
                                <span className="text-2xl">{priority.icon}</span>
                                <span className={`text-sm font-semibold ${formData.priority === priority.value ? 'text-gray-900' : 'text-gray-600'
                                    }`}>
                                    {priority.value}
                                </span>
                            </div>
                            {formData.priority === priority.value && (
                                <div className="absolute top-2 right-2">
                                    <svg className={`w-5 h-5 text-${priority.color}-600`} fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                </div>
                            )}
                        </button>
                    ))}
                </div>
            </div>

            {/* Status Selection (Edit mode only) */}
            {mode === 'edit' && (
                <div className="space-y-3">
                    <label className="flex items-center text-sm font-semibold text-gray-900">
                        <svg className="w-5 h-5 mr-2 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Current Status
                        <span className="ml-1 text-red-500">*</span>
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                        {statuses.map((status) => (
                            <button
                                key={status.value}
                                type="button"
                                onClick={() => setFormData({ ...formData, status: status.value as Status })}
                                className={`relative p-4 rounded-xl border-2 transition-all duration-200 ${formData.status === status.value
                                    ? `border-${status.color}-500 bg-${status.color}-50 shadow-lg scale-105`
                                    : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-md'
                                    }`}
                            >
                                <div className="flex flex-col items-center gap-2">
                                    <span className="text-2xl">{status.icon}</span>
                                    <span className={`text-sm font-semibold text-center ${formData.status === status.value ? 'text-gray-900' : 'text-gray-600'
                                        }`}>
                                        {status.label}
                                    </span>
                                </div>
                                {formData.status === status.value && (
                                    <div className="absolute top-2 right-2">
                                        <svg className={`w-5 h-5 text-${status.color}-600`} fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                )}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-200">
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 inline-flex items-center justify-center px-6 py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-4 focus:ring-indigo-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-500/30 transition-all duration-200 hover:scale-105 disabled:hover:scale-100"
                >
                    {isSubmitting ? (
                        <>
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Saving...
                        </>
                    ) : (
                        <>
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            {mode === 'create' ? 'Create Work Order' : 'Update Work Order'}
                        </>
                    )}
                </button>
                <button
                    type="button"
                    onClick={() => router.back()}
                    className="flex-1 sm:flex-none inline-flex items-center justify-center px-6 py-3.5 bg-white text-gray-700 font-semibold rounded-xl border-2 border-gray-300 hover:bg-gray-50 hover:border-gray-400 focus:outline-none focus:ring-4 focus:ring-gray-200 transition-all duration-200"
                >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    Cancel
                </button>
            </div>
        </form>
    );
}