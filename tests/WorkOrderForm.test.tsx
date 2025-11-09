// tests/WorkOrderForm.test.tsx
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useRouter } from 'next/navigation';
import WorkOrderForm from '@/app/components/WorkOrderForm';
import { WorkOrder } from '@/lib/types';

// Mock Next.js router
vi.mock('next/navigation', () => ({
    useRouter: vi.fn()
}));

describe('WorkOrderForm', () => {
    const mockPush = vi.fn();
    const mockRefresh = vi.fn();
    const mockBack = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
        (useRouter as any).mockReturnValue({
            push: mockPush,
            refresh: mockRefresh,
            back: mockBack
        });
        global.fetch = vi.fn();
    });

    describe('Create Mode', () => {
        it('renders create form with all required fields', () => {
            render(<WorkOrderForm mode="create" />);

            expect(screen.getByLabelText(/work order title/i)).toBeInTheDocument();
            expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
            expect(screen.getByText(/priority level/i)).toBeInTheDocument();
            expect(screen.getByRole('button', { name: /create work order/i })).toBeInTheDocument();
            expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();
        });

        it('renders priority buttons (Low, Medium, High)', () => {
            render(<WorkOrderForm mode="create" />);

            expect(screen.getByRole('button', { name: /low/i })).toBeInTheDocument();
            expect(screen.getByRole('button', { name: /medium/i })).toBeInTheDocument();
            expect(screen.getByRole('button', { name: /high/i })).toBeInTheDocument();
        });

        it('does not render status field in create mode', () => {
            render(<WorkOrderForm mode="create" />);

            expect(screen.queryByText(/current status/i)).not.toBeInTheDocument();
            expect(screen.queryByRole('button', { name: /open/i })).not.toBeInTheDocument();
        });

        it('defaults to Medium priority', () => {
            render(<WorkOrderForm mode="create" />);

            const mediumButton = screen.getByRole('button', { name: /medium/i });
            expect(mediumButton).toHaveClass('scale-105');
        });

        it('allows selecting different priority levels', () => {
            render(<WorkOrderForm mode="create" />);

            const highButton = screen.getByRole('button', { name: /high/i });
            fireEvent.click(highButton);

            expect(highButton).toHaveClass('scale-105');
        });

        it('submits form with valid data', async () => {
            const mockResponse = {
                id: '123',
                title: 'Test Work Order',
                description: 'Test description',
                priority: 'High',
                status: 'Open',
                updatedAt: new Date().toISOString()
            };

            (global.fetch as any).mockResolvedValueOnce({
                ok: true,
                json: async () => mockResponse
            });

            render(<WorkOrderForm mode="create" />);

            const titleInput = screen.getByLabelText(/work order title/i);
            const descriptionInput = screen.getByLabelText(/description/i);
            const highPriorityButton = screen.getByRole('button', { name: /high/i });
            const submitButton = screen.getByRole('button', { name: /create work order/i });

            fireEvent.change(titleInput, { target: { value: 'Test Work Order' } });
            fireEvent.change(descriptionInput, { target: { value: 'Test description' } });
            fireEvent.click(highPriorityButton);
            fireEvent.click(submitButton);

            await waitFor(() => {
                expect(global.fetch).toHaveBeenCalledWith(
                    '/api/work-orders',
                    expect.objectContaining({
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            title: 'Test Work Order',
                            description: 'Test description',
                            priority: 'High'
                        })
                    })
                );
            });

            await waitFor(() => {
                expect(mockPush).toHaveBeenCalledWith('/work-orders');
                expect(mockRefresh).toHaveBeenCalled();
            });
        });

        it('displays validation errors from API', async () => {
            const mockError = {
                error: 'Validation failed',
                details: [
                    { field: 'title', message: 'Title must be at least 2 characters' }
                ]
            };

            (global.fetch as any).mockResolvedValueOnce({
                ok: false,
                json: async () => mockError
            });

            render(<WorkOrderForm mode="create" />);

            const titleInput = screen.getByLabelText(/work order title/i);
            fireEvent.change(titleInput, { target: { value: 'A' } }); // Provide a short title to trigger server validation

            const submitButton = screen.getByRole('button', { name: /create work order/i });
            fireEvent.click(submitButton);

            await waitFor(() => {
                expect(screen.getByText('Title must be at least 2 characters')).toBeInTheDocument();
            });
        });

        it('displays general error message', async () => {
            const mockError = {
                error: 'Something went wrong'
            };

            (global.fetch as any).mockResolvedValueOnce({
                ok: false,
                json: async () => mockError
            });

            render(<WorkOrderForm mode="create" />);

            const titleInput = screen.getByLabelText(/work order title/i);
            fireEvent.change(titleInput, { target: { value: 'Test Title' } });

            const submitButton = screen.getByRole('button', { name: /create work order/i });
            fireEvent.click(submitButton);

            await waitFor(() => {
                expect(screen.getByText('Something went wrong')).toBeInTheDocument();
            });
        });

        it('handles network errors gracefully', async () => {
            (global.fetch as any).mockRejectedValueOnce(new Error('Network error'));

            render(<WorkOrderForm mode="create" />);

            const titleInput = screen.getByLabelText(/work order title/i);
            fireEvent.change(titleInput, { target: { value: 'Test Title' } });

            const submitButton = screen.getByRole('button', { name: /create work order/i });
            fireEvent.click(submitButton);

            await waitFor(() => {
                expect(screen.getByText('Failed to submit form. Please try again.')).toBeInTheDocument();
            });
        });

        it('disables submit button while submitting', async () => {
            let resolvePromise: (value: any) => void;
            const fetchPromise = new Promise(resolve => {
                resolvePromise = resolve;
            });

            (global.fetch as any).mockReturnValueOnce(fetchPromise);

            render(<WorkOrderForm mode="create" />);

            const titleInput = screen.getByLabelText(/work order title/i);
            fireEvent.change(titleInput, { target: { value: 'Test Title' } });

            const submitButton = screen.getByRole('button', { name: /create work order/i });
            fireEvent.click(submitButton);

            // Wait for the button to become disabled and show loading state
            await waitFor(() => {
                expect(submitButton).toBeDisabled();
                expect(screen.getByText(/saving/i)).toBeInTheDocument();
            });

            // Verify the fetch was called
            expect(global.fetch).toHaveBeenCalled();

            // Resolve the promise to complete the submission
            resolvePromise!({ ok: true, json: async () => ({ id: '1' }) });

            // Wait for navigation to be called
            await waitFor(() => {
                expect(mockPush).toHaveBeenCalledWith('/work-orders');
            });
        });

        it('navigates back when cancel is clicked', () => {
            render(<WorkOrderForm mode="create" />);

            const cancelButton = screen.getByRole('button', { name: /cancel/i });
            fireEvent.click(cancelButton);

            expect(mockBack).toHaveBeenCalled();
        });
    });

    describe('Edit Mode', () => {
        const existingWorkOrder: WorkOrder = {
            id: '123',
            title: 'Existing Work Order',
            description: 'Existing description',
            priority: 'Low',
            status: 'In Progress',
            updatedAt: new Date().toISOString()
        };

        it('renders edit form with existing data', () => {
            render(<WorkOrderForm mode="edit" workOrder={existingWorkOrder} />);

            const titleInput = screen.getByLabelText(/work order title/i) as HTMLInputElement;
            const descriptionInput = screen.getByLabelText(/description/i) as HTMLTextAreaElement;

            expect(titleInput.value).toBe('Existing Work Order');
            expect(descriptionInput.value).toBe('Existing description');
            expect(screen.getByRole('button', { name: /update work order/i })).toBeInTheDocument();
        });

        it('renders status field in edit mode', () => {
            render(<WorkOrderForm mode="edit" workOrder={existingWorkOrder} />);

            expect(screen.getByText(/current status/i)).toBeInTheDocument();
            expect(screen.getByRole('button', { name: /open/i })).toBeInTheDocument();
            expect(screen.getByRole('button', { name: /in progress/i })).toBeInTheDocument();
            expect(screen.getByRole('button', { name: /done/i })).toBeInTheDocument();
        });

        it('pre-selects existing priority and status', () => {
            render(<WorkOrderForm mode="edit" workOrder={existingWorkOrder} />);

            const lowButton = screen.getByRole('button', { name: /low/i });
            const inProgressButton = screen.getByRole('button', { name: /in progress/i });

            expect(lowButton).toHaveClass('scale-105');
            expect(inProgressButton).toHaveClass('scale-105');
        });

        it('allows changing status', () => {
            render(<WorkOrderForm mode="edit" workOrder={existingWorkOrder} />);

            const doneButton = screen.getByRole('button', { name: /done/i });
            fireEvent.click(doneButton);

            expect(doneButton).toHaveClass('scale-105');
        });

        it('submits updated data', async () => {
            const mockResponse = {
                ...existingWorkOrder,
                title: 'Updated Title',
                status: 'Done'
            };

            (global.fetch as any).mockResolvedValueOnce({
                ok: true,
                json: async () => mockResponse
            });

            render(<WorkOrderForm mode="edit" workOrder={existingWorkOrder} />);

            const titleInput = screen.getByLabelText(/work order title/i);
            const doneButton = screen.getByRole('button', { name: /done/i });
            const submitButton = screen.getByRole('button', { name: /update work order/i });

            fireEvent.change(titleInput, { target: { value: 'Updated Title' } });
            fireEvent.click(doneButton);
            fireEvent.click(submitButton);

            await waitFor(() => {
                expect(global.fetch).toHaveBeenCalledWith(
                    '/api/work-orders/123',
                    expect.objectContaining({
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            title: 'Updated Title',
                            description: 'Existing description',
                            priority: 'Low',
                            status: 'Done'
                        })
                    })
                );
            });

            await waitFor(() => {
                expect(mockPush).toHaveBeenCalledWith('/work-orders');
                expect(mockRefresh).toHaveBeenCalled();
            });
        });

        it('handles empty optional fields', () => {
            const workOrderWithoutDescription: WorkOrder = {
                ...existingWorkOrder,
                description: ''
            };

            render(<WorkOrderForm mode="edit" workOrder={workOrderWithoutDescription} />);

            const descriptionInput = screen.getByLabelText(/description/i) as HTMLTextAreaElement;
            expect(descriptionInput.value).toBe('');
        });
    });

    describe('Form Validation', () => {
        it('shows required field indicator for title', () => {
            render(<WorkOrderForm mode="create" />);

            const titleLabel = screen.getByText(/work order title/i).closest('label');
            expect(titleLabel).toHaveTextContent('*');
        });

        it('shows required field indicator for priority', () => {
            render(<WorkOrderForm mode="create" />);

            const priorityLabel = screen.getByText(/priority level/i).closest('label');
            expect(priorityLabel).toHaveTextContent('*');
        });

        it('marks description as optional', () => {
            render(<WorkOrderForm mode="create" />);

            expect(screen.getByText(/optional/i)).toBeInTheDocument();
        });

        it('applies error styling to title input when error exists', async () => {
            const mockError = {
                error: 'Validation failed',
                details: [
                    { field: 'title', message: 'Title is required' }
                ]
            };

            (global.fetch as any).mockResolvedValueOnce({
                ok: false,
                json: async () => mockError
            });

            render(<WorkOrderForm mode="create" />);

            const titleInput = screen.getByLabelText(/work order title/i);
            fireEvent.change(titleInput, { target: { value: 'T' } }); // Provide minimal value to pass HTML validation

            const submitButton = screen.getByRole('button', { name: /create work order/i });
            fireEvent.click(submitButton);

            await waitFor(() => {
                expect(screen.getByText('Title is required')).toBeInTheDocument();
            });

            await waitFor(() => {
                expect(titleInput).toHaveClass('border-red-300');
            });
        });
    });
});