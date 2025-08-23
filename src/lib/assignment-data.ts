
import { z } from 'zod';
import { assignmentSchema, type Assignment } from '@/app/admin/assignments/schema';

// This is acting as our in-memory database for the demo.
let assignmentsData: Assignment[] = [
  {
    id: "ASN001",
    title: "Calculus Homework 3",
    description: "Complete exercises 1-10 on page 50 of the textbook. Show all your work for full credit. The topics covered include derivatives and integration.",
    dueDate: "2024-09-01T23:59",
    fileUrl: "/placeholder.pdf",
    status: "Published",
    submissions: 15,
  },
  {
    id: "ASN002",
    title: "History Essay: The Roman Empire",
    description: "Write a 5-page essay on the fall of the Roman Empire. Your essay should have a clear thesis statement, supporting arguments, and a conclusion. Please cite your sources using MLA format.",
    dueDate: "2024-09-10T23:59",
    fileUrl: "/placeholder.pdf",
    status: "Published",
    submissions: 8,
  },
   {
    id: "ASN003",
    title: "Physics Lab Report",
    description: "Submit the lab report for the 'Gravity and Motion' experiment. Include your hypothesis, methodology, data, analysis, and conclusion. The report should be no more than 10 pages.",
    dueDate: "2024-08-25T23:59",
    fileUrl: "/placeholder.pdf",
    status: "Published",
    submissions: 20,
  },
  {
    id: "ASN004",
    title: "Python Programming Challenge",
    description: "Write a Python script that sorts a list of 1 million integers using the Merge Sort algorithm. Your script will be tested for correctness and performance. Submit your .py file.",
    dueDate: "2024-09-15T23:59",
    fileUrl: "/placeholder.pdf",
    status: "Draft",
    submissions: 0,
  },
];

export async function getAssignments(options?: { publishedOnly?: boolean }) {
  // We use a promise to simulate async behavior.
  await new Promise(resolve => setTimeout(resolve, 50)); // Simulate network delay
  let data = z.array(assignmentSchema).parse(JSON.parse(JSON.stringify(assignmentsData)));

  if (options?.publishedOnly) {
    data = data.filter(assignment => assignment.status === 'Published');
  }
  
  return Promise.resolve(data);
}

export async function addMockAssignment(assignment: Omit<Assignment, 'id' | 'submissions' | 'fileUrl'>) {
    const newId = `ASN${String(assignmentsData.length + 1).padStart(3, '0')}`;
    const newAssignment: Assignment = {
        ...assignment,
        id: newId,
        submissions: 0,
        fileUrl: "/placeholder.pdf", // Placeholder since we don't handle file uploads yet
    };
    const validatedAssignment = assignmentSchema.parse(newAssignment);
    assignmentsData.unshift(validatedAssignment); // Add to the beginning of the list
    return validatedAssignment;
}

export async function updateMockAssignment(id: string, updatedData: Omit<Assignment, 'submissions' | 'fileUrl'>) {
    const index = assignmentsData.findIndex(a => a.id === id);
    if (index === -1) {
        throw new Error("Assignment not found");
    }
    
    const existingAssignment = assignmentsData[index];
    const newAssignmentData: Assignment = {
      ...existingAssignment,
      ...updatedData
    };
    
    const validatedAssignment = assignmentSchema.parse(newAssignmentData);
    assignmentsData[index] = validatedAssignment;
    return validatedAssignment;
}

export async function updateMockAssignmentStatus(id: string, status: "Published" | "Draft") {
     const index = assignmentsData.findIndex(a => a.id === id);
    if (index === -1) {
        throw new Error("Assignment not found");
    }
    assignmentsData[index].status = status;
    return assignmentsData[index];
}

export async function deleteMockAssignment(id: string) {
    const index = assignmentsData.findIndex(a => a.id === id);
    if (index === -1) {
        throw new Error("Assignment not found");
    }
    assignmentsData.splice(index, 1);
    return { success: true };
}
