
"use client"

import { DataTable } from '../employees/data-table';
import { columns } from './columns';
import type { Assignment } from './schema';

interface AssignmentDataTableProps {
    assignments: Assignment[];
}

export function AssignmentDataTable({ assignments }: AssignmentDataTableProps) {
    return (
        <DataTable
            data={assignments}
            columns={columns}
            filterColumn="title"
            filterPlaceholder="Filter by title..."
        />
    )
}
