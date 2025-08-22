import { promises as fs } from 'fs';
import path from 'path';
import { z } from 'zod';
import { columns } from './columns';
import { DataTable } from './data-table';
import { employeeSchema } from './schema';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { AddEmployeeDialog } from './add-employee-dialog';

// This is a placeholder function to get data.
// In a real app, you'd fetch this from your database.
async function getEmployees() {
  // Mock data
  const data = [
    {
      id: "EMP721",
      name: "John Doe",
      role: "Software Engineer",
      details: "Frontend specialist with React expertise.",
      tasks: [
        { description: "Develop new dashboard feature", date: "2024-08-15", status: "In Progress" },
        { description: "Fix login page bug", date: "2024-07-30", status: "Done" },
      ],
    },
     {
      id: "EMP452",
      name: "Jane Smith",
      role: "Project Manager",
      details: "Agile certified project manager.",
       tasks: [
        { description: "Plan Q4 roadmap", date: "2024-09-01", status: "To Do" },
      ],
    },
    {
      id: "EMP883",
      name: "Sam Wilson",
      role: "UI/UX Designer",
      details: "Focuses on user-centric design principles.",
      tasks: [],
    },
  ];

  return z.array(employeeSchema).parse(data);
}

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
