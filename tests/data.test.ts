import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { promises as fs } from 'fs';
import path from 'path';
import { createWorkOrder, getAllWorkOrders, updateWorkOrder, deleteWorkOrder } from '@/lib/data';

const TEST_DATA_FILE = path.join(process.cwd(), 'data', 'work-orders-test.json');

describe('Data Layer', () => {
    beforeEach(async () => {
        // Clean up test data file before each test
        try {
            await fs.unlink(TEST_DATA_FILE);
        } catch {
            // File doesn't exist, that's fine
        }
        // Ensure the data directory exists
        try {
            await fs.mkdir(path.dirname(TEST_DATA_FILE), { recursive: true });
        } catch {
            // Directory already exists
        }
    });

    afterEach(async () => {
        // Clean up test data file after each test
        try {
            await fs.unlink(TEST_DATA_FILE);
        } catch {
            // File doesn't exist, that's fine
        }
    });

    it('creates a new work order', async () => {
        const input = {
            title: 'Test Order',
            description: 'Test description',
            priority: 'High' as const
        };

        const order = await createWorkOrder(input);

        expect(order).toMatchObject({
            title: 'Test Order',
            description: 'Test description',
            priority: 'High',
            status: 'Open'
        });
        expect(order.id).toBeDefined();
        expect(order.updatedAt).toBeDefined();
    });

    it('retrieves all work orders', async () => {
        await createWorkOrder({
            title: 'Order 1',
            description: 'Desc 1',
            priority: 'High'
        });

        // Add a small delay to ensure different timestamps
        await new Promise(resolve => setTimeout(resolve, 10));

        await createWorkOrder({
            title: 'Order 2',
            description: 'Desc 2',
            priority: 'Low'
        });

        const orders = await getAllWorkOrders();
        expect(orders).toHaveLength(2);

        // Verify both orders exist
        const titles = orders.map(o => o.title);
        expect(titles).toContain('Order 1');
        expect(titles).toContain('Order 2');

        // Verify sorting: first order should be newer than or equal to second
        expect(new Date(orders[0].updatedAt).getTime())
            .toBeGreaterThanOrEqual(new Date(orders[1].updatedAt).getTime());

        // With the delay, Order 2 should be first (newest)
        expect(orders[0].title).toBe('Order 2');
        expect(orders[1].title).toBe('Order 1');
    });

    it('filters work orders by status', async () => {
        const order1 = await createWorkOrder({
            title: 'Order 1',
            description: 'Desc 1',
            priority: 'High'
        });

        await updateWorkOrder(order1.id, { status: 'Done' });

        await createWorkOrder({
            title: 'Order 2',
            description: 'Desc 2',
            priority: 'Low'
        });

        const openOrders = await getAllWorkOrders('Open');
        expect(openOrders).toHaveLength(1);
        expect(openOrders[0].title).toBe('Order 2');
    });

    it('updates a work order', async () => {
        const order = await createWorkOrder({
            title: 'Original Title',
            description: 'Original desc',
            priority: 'Low'
        });

        const updated = await updateWorkOrder(order.id, {
            title: 'Updated Title',
            status: 'In Progress'
        });

        expect(updated).toMatchObject({
            title: 'Updated Title',
            status: 'In Progress',
            priority: 'Low'
        });
    });

    it('deletes a work order', async () => {
        const order = await createWorkOrder({
            title: 'To Delete',
            description: 'Will be deleted',
            priority: 'Medium'
        });

        const deleted = await deleteWorkOrder(order.id);
        expect(deleted).toBe(true);

        const orders = await getAllWorkOrders();
        expect(orders).toHaveLength(0);
    });
});