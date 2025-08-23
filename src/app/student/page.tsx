
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, CalendarCheck, CalendarX } from "lucide-react";
import { getAssignments } from "@/lib/assignment-data";
import type { Assignment } from "@/app/admin/assignments/schema";
import { cn } from "@/lib/utils";

async function StudentAssignments() {
    const allPublishedAssignments: Assignment[] = await getAssignments({ publishedOnly: true });
    const now = new Date();

    const activeAssignments = allPublishedAssignments.filter(a => new Date(a.dueDate) >= now);
    const pastAssignments = allPublishedAssignments.filter(a => new Date(a.dueDate) < now);

    const AssignmentListItem = ({ assignment }: { assignment: Assignment }) => (
         <div className="flex justify-between items-center p-3 rounded-lg border">
            <div>
                <p className="font-medium">{assignment.title}</p>
                <p className="text-sm text-muted-foreground">Due: {new Date(assignment.dueDate).toLocaleString()}</p>
            </div>
            <Button asChild variant="secondary" size="sm">
                <Link href="/student/submissions">
                    View Assignment <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
            </Button>
        </div>
    );

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
                <CardHeader>
                    <div className="flex items-center gap-3">
                        <CalendarCheck className="h-6 w-6 text-primary" />
                        <CardTitle>Active Assignments ({activeAssignments.length})</CardTitle>
                    </div>
                    <CardDescription>These are your assignments that are currently open for submission.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                    {activeAssignments.length > 0 ? (
                        activeAssignments.map((sub) => <AssignmentListItem key={sub.id} assignment={sub} />)
                    ) : (
                         <p className="text-sm text-muted-foreground text-center py-4">No active assignments. Great job!</p>
                    )}
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <div className="flex items-center gap-3">
                        <CalendarX className="h-6 w-6 text-muted-foreground" />
                        <CardTitle>Past Assignments ({pastAssignments.length})</CardTitle>
                    </div>
                     <CardDescription>These are assignments where the deadline has passed.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                    {pastAssignments.length > 0 ? (
                        pastAssignments.map((sub) => <AssignmentListItem key={sub.id} assignment={sub} />)
                    ) : (
                         <p className="text-sm text-muted-foreground text-center py-4">No past due assignments.</p>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}


export default function StudentProfilePage() {
  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src="https://placehold.co/100x100.png" data-ai-hint="student avatar" />
              <AvatarFallback>SP</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-2xl">Student Person</CardTitle>
              <CardDescription>student.person@example.com</CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>
      
      <div>
         <h2 className="text-2xl font-bold mb-4">My Assignments</h2>
         <StudentAssignments />
      </div>

    </div>
  )
}
