import { z } from 'zod';
import { columns } from './columns';
import { DataTable } from '../employees/data-table';
import { assignmentSchema } from './schema';
import { AddAssignmentDialog } from './add-assignment-dialog';

async function getAssignments() {
  // Mock data
  const data = [
    {
      id: "ASN001",
      title: "Calculus Homework 3",
      description: "Complete exercises 1-10 on page 50.",
      dueDate: "2024-09-01",
      fileUrl: "/placeholder.pdf",
      submissions: 15,
    },
    {
      id: "ASN002",
      title: "History Essay: The Roman Empire",
      description: "Write a 5-page essay on the fall of the Roman Empire.",
      dueDate: "2024-09-10",
      fileUrl: "/placeholder.pdf",
      submissions: 8,
    },
     {
      id: "ASN003",
      title: "Physics Lab Report",
      description: "Submit the report for the 'Gravity and Motion' lab.",
      dueDate: "2024-08-25",
      fileUrl: "/placeholder.pdf",
      submissions: 20,
    },
  ];

  return z.array(assignmentSchema).parse(data);
}

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
