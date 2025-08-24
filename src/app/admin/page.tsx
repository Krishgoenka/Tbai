
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, BookCheck, Briefcase, Book, ArrowRight, GraduationCap } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getEmployees } from "@/lib/employee-data";
import { getSubmissions } from "@/lib/submission-data";
import { getStudents } from "@/lib/user-data";

export default async function AdminDashboardPage() {
  const employees = await getEmployees();
  const submissions = await getSubmissions();
  const students = await getStudents();

  const totalStudents = students.length;
  const totalEmployees = employees.length;
  const totalSubmissions = submissions.length;


  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
         <Card>
          <Link href="/admin/students">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Students
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalStudents}</div>
              <p className="text-xs text-muted-foreground">
                View all registered students
              </p>
            </CardContent>
          </Link>
        </Card>
        <Card>
           <Link href="/admin/employees">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Employees
              </CardTitle>
              <Briefcase className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalEmployees}</div>
              <p className="text-xs text-muted-foreground">
                Manage all employees
              </p>
            </CardContent>
          </Link>
        </Card>
        <Card>
          <Link href="/admin/submissions">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Submissions</CardTitle>
              <BookCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalSubmissions}</div>
              <p className="text-xs text-muted-foreground">
                View all student submissions
              </p>
            </CardContent>
          </Link>
        </Card>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4">Quick Actions</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card className="flex flex-col">
                <CardHeader>
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-primary/10 rounded-md">
                            <Book className="h-6 w-6 text-primary" />
                        </div>
                        <CardTitle>Manage Assignments</CardTitle>
                    </div>
                </CardHeader>
                <CardContent className="flex-grow">
                <CardDescription>Create, publish, and track student assignments.</CardDescription>
                </CardContent>
                <CardContent>
                    <Button asChild className="w-full">
                        <Link href="/admin/assignments">Go to Assignments <ArrowRight className="ml-2 h-4 w-4"/></Link>
                    </Button>
                </CardContent>
            </Card>
          <Card className="flex flex-col">
            <CardHeader>
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-primary/10 rounded-md">
                        <Users className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle>Manage Employees</CardTitle>
                </div>
            </CardHeader>
            <CardContent className="flex-grow">
              <CardDescription>Add, edit, or remove employees and manage their assigned tasks.</CardDescription>
            </CardContent>
            <CardContent>
                <Button asChild className="w-full">
                    <Link href="/admin/employees">Go to Employees <ArrowRight className="ml-2 h-4 w-4"/></Link>
                </Button>
            </CardContent>
          </Card>
            <Card className="flex flex-col">
                <CardHeader>
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-primary/10 rounded-md">
                            <GraduationCap className="h-6 w-6 text-primary" />
                        </div>
                        <CardTitle>Manage Students</CardTitle>
                    </div>
                </CardHeader>
                <CardContent className="flex-grow">
                    <CardDescription>View and manage all registered student accounts.</CardDescription>
                </CardContent>
                <CardContent>
                    <Button asChild className="w-full">
                        <Link href="/admin/students">Go to Students <ArrowRight className="ml-2 h-4 w-4"/></Link>
                    </Button>
                </CardContent>
            </Card>
            <Card className="flex flex-col">
                <CardHeader>
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-primary/10 rounded-md">
                            <BookCheck className="h-6 w-6 text-primary" />
                        </div>
                        <CardTitle>Manage Submissions</CardTitle>
                    </div>
                </CardHeader>
                <CardContent className="flex-grow">
                    <CardDescription>View and grade all student submissions.</CardDescription>
                </CardContent>
                <CardContent>
                    <Button asChild className="w-full">
                        <Link href="/admin/submissions">Go to Submissions <ArrowRight className="ml-2 h-4 w-4"/></Link>
                    </Button>
                </CardContent>
            </Card>
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4">Recent Activity</h2>
        <Card>
          <CardContent className="pt-6">
            <p className="text-muted-foreground">Activity feed will be displayed here.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
