import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bot, Users, GraduationCap, UserPlus, UserCog } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="container mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Bot className="h-8 w-8 text-primary" />
          <span className="text-xl font-bold">TechnoBillion AI</span>
        </Link>
        <div className="flex items-center gap-4">
          <Button asChild>
            <Link href="/student">Student Section</Link>
          </Button>
           <Button variant="outline" asChild>
            <Link href="/admin">Admin Section</Link>
          </Button>
        </div>
      </header>

      <main className="flex-1">
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 text-center py-20 md:py-32">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tighter mb-4">
            The Future of AI-Powered Management
          </h1>
          <p className="max-w-2xl mx-auto text-lg md:text-xl text-muted-foreground mb-8">
            Streamline employee tasks, manage student assignments, and unlock powerful insights with our all-in-one AI platform.
          </p>
          <div className="flex justify-center gap-4">
             <Button size="lg" asChild>
              <Link href="/student">
                <UserPlus className="mr-2"/>
                Go to Student Section
              </Link>
            </Button>
             <Button size="lg" variant="secondary" asChild>
              <Link href="/admin">
                <UserCog className="mr-2"/>
                Go to Admin Section
              </Link>
            </Button>
          </div>
        </section>

        <section className="bg-card py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center mb-12">Platform Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card>
                <CardHeader className="items-center">
                  <div className="p-4 bg-primary/10 rounded-full">
                    <Users className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle className="pt-4">Employee Management</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  Effortlessly add employees, assign roles, and manage tasks. Keep your team organized and productive.
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="items-center">
                  <div className="p-4 bg-primary/10 rounded-full">
                    <GraduationCap className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle className="pt-4">Student Submissions</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  A dedicated portal for students to submit assignments. Admins can easily review and manage all submissions.
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="items-center">
                   <div className="p-4 bg-primary/10 rounded-full">
                    <Bot className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle className="pt-4">AI-Driven Insights</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  Leverage artificial intelligence to gain valuable insights from your data and make smarter decisions.
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>

      <footer className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} TechnoBillion AI. All rights reserved.</p>
      </footer>
    </div>
  );
}
