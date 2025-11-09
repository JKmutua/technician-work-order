import { NextRequest, NextResponse } from 'next/server';
import { getWorkOrderById, updateWorkOrder, deleteWorkOrder } from '@/lib/data';
import { updateWorkOrderSchema } from '@/lib/validation';
import { ZodError } from 'zod';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const order = await getWorkOrderById(id);

        if (!order) {
            return NextResponse.json(
                { error: 'Work order not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(order);
    } catch (error) {
        console.error('Error fetching work order:', error);
        return NextResponse.json(
            { error: 'Failed to fetch work order' },
            { status: 500 }
        );
    }
}

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await request.json();

        const validatedData = updateWorkOrderSchema.parse(body);

        const updatedOrder = await updateWorkOrder(id, validatedData);

        if (!updatedOrder) {
            return NextResponse.json(
                { error: 'Work order not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(updatedOrder);
    } catch (error) {
        if (error instanceof ZodError) {
            return NextResponse.json(
                {
                    error: 'Validation failed',
                    details: error.errors.map(err => ({
                        field: err.path.join('.'),
                        message: err.message
                    }))
                },
                { status: 400 }
            );
        }

        console.error('Error updating work order:', error);
        return NextResponse.json(
            { error: 'Failed to update work order' },
            { status: 500 }
        );
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const deleted = await deleteWorkOrder(id);

        if (!deleted) {
            return NextResponse.json(
                { error: 'Work order not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting work order:', error);
        return NextResponse.json(
            { error: 'Failed to delete work order' },
            { status: 500 }
        );
    }
}