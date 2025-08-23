
"use client"

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Upload, FileText, Book, CalendarCheck, CalendarX } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import type { Assignment } from "@/app/admin/assignments/schema";
import { cn } from "@/lib/utils";

interface AssignmentCardProps {
  assignment: Assignment;
  isSelected: boolean;
  onSelect: () => void;
}

function AssignmentCard({ assignment, isSelected, onSelect }: AssignmentCardProps) {
  return (
    <button
      onClick={onSelect}
      className={cn(
        "w-full text-left p-4 rounded-lg border transition-colors",
        "flex items-start gap-4",
        isSelected
          ? "bg-primary/10 border-primary"
          : "hover:bg-accent hover:text-accent-foreground"
      )}
    >
        <div className="p-2 bg-muted rounded-md mt-1">
             <Book className="h-5 w-5 text-primary" />
        </div>
        <div>
            <p className="font-semibold">{assignment.title}</p>
            <p className="text-sm text-muted-foreground">Due: {new Date(assignment.dueDate).toLocaleString()}</p>
        </div>
    </button>
  );
}


interface StudentAssignmentDashboardProps {
  initialAssignments: Assignment[];
}

export function StudentAssignmentDashboard({ initialAssignments }: StudentAssignmentDashboardProps) {
  const [activeAssignments, setActiveAssignments] = useState<Assignment[]>([]);
  const [pastAssignments, setPastAssignments] = useState<Assignment[]>([]);
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);

  useEffect(() => {
    const now = new Date();
    const active = initialAssignments.filter(a => new Date(a.dueDate) >= now);
    const past = initialAssignments.filter(a => new Date(a.dueDate) < now);
    
    setActiveAssignments(active);
    setPastAssignments(past);

    if (initialAssignments.length > 0 && !selectedAssignment) {
      setSelectedAssignment(active.length > 0 ? active[0] : past[0]);
    } else if (initialAssignments.length === 0) {
        setSelectedAssignment(null);
    }
  }, [initialAssignments, selectedAssignment]);

  const allAssignments = [...activeAssignments, ...pastAssignments];

  return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
            <Card>
                <CardHeader>
                    <CardTitle>Available Assignments</CardTitle>
                </CardHeader>
                <CardContent>
                    <ScrollArea className="h-[600px]">
                        <div className="space-y-6">
                            <div>
                                <h3 className="flex items-center gap-2 text-lg font-semibold mb-3">
                                    <CalendarCheck className="h-5 w-5 text-green-500" />
                                    Active ({activeAssignments.length})
                                </h3>
                                <div className="space-y-3">
                                    {activeAssignments.length > 0 ? (
                                        activeAssignments.map((assignment) => (
                                            <AssignmentCard 
                                                key={assignment.id} 
                                                assignment={assignment} 
                                                isSelected={selectedAssignment?.id === assignment.id}
                                                onSelect={() => setSelectedAssignment(assignment)}
                                            />
                                        ))
                                    ) : (
                                        <p className="text-sm text-muted-foreground pl-4">No active assignments.</p>
                                    )}
                                </div>
                            </div>
                            <Separator />
                             <div>
                                <h3 className="flex items-center gap-2 text-lg font-semibold mb-3">
                                    <CalendarX className="h-5 w-5 text-red-500" />
                                    Past Due ({pastAssignments.length})
                                </h3>
                                <div className="space-y-3">
                                    {pastAssignments.length > 0 ? (
                                        pastAssignments.map((assignment) => (
                                            <AssignmentCard 
                                                key={assignment.id} 
                                                assignment={assignment} 
                                                isSelected={selectedAssignment?.id === assignment.id}
                                                onSelect={() => setSelectedAssignment(assignment)}
                                            />
                                        ))
                                    ) : (
                                        <p className="text-sm text-muted-foreground pl-4">No past due assignments.</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </ScrollArea>
                </CardContent>
            </Card>
        </div>

        <div className="md:col-span-2">
            <Card className="sticky top-20">
                 <CardHeader>
                    {selectedAssignment ? (
                        <>
                            <CardTitle>{selectedAssignment.title}</CardTitle>
                            <CardDescription>Due Date: {new Date(selectedAssignment.dueDate).toLocaleString()}</CardDescription>
                        </>
                    ) : (
                         <CardTitle>Select an Assignment</CardTitle>
                    )}
                </CardHeader>
                <CardContent>
                   <Separator className="mb-4" />
                   {selectedAssignment ? (
                    <div className="space-y-6">
                        <div>
                            <h3 className="font-semibold mb-2">Instructions</h3>
                            <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                                {selectedAssignment.description}
                            </p>
                        </div>
                        
                        {selectedAssignment.fileUrl && (
                            <div className="space-y-2">
                                <Button variant="outline" size="sm" asChild>
                                    <a href={selectedAssignment.fileUrl} target="_blank" rel="noopener noreferrer">
                                        <FileText className="mr-2 h-4 w-4" />
                                        View Attached PDF
                                    </a>

                                </Button>
                            </div>
                        )}
                        
                        <Separator className="my-4" />

                        <div>
                             <h3 className="font-semibold mb-4">Submit Your Work</h3>
                             <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="assignment-file">Upload File</Label>
                                    <Input 
                                        id="assignment-file" 
                                        type="file" 
                                        accept=".pdf,.png,.jpg,.jpeg,.mp4,.py,.c,.cpp,.ipynb,.csv" 
                                    />
                                    <p className="text-xs text-muted-foreground">
                                        Allowed types: PDF, JPG, PNG, MP4, PY, C, CPP, IPYNB, CSV.
                                    </p>
                                </div>
                                <Button>
                                    <Upload className="mr-2 h-4 w-4" />
                                    Submit Assignment
                                </Button>
                             </div>
                        </div>

                    </div>
                   ) : (
                    <div className="flex items-center justify-center h-60">
                        <p className="text-muted-foreground">Please select an assignment from the list to see details and submit.</p>
                    </div>
                   )}
                </CardContent>
            </Card>
        </div>
      </div>
  );
}
