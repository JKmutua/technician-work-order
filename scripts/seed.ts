// scripts/seed.ts
import { promises as fs } from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

const sampleWorkOrders = [
    {
        id: uuidv4(),
        title: 'Fix HVAC system in Building A',
        description: 'The air conditioning unit is not cooling properly. Need to check refrigerant levels and inspect compressor.',
        priority: 'High' as const,
        status: 'Open' as const,
        updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
    },
    {
        id: uuidv4(),
        title: 'Replace light bulbs in parking lot',
        description: 'Multiple light fixtures in the north parking lot need new bulbs. Approximately 15 fixtures affected.',
        priority: 'Medium' as const,
        status: 'In Progress' as const,
        updatedAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString()
    },
    {
        id: uuidv4(),
        title: 'Repair broken door lock - Room 305',
        description: 'The electronic lock on room 305 is malfunctioning. Users report difficulty accessing the room.',
        priority: 'High' as const,
        status: 'Open' as const,
        updatedAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString()
    },
    {
        id: uuidv4(),
        title: 'Routine maintenance - Elevator inspection',
        description: 'Quarterly elevator safety inspection and maintenance. All elevators in the main building.',
        priority: 'Low' as const,
        status: 'Done' as const,
        updatedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
    },
    {
        id: uuidv4(),
        title: 'Plumbing leak in restroom',
        description: 'Water leak detected under sink in 2nd floor restroom. Needs immediate attention to prevent water damage.',
        priority: 'High' as const,
        status: 'In Progress' as const,
        updatedAt: new Date(Date.now() - 30 * 60 * 1000).toISOString()
    },
    {
        id: uuidv4(),
        title: 'Paint hallway walls',
        description: 'Repaint walls in main hallway. Need to coordinate with building manager for access during off-hours.',
        priority: 'Low' as const,
        status: 'Open' as const,
        updatedAt: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString()
    }
];

async function seed() {
    const dataDir = path.join(process.cwd(), 'data');
    const dataFile = path.join(dataDir, 'work-orders.json');

    try {
        await fs.mkdir(dataDir, { recursive: true });

        await fs.writeFile(dataFile, JSON.stringify(sampleWorkOrders, null, 2));

        console.log('Seed data created successfully!');
        console.log(`File location: ${dataFile}`);
        console.log(`Created ${sampleWorkOrders.length} sample work orders`);
    } catch (error) {
        console.error('Error seeding data:', error);
        process.exit(1);
    }
}

seed();