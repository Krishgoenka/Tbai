import { promises as fs } from 'fs';
import path from 'path';
import { z } from 'zod';
import { columns } from './columns';
import { DataTable } from '../employees/data-table'; // Reusing the data-table component
import { submissionSchema } from './schema';

async function getSubmissions() {
  // Mock data
  const data = [
    {
      id: "SUB001",
      studentName: "Alice Johnson",
      studentEmail: "alice@example.com",
      submissionDate: "2024-08-01",
      assignmentTitle: "Calculus Homework 3",
      fileUrl: "/placeholder.pdf"
    },
    {
      id: "SUB002",
      studentName: "Bob Williams",
      studentEmail: "bob@example.com",
      submissionDate: "2024-08-02",
      assignmentTitle: "History Essay",
      fileUrl: "/placeholder.pdf"
    },
    {
      id: "SUB003",
      studentName: "Charlie Brown",
      studentEmail: "charlie@example.com",
      submissionDate: "2024-08-02",
      assignmentTitle: "Physics Lab Report",
      fileUrl: "/placeholder.pdf"
    },
  ];

  return z.array(submissionSchema).parse(data);
}

export default async function SubmissionsPage() {
  const submissions = await getSubmissions();

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Student Submissions</h1>
      <DataTable data={submissions} columns={columns} />
    </div>
  );
}
