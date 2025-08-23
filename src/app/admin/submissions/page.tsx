
import { getSubmissions } from '@/lib/submission-data';
import { z } from 'zod';
import { columns } from './columns';
import { DataTable } from '../employees/data-table';
import { AddSubmissionDialog } from './add-submission-dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Star, TrendingUp, TrendingDown } from 'lucide-react';
import { getAssignments } from '@/lib/assignment-data';
import { SubmissionsDashboard } from './submissions-dashboard';

export default async function SubmissionsPage() {
  // Fetch real data from Firestore
  const submissions = await getSubmissions();
  const assignments = await getAssignments();

  const assignmentTitles = ["All Assignments", ...assignments.map(a => a.title)];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Student Submissions</h1>
        <AddSubmissionDialog />
      </div>

      <SubmissionsDashboard
        initialSubmissions={submissions}
        assignmentTitles={assignmentTitles}
      />
    </div>
  );
}
