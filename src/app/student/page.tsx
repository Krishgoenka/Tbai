
import { getAssignments } from "@/lib/assignment-data";
import { StudentAssignmentDashboard } from "./student-assignment-dashboard";
import type { Assignment } from "@/app/admin/assignments/schema";
import { getSubmissionsForStudent } from "@/lib/submission-data";
import { auth } from "@/lib/firebase";
import { headers } from "next/headers";
import { getAuthenticatedUser } from "@/lib/auth";

export default async function StudentSubmissionsPage() {
  const user = await getAuthenticatedUser();

  if (!user) {
    // This case should be handled by middleware or AuthProvider, but as a fallback:
    return <p>Please log in to view assignments.</p>;
  }

  // Fetch ONLY published assignments on the server.
  const allAssignments: Assignment[] = await getAssignments({ publishedOnly: true });
  const studentSubmissions = await getSubmissionsForStudent(user.email!);

  const now = new Date();
  const activeAssignments = allAssignments.filter(a => new Date(a.dueDate) >= now);
  const pastAssignments = allAssignments.filter(a => new Date(a.dueDate) < now);

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">My Assignments</h1>
      <StudentAssignmentDashboard 
        initialActiveAssignments={activeAssignments}
        initialPastAssignments={pastAssignments}
        initialSubmissions={studentSubmissions}
      />
    </div>
  );
}
