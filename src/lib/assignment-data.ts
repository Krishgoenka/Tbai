import { z } from 'zod';
import { assignmentSchema } from '@/app/admin/assignments/schema';

const assignmentsData = [
  {
    id: "ASN001",
    title: "Calculus Homework 3",
    description: "Complete exercises 1-10 on page 50 of the textbook. Show all your work for full credit. The topics covered include derivatives and integration.",
    dueDate: "2024-09-01",
    fileUrl: "/placeholder.pdf",
    status: "Published",
    submissions: 15,
  },
  {
    id: "ASN002",
    title: "History Essay: The Roman Empire",
    description: "Write a 5-page essay on the fall of the Roman Empire. Your essay should have a clear thesis statement, supporting arguments, and a conclusion. Please cite your sources using MLA format.",
    dueDate: "2024-09-10",
    fileUrl: "/placeholder.pdf",
    status: "Published",
    submissions: 8,
  },
   {
    id: "ASN003",
    title: "Physics Lab Report",
    description: "Submit the lab report for the 'Gravity and Motion' experiment. Include your hypothesis, methodology, data, analysis, and conclusion. The report should be no more than 10 pages.",
    dueDate: "2024-08-25",
    fileUrl: "/placeholder.pdf",
    status: "Published",
    submissions: 20,
  },
  {
    id: "ASN004",
    title: "Python Programming Challenge",
    description: "Write a Python script that sorts a list of 1 million integers using the Merge Sort algorithm. Your script will be tested for correctness and performance. Submit your .py file.",
    dueDate: "2024-09-15",
    fileUrl: "/placeholder.pdf",
    status: "Draft",
    submissions: 0,
  },
];

export async function getAssignments(options?: { publishedOnly?: boolean }) {
  // In a real app, you would fetch this from a database.
  // We use a promise to simulate async behavior.
  let data = z.array(assignmentSchema).parse(assignmentsData);

  if (options?.publishedOnly) {
    data = data.filter(assignment => assignment.status === 'Published');
  }
  
  return Promise.resolve(data);
}
