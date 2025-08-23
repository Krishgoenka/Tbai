"use client"

import { useMemo, useState } from 'react';
import { z } from 'zod';
import { columns } from './columns';
import { DataTable } from '../employees/data-table';
import { submissionSchema, Submission } from './schema';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Star, TrendingUp, TrendingDown, PlusCircle } from 'lucide-react';
import { AddSubmissionDialog } from './add-submission-dialog';
import { Label } from "@/components/ui/label";

const allSubmissions: Submission[] = [
    {
      id: "SUB001",
      studentName: "Alice Johnson",
      studentEmail: "alice@example.com",
      submissionDate: "2024-08-01",
      assignmentTitle: "Calculus Homework 3",
      fileUrl: "/placeholder.pdf",
      score: 95
    },
    {
      id: "SUB002",
      studentName: "Bob Williams",
      studentEmail: "bob@example.com",
      submissionDate: "2024-08-02",
      assignmentTitle: "Calculus Homework 3",
      fileUrl: "/placeholder.pdf",
      score: 88
    },
     {
      id: "SUB007",
      studentName: "Eve Davis",
      studentEmail: "eve@example.com",
      submissionDate: "2024-08-03",
      assignmentTitle: "Calculus Homework 3",
      fileUrl: "/placeholder.pdf",
      score: 76
    },
    {
      id: "SUB003",
      studentName: "Charlie Brown",
      studentEmail: "charlie@example.com",
      submissionDate: "2024-08-02",
      assignmentTitle: "History Essay: The Roman Empire",
      fileUrl: "/placeholder.pdf",
      score: 92
    },
    {
      id: "SUB004",
      studentName: "Diana Miller",
      studentEmail: "diana@example.com",
      submissionDate: "2024-08-04",
      assignmentTitle: "History Essay: The Roman Empire",
      fileUrl: "/placeholder.pdf",
      score: 85
    },
     {
      id: "SUB005",
      studentName: "Frank White",
      studentEmail: "frank@example.com",
      submissionDate: "2024-08-05",
      assignmentTitle: "Physics Lab Report",
      fileUrl: "/placeholder.pdf",
      score: 100
    },
    {
      id: "SUB006",
      studentName: "Grace Hall",
      studentEmail: "grace@example.com",
      submissionDate: "2024-08-05",
      assignmentTitle: "Physics Lab Report",
      fileUrl: "/placeholder.pdf",
      score: 81
    },
];

const assignmentTitles = ["All Assignments", ...Array.from(new Set(allSubmissions.map(s => s.assignmentTitle)))];


export default function SubmissionsPage() {
    const [submissions, setSubmissions] = useState<Submission[]>(z.array(submissionSchema).parse(allSubmissions));
    const [selectedAssignment, setSelectedAssignment] = useState("All Assignments");

    const filteredSubmissions = useMemo(() => {
        if (selectedAssignment === "All Assignments") {
            return submissions;
        }
        return submissions.filter(s => s.assignmentTitle === selectedAssignment);
    }, [submissions, selectedAssignment]);

    const analytics = useMemo(() => {
        if (filteredSubmissions.length === 0) {
            return { total: 0, average: 0, highest: 0, lowest: 0 };
        }
        const scores = filteredSubmissions.map(s => s.score).filter(s => s !== undefined) as number[];
        const total = scores.length;
        if (total === 0) {
             return { total: filteredSubmissions.length, average: 'N/A', highest: 'N/A', lowest: 'N/A' };
        }
        const sum = scores.reduce((acc, score) => acc + score, 0);
        const average = (sum / total).toFixed(1);
        const highest = Math.max(...scores);
        const lowest = Math.min(...scores);
        return { total: filteredSubmissions.length, average, highest, lowest };
    }, [filteredSubmissions]);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Student Submissions</h1>
        <AddSubmissionDialog />
      </div>

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

      <DataTable data={filteredSubmissions} columns={columns} />
    </div>
  );
}
