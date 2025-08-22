import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";

const recentSubmissions = [
    { title: "Calculus Homework 3", date: "2024-08-01", status: "Graded" },
    { title: "History Essay", date: "2024-08-02", status: "Submitted" },
];

export default function StudentProfilePage() {
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Student Profile</h1>
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
        <CardContent>
            <Separator className="my-4" />
             <div>
                <h3 className="text-lg font-semibold mb-4">Recent Submissions</h3>
                <div className="space-y-3">
                    {recentSubmissions.map((sub, i) => (
                        <div key={i} className="flex justify-between items-center p-3 rounded-lg border">
                           <div>
                             <p className="font-medium">{sub.title}</p>
                             <p className="text-sm text-muted-foreground">{sub.date}</p>
                           </div>
                           <Badge variant={sub.status === 'Graded' ? 'default' : 'secondary'}>{sub.status}</Badge>
                        </div>
                    ))}
                </div>
             </div>
        </CardContent>
      </Card>
    </div>
  )
}
