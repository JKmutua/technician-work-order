// lib/data.ts
import { promises as fs } from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { WorkOrder, CreateWorkOrderInput, UpdateWorkOrderInput } from './types';

const DATA_FILE = process.env.NODE_ENV === 'test'
    ? path.join(process.cwd(), 'data', 'work-orders-test.json')
    : path.join(process.cwd(), 'data', 'work-orders.json');

// Ensure data directory exists
async function ensureDataDir() {
    const dir = path.dirname(DATA_FILE);
    try {
        await fs.access(dir);
    } catch {
        await fs.mkdir(dir, { recursive: true });
    }
}

// Read all work orders
export async function getAllWorkOrders(statusFilter?: string): Promise<WorkOrder[]> {
    try {
        await ensureDataDir();
        const data = await fs.readFile(DATA_FILE, 'utf-8');
        let orders: WorkOrder[] = JSON.parse(data);

        if (statusFilter) {
            orders = orders.filter(order => order.status === statusFilter);
        }

        return orders.sort((a, b) =>
            new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        );
    } catch (error) {
        // If file doesn't exist, return empty array
        return [];
    }
}

// Get single work order by ID
export async function getWorkOrderById(id: string): Promise<WorkOrder | null> {
    const orders = await getAllWorkOrders();
    return orders.find(order => order.id === id) || null;
}

// Create new work order
export async function createWorkOrder(input: CreateWorkOrderInput): Promise<WorkOrder> {
    await ensureDataDir();
    const orders = await getAllWorkOrders();

    const newOrder: WorkOrder = {
        id: uuidv4(),
        title: input.title,
        description: input.description,
        priority: input.priority,
        status: 'Open',
        updatedAt: new Date().toISOString()
    };

    orders.push(newOrder);
    await fs.writeFile(DATA_FILE, JSON.stringify(orders, null, 2));

    return newOrder;
}

// Update work order
export async function updateWorkOrder(
    id: string,
    input: UpdateWorkOrderInput
): Promise<WorkOrder | null> {
    await ensureDataDir();
    const orders = await getAllWorkOrders();
    const index = orders.findIndex(order => order.id === id);

    if (index === -1) return null;

    orders[index] = {
        ...orders[index],
        ...input,
        updatedAt: new Date().toISOString()
    };

    await fs.writeFile(DATA_FILE, JSON.stringify(orders, null, 2));
    return orders[index];
}

// Delete work order
export async function deleteWorkOrder(id: string): Promise<boolean> {
    await ensureDataDir();
    const orders = await getAllWorkOrders();
    const filteredOrders = orders.filter(order => order.id !== id);

    if (filteredOrders.length === orders.length) return false;

    await fs.writeFile(DATA_FILE, JSON.stringify(filteredOrders, null, 2));
    return true;
}