import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

const submissionHistory = [
  { id: "SUB001", title: "Calculus Homework 3", date: "2024-08-01", status: "Graded", fileUrl: "/placeholder.pdf" },
  { id: "SUB002", title: "History Essay", date: "2024-08-02", status: "Submitted", fileUrl: "/placeholder.pdf" },
  { id: "SUB003", title: "Physics Lab Report", date: "2024-07-25", status: "Graded", fileUrl: "/placeholder.pdf" },
];

export default function StudentSubmissionsPage() {
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Assignment Submissions</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Submit New Assignment</CardTitle>
          <CardDescription>Upload your assignment file in PDF format.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="assignment-title">Assignment Title</Label>
            <Input id="assignment-title" placeholder="e.g., Physics Lab Report" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="assignment-file">Assignment File (PDF only)</Label>
            <Input id="assignment-file" type="file" accept=".pdf" />
          </div>
          <Button>
            <Upload className="mr-2 h-4 w-4" />
            Submit Assignment
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Submission History</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Assignment Title</TableHead>
                <TableHead>Submission Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>File</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {submissionHistory.map((sub) => (
                <TableRow key={sub.id}>
                  <TableCell className="font-medium">{sub.title}</TableCell>
                  <TableCell>{sub.date}</TableCell>
                  <TableCell>
                     <Badge variant={sub.status === 'Graded' ? 'default' : 'secondary'}>{sub.status}</Badge>
                  </TableCell>
                  <TableCell>
                    <Button variant="link" asChild className="p-0 h-auto">
                        <Link href={sub.fileUrl} target="_blank">View File</Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
