
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { UserCog, UserPlus } from "lucide-react";
import Link from "next/link";

export default function SignupPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="mx-auto max-w-lg w-full">
        <CardHeader>
          <CardTitle className="text-3xl text-center">Join TechnoBillion AI</CardTitle>
          <CardDescription className="text-center pt-2">
            Are you an administrator or a student? Choose your path to get started.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6">
          <Link href="/signup/student" className="block">
            <Card className="hover:bg-accent hover:border-primary transition-all">
              <CardHeader className="flex flex-row items-center gap-4">
                <UserPlus className="h-10 w-10 text-primary" />
                <div>
                  <CardTitle>I am a Student</CardTitle>
                  <CardDescription>
                    Submit assignments and track your progress.
                  </CardDescription>
                </div>
              </CardHeader>
            </Card>
          </Link>
          
          {/*
          <Link href="/signup/admin" className="block">
             <Card className="hover:bg-accent hover:border-primary transition-all">
               <CardHeader className="flex flex-row items-center gap-4">
                <UserCog className="h-10 w-10 text-primary" />
                <div>
                  <CardTitle>I am an Admin</CardTitle>
                  <CardDescription>
                    Manage employees, assignments, and submissions.
                  </CardDescription>
                </div>
              </CardHeader>
            </Card>
          </Link>
          */}
          
           <div className="mt-4 text-center text-sm">
            Already have an account?{" "}
            <Link href="/login" className="underline">
              Login
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
