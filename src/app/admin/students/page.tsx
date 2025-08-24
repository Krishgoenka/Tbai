
import { getStudents } from '@/lib/user-data';
import { StudentDataTable } from './student-data-table';
import { columns } from './columns';

export default async function StudentsPage() {
  const students = await getStudents();

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Students</h1>
      </div>
      <StudentDataTable data={students} columns={columns} />
    </div>
  );
}
