import { getAssignments } from '@/lib/assignment-data';
import { AddAssignmentDialog } from './add-assignment-dialog';
import { columns } from './columns';
import { DataTable } from '../employees/data-table';

export default async function AssignmentsPage() {
  const assignments = await getAssignments();

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Assignments</h1>
        <AddAssignmentDialog />
      </div>
      <DataTable data={assignments} columns={columns} />
    </div>
  );
}
