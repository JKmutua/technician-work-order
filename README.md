# Technician Work Orders - Next.js Assessment

A Next.js application for managing technician work orders with TypeScript, App Router, and file-based JSON persistence.

## Setup

```bash
# Install dependencies
npm install

# Install required dev dependencies for seed script
npm install -D tsx uuid @types/uuid

# Seed sample data
npm run seed

# Run development server
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

## Run

```bash
# Development
npm run dev

# Production
npm run build
npm start
```

## Seed Data

```bash
npm run seed
```

Creates `data/work-orders.json` with 6 sample work orders.

**Seed Script** (`scripts/seed.ts`):

```typescript
import { promises as fs } from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";

const sampleWorkOrders = [
  {
    id: uuidv4(),
    title: "Fix HVAC system in Building A",
    description:
      "The air conditioning unit is not cooling properly. Need to check refrigerant levels and inspect compressor.",
    priority: "High" as const,
    status: "Open" as const,
    updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: uuidv4(),
    title: "Replace light bulbs in parking lot",
    description:
      "Multiple light fixtures in the north parking lot need new bulbs. Approximately 15 fixtures affected.",
    priority: "Medium" as const,
    status: "In Progress" as const,
    updatedAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: uuidv4(),
    title: "Repair broken door lock - Room 305",
    description:
      "The electronic lock on room 305 is malfunctioning. Users report difficulty accessing the room.",
    priority: "High" as const,
    status: "Open" as const,
    updatedAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: uuidv4(),
    title: "Routine maintenance - Elevator inspection",
    description:
      "Quarterly elevator safety inspection and maintenance. All elevators in the main building.",
    priority: "Low" as const,
    status: "Done" as const,
    updatedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: uuidv4(),
    title: "Plumbing leak in restroom",
    description:
      "Water leak detected under sink in 2nd floor restroom. Needs immediate attention to prevent water damage.",
    priority: "High" as const,
    status: "In Progress" as const,
    updatedAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
  },
  {
    id: uuidv4(),
    title: "Paint hallway walls",
    description:
      "Repaint walls in main hallway. Need to coordinate with building manager for access during off-hours.",
    priority: "Low" as const,
    status: "Open" as const,
    updatedAt: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
  },
];

async function seed() {
  const dataDir = path.join(process.cwd(), "data");
  const dataFile = path.join(dataDir, "work-orders.json");

  try {
    await fs.mkdir(dataDir, { recursive: true });
    await fs.writeFile(dataFile, JSON.stringify(sampleWorkOrders, null, 2));

    console.log("Seed data created successfully!");
    console.log(`File location: ${dataFile}`);
    console.log(`Created ${sampleWorkOrders.length} sample work orders`);
  } catch (error) {
    console.error("Error seeding data:", error);
    process.exit(1);
  }
}

seed();
```

## Testing

```bash
# Run unit/component tests
npm test

# Watch mode
npm run test:watch
```

**Test Coverage:**

- Work order form validation
- Data module CRUD operations
- Component rendering with different states

Focus on core CRUD flows given the timebox constraints.

## Decisions Made (4-8 Hour Timebox)

**Time Spent:** 4 hours

### Architecture

- **App Router with Server Components**: Maximized server-side rendering, using Client Components only for forms, filters, and interactive elements
- **Route Handlers for API**: Clean separation with `/api/work-orders` endpoints for all CRUD operations
- **File-based JSON**: Simple persistence layer as specified, with auto-creation of data directory

### Filter/Search Choice

**Implemented: Status Filter** (Open/In Progress/Done)

Chose status filtering over text search because it's the primary workflow for technicians managing workload. More valuable for task organization within the timebox. Text search deferred as future enhancement.

### Validation

- **Server-side Zod schemas**: Title (2-80 chars), description (max 2000 chars), priority/status enums
- **Field-level errors**: Returned to forms for clear user feedback
- **Safe rendering**: No `dangerouslySetInnerHTML` used

### Cache Strategy

- List page: `revalidate: 60` (balance performance with freshness)
- Detail/edit pages: `cache: 'no-store'` (ensure latest data after updates)

### What I Prioritized

1. Complete CRUD functionality end-to-end
2. Proper Server/Client Component boundaries
3. Type safety across components and API
4. Clean, responsive UI with Tailwind CSS
5. Core unit/component tests

### What I Simplified

1. Implemented status filter only (not text search)
2. Basic tests covering critical paths (skipped comprehensive E2E)
3. Simple file I/O without advanced concurrency handling
4. No sorting, pagination, or bulk operations

### Tech Stack

- Next.js 14+ App Router
- TypeScript
- Tailwind CSS
- Zod validation
- Vitest + React Testing Library
- File-based JSON storage
