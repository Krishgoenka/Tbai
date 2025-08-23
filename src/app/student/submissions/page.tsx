
import { getAssignments } from "@/lib/assignment-data";
import { SubmissionsClientLayout } from "./submissions-client-layout";
import type { Assignment } from "@/app/admin/assignments/schema";

export default async function StudentSubmissionsPage() {
  // Fetch ONLY published assignments on the server.
  // This guarantees the data is fresh and correct on every page load.
  const assignments: Assignment[] = await getAssignments({ publishedOnly: true });

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Assignment Submissions</h1>
      <SubmissionsClientLayout initialAssignments={assignments} />
    </div>
  );
}
