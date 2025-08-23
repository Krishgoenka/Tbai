
"use client"

import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, CalendarCheck, CalendarX, Edit } from "lucide-react";
import { getAssignments } from "@/lib/assignment-data";
import type { Assignment } from "@/app/admin/assignments/schema";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

function StudentAssignments() {
    const [activeAssignments, setActiveAssignments] = useState<Assignment[]>([]);
    const [pastAssignments, setPastAssignments] = useState<Assignment[]>([]);
    
    useState(() => {
        const fetchAssignments = async () => {
            const allPublishedAssignments: Assignment[] = await getAssignments({ publishedOnly: true });
            const now = new Date();
            setActiveAssignments(allPublishedAssignments.filter(a => new Date(a.dueDate) >= now));
            setPastAssignments(allPublishedAssignments.filter(a => new Date(a.dueDate) < now));
        }
        fetchAssignments();
    });

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
    const { user } = useAuth();
    const { toast } = useToast();
    const [isEditing, setIsEditing] = useState(false);

    // Mock data state
    const [name, setName] = useState(user?.displayName || "Student Person");
    const [email, setEmail] = useState(user?.email || "student@example.com");

     const handleSave = () => {
        // In a real app, you would call a server action to update the user's data.
        console.log("Saving data:", { name, email });
        toast({
            title: "Success",
            description: "Profile updated successfully.",
        });
        setIsEditing(false);
    };

    const handleCancel = () => {
        // Reset fields to original values
        setName(user?.displayName || "Student Person");
        setEmail(user?.email || "student@example.com");
        setIsEditing(false);
    }

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
             <div className="flex items-center justify-between">
                 <div className="flex items-center gap-4">
                    <Avatar className="h-20 w-20">
                    <AvatarImage src={user?.photoURL || "https://placehold.co/100x100.png"} data-ai-hint="student avatar" />
                    <AvatarFallback>{name.charAt(0).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div>
                    <CardTitle className="text-2xl">{name}</CardTitle>
                    <CardDescription>{email}</CardDescription>
                    </div>
                </div>
                 {!isEditing && (
                    <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
                )}
            </div>
        </CardHeader>
        <Separator />
        <CardContent className="pt-6">
            <div className="space-y-6">
                <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input id="fullName" value={name} onChange={(e) => setName(e.target.value)} disabled={!isEditing} />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} disabled={!isEditing} />
                </div>
                {isEditing && (
                    <div className="flex justify-end gap-2">
                        <Button variant="outline" onClick={handleCancel}>Cancel</Button>
                        <Button onClick={handleSave}>Save Changes</Button>
                    </div>
                )}
           </div>
        </CardContent>
      </Card>
      
      <div>
         <h2 className="text-2xl font-bold mb-4">My Assignments</h2>
         <StudentAssignments />
      </div>

    </div>
  )
}
