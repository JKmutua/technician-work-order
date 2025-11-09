export type Priority = 'Low' | 'Medium' | 'High';
export type Status = 'Open' | 'In Progress' | 'Done';

export interface WorkOrder {
    id: string;
    title: string;
    description: string;
    priority: Priority;
    status: Status;
    updatedAt: string;
}

export interface CreateWorkOrderInput {
    title: string;
    description: string;
    priority: Priority;
}

export interface UpdateWorkOrderInput {
    title?: string;
    description?: string;
    priority?: Priority;
    status?: Status;
}