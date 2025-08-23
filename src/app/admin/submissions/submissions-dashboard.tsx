
"use client"

import { useMemo, useState } from 'react';
import { z } from 'zod';
import { columns } from './columns';
import { DataTable } from '../employees/data-table';
import { submissionSchema, Submission } from './schema';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Star, TrendingUp, TrendingDown } from 'lucide-react';
import { Label } from "@/components/ui/label";

interface SubmissionsDashboardProps {
    initialSubmissions: Submission[];
    assignmentTitles: string[];
}

export function SubmissionsDashboard({ initialSubmissions, assignmentTitles }: SubmissionsDashboardProps) {
    const [submissions, setSubmissions] = useState<Submission[]>(initialSubmissions);
    const [selectedAssignment, setSelectedAssignment] = useState("All Assignments");

    const filteredSubmissions = useMemo(() => {
        if (selectedAssignment === "All Assignments") {
            return submissions;
        }
        return submissions.filter(s => s.assignmentTitle === selectedAssignment);
    }, [submissions, selectedAssignment]);

    const analytics = useMemo(() => {
        const gradedSubmissions = filteredSubmissions.filter(s => typeof s.score === 'number');
        if (gradedSubmissions.length === 0) {
            return { total: filteredSubmissions.length, average: 'N/A', highest: 'N/A', lowest: 'N/A' };
        }
        const scores = gradedSubmissions.map(s => s.score) as number[];
        const sum = scores.reduce((acc, score) => acc + score, 0);
        const average = (sum / scores.length).toFixed(1);
        const highest = Math.max(...scores);
        const lowest = Math.min(...scores);
        return { total: filteredSubmissions.length, average, highest, lowest };
    }, [filteredSubmissions]);

  return (
    <>
       <div className="flex items-center space-x-4">
            <Label htmlFor="assignment-filter" className="text-sm font-medium">Filter by Assignment:</Label>
            <Select value={selectedAssignment} onValueChange={setSelectedAssignment}>
                <SelectTrigger id="assignment-filter" className="w-[300px]">
                    <SelectValue placeholder="Select an assignment" />
                </SelectTrigger>
                <SelectContent>
                    {assignmentTitles.map(title => (
                        <SelectItem key={title} value={title}>{title}</SelectItem>
                    ))}
                </SelectContent>
            </Select>
       </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Submissions</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Score</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.average}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Highest Score</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.highest}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Lowest Score</CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.lowest}</div>
          </CardContent>
        </Card>
      </div>

      <DataTable 
        data={filteredSubmissions} 
        columns={columns} 
        filterColumn="studentName"
        filterPlaceholder="Filter by student..."
      />
    </>
  );
}
