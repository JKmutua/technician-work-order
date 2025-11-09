import { NextRequest, NextResponse } from 'next/server';
import { getAllWorkOrders, createWorkOrder } from '@/lib/data';
import { createWorkOrderSchema } from '@/lib/validation';
import { ZodError } from 'zod';

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const status = searchParams.get('status') || undefined;

        const orders = await getAllWorkOrders(status);
        return NextResponse.json(orders);
    } catch (error) {
        console.error('Error fetching work orders:', error);
        return NextResponse.json(
            { error: 'Failed to fetch work orders' },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        const validatedData = createWorkOrderSchema.parse(body);

        const newOrder = await createWorkOrder(validatedData);

        return NextResponse.json(newOrder, { status: 201 });
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

        console.error('Error creating work order:', error);
        return NextResponse.json(
            { error: 'Failed to create work order' },
            { status: 500 }
        );
    }
}