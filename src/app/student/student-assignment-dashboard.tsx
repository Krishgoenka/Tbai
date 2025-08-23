

"use client"

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Upload, FileText, Book, CalendarCheck, CalendarX, Loader2 } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import type { Assignment } from "@/app/admin/assignments/schema";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { submitAssignment } from "./actions";

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
  initialActiveAssignments: Assignment[];
  initialPastAssignments: Assignment[];
}

export function StudentAssignmentDashboard({ initialActiveAssignments, initialPastAssignments }: StudentAssignmentDashboardProps) {
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // On initial load, select the first active assignment if it exists, otherwise the first past assignment.
    if (initialActiveAssignments.length > 0) {
      setSelectedAssignment(initialActiveAssignments[0]);
    } else if (initialPastAssignments.length > 0) {
      setSelectedAssignment(initialPastAssignments[0]);
    } else {
        setSelectedAssignment(null);
    }
  }, [initialActiveAssignments, initialPastAssignments]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setSelectedFile(event.target.files[0]);
    } else {
      setSelectedFile(null);
    }
  };

  const handleSubmit = async () => {
    if (!selectedAssignment) {
      toast({ title: "Error", description: "Please select an assignment first.", variant: "destructive" });
      return;
    }
    if (!selectedFile) {
      toast({ title: "Error", description: "Please select a file to upload.", variant: "destructive" });
      return;
    }
    
    setIsSubmitting(true);
    
    const result = await submitAssignment({
      assignmentId: selectedAssignment.id,
      assignmentTitle: selectedAssignment.title,
    });

    if (result.success) {
      toast({ title: "Success!", description: result.message });
      setSelectedFile(null);
      // Optionally reset the file input visually
      const fileInput = document.getElementById("assignment-file") as HTMLInputElement;
      if(fileInput) fileInput.value = "";
    } else {
      toast({ title: "Submission Failed", description: result.message, variant: "destructive" });
    }

    setIsSubmitting(false);
  };


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
                                    Active ({initialActiveAssignments.length})
                                </h3>
                                <div className="space-y-3">
                                    {initialActiveAssignments.length > 0 ? (
                                        initialActiveAssignments.map((assignment) => (
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
                                    Past Due ({initialPastAssignments.length})
                                </h3>
                                <div className="space-y-3">
                                    {initialPastAssignments.length > 0 ? (
                                        initialPastAssignments.map((assignment) => (
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
                                        onChange={handleFileChange}
                                        disabled={isSubmitting}
                                    />
                                    <p className="text-xs text-muted-foreground">
                                        Allowed types: PDF, JPG, PNG, MP4, PY, C, CPP, IPYNB, CSV.
                                    </p>
                                </div>
                                <Button onClick={handleSubmit} disabled={isSubmitting || !selectedFile}>
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Submitting...
                                        </>
                                    ) : (
                                        <>
                                            <Upload className="mr-2 h-4 w-4" />
                                            Submit Assignment
                                        </>
                                    )}
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
