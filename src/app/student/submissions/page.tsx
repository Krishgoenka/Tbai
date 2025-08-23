"use client"

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Upload, FileText } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { getAssignments } from "@/lib/assignment-data";
import type { Assignment } from "@/app/admin/assignments/schema";
import { AssignmentCard } from "./assignment-card";

// Mock fetching assignments - in a real app this would be an API call
const assignmentsPromise = getAssignments({ publishedOnly: true });

export default function StudentSubmissionsPage() {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);
  
  useEffect(() => {
    assignmentsPromise.then(data => {
        setAssignments(data);
        if (data.length > 0) {
            setSelectedAssignment(data[0]);
        }
    });
  }, []);

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Assignment Submissions</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
            <Card>
                <CardHeader>
                    <CardTitle>Available Assignments</CardTitle>
                </CardHeader>
                <CardContent>
                    <ScrollArea className="h-[450px]">
                        <div className="space-y-4">
                            {assignments.length > 0 ? (
                                assignments.map((assignment) => (
                                    <AssignmentCard 
                                        key={assignment.id} 
                                        assignment={assignment} 
                                        isSelected={selectedAssignment?.id === assignment.id}
                                        onSelect={() => setSelectedAssignment(assignment)}
                                    />
                                ))
                            ) : (
                                <div className="text-sm text-muted-foreground text-center p-4">
                                    No published assignments available.
                                </div>
                            )}
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
                            <CardDescription>Due Date: {selectedAssignment.dueDate}</CardDescription>
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
                            <p className="text-sm text-muted-foreground">
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
    </div>
  );
}
