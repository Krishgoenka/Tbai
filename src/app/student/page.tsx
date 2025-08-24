
"use client";

import { getAssignments } from "@/lib/assignment-data";
import { StudentAssignmentDashboard } from "./student-assignment-dashboard";
import type { Assignment } from "@/app/admin/assignments/schema";
import { getSubmissionsForStudent } from "@/lib/submission-data";
import { useAuth } from "@/hooks/use-auth";
import { useEffect, useState } from "react";
import type { Submission } from "../admin/submissions/schema";

export default function StudentSubmissionsPage() {
  const { user, loading } = useAuth();
  const [activeAssignments, setActiveAssignments] = useState<Assignment[]>([]);
  const [pastAssignments, setPastAssignments] = useState<Assignment[]>([]);
  const [studentSubmissions, setStudentSubmissions] = useState<Submission[]>([]);
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      if (user) {
        setPageLoading(true);
        const allAssignments = await getAssignments({ publishedOnly: true });
        const submissions = await getSubmissionsForStudent(user.email!);
        
        const now = new Date();
        setActiveAssignments(allAssignments.filter(a => new Date(a.dueDate) >= now));
        setPastAssignments(allAssignments.filter(a => new Date(a.dueDate) < now));
        setStudentSubmissions(submissions);
        setPageLoading(false);
      }
    }

    if (!loading) {
      fetchData();
    }
  }, [user, loading]);


  if (loading || pageLoading) {
    return <p>Loading assignments...</p>;
  }

  if (!user) {
    return <p>Please log in to view assignments.</p>;
  }

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
