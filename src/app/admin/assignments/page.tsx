
import { AddAssignmentDialog } from './add-assignment-dialog';
import { AssignmentDataTable } from './assignment-data-table';

export default async function AssignmentsPage() {

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Assignments</h1>
        <AddAssignmentDialog />
      </div>
      <AssignmentDataTable />
    </div>
  );
}
