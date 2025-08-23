
import { getAssignments } from "@/lib/assignment-data";
import { StudentAssignmentDashboard } from "./student-assignment-dashboard";
import type { Assignment } from "@/app/admin/assignments/schema";

export default async function StudentSubmissionsPage() {
  // Fetch ONLY published assignments on the server.
  const allAssignments: Assignment[] = await getAssignments({ publishedOnly: true });

  const now = new Date();
  const activeAssignments = allAssignments.filter(a => new Date(a.dueDate) >= now);
  const pastAssignments = allAssignments.filter(a => new Date(a.dueDate) < now);

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">My Assignments</h1>
      <StudentAssignmentDashboard 
        initialActiveAssignments={activeAssignments}
        initialPastAssignments={pastAssignments}
      />
    </div>
  );
}
