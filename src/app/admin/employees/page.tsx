import { getEmployees } from '@/lib/employee-data';
import { z } from 'zod';
import { columns } from './columns';
import { DataTable } from './data-table';
import { employeeSchema } from './schema';
import { AddEmployeeDialog } from './add-employee-dialog';

export default async function EmployeesPage() {
  const employees = await getEmployees();

  return (
    <div className="space-y-8">
       <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Employees</h1>
        <AddEmployeeDialog />
      </div>
      <DataTable data={employees} columns={columns} />
    </div>
  );
}
