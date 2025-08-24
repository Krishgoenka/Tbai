
"use client"

import { DataTable } from '../employees/data-table';
import { columns } from './columns';
import type { Student } from './schema';

interface StudentDataTableProps {
    data: Student[];
    columns: typeof columns;
}

export function StudentDataTable({ data, columns }: StudentDataTableProps) {
    return (
        <DataTable
            data={data}
            columns={columns}
            filterColumn="displayName"
            filterPlaceholder="Filter by name..."
        />
    )
}
