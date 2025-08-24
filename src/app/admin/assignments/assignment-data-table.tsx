
"use client"

import { useEffect, useState } from 'react';
import { getAssignments } from '@/lib/assignment-data';
import { columns } from './columns';
import { DataTable } from '../employees/data-table';
import type { Assignment } from './schema';
import { Skeleton } from '@/components/ui/skeleton';

export function AssignmentDataTable() {
    const [assignments, setAssignments] = useState<Assignment[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadAssignments() {
            setLoading(true);
            const data = await getAssignments();
            setAssignments(data);
            setLoading(false);
        }
        loadAssignments();
    }, []);

    if (loading) {
        return (
             <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <Skeleton className="h-8 w-[250px]" />
                </div>
                <div className="rounded-md border">
                    <div className="space-y-3 p-4">
                        <Skeleton className="h-5 w-full" />
                        <Skeleton className="h-5 w-full" />
                        <Skeleton className="h-5 w-full" />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <DataTable
            data={assignments}
            columns={columns}
            filterColumn="title"
            filterPlaceholder="Filter by title..."
        />
    )
}
