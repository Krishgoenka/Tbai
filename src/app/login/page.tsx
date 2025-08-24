
"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Bot, UserPlus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";

const ADMIN_EMAIL = "goenkakrish02@gmail.com";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Explicitly check if the email is the admin email.
    if (email !== ADMIN_EMAIL) {
        toast({
            title: "Authorization Error",
            description: "You are not authorized to access the admin panel.",
            variant: "destructive",
        });
        setLoading(false);
        return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast({ title: "Success", description: "Logged in successfully! Redirecting..." });
      // AuthProvider will handle redirection based on role
    } catch (error: any) {
      console.error("Login Error:", error);
      toast({ title: "Login Error", description: "Invalid credentials. Please try again.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  // const handleGoogleLogin = async () => {
  //   setLoading(true);
  //   const provider = new GoogleAuthProvider();
  //   try {
  //       await signInWithPopup(auth, provider);
  //       toast({ title: "Success", description: "Logged in successfully! Redirecting..." });
  //       // AuthProvider will handle user creation/checking and redirection
  //   } catch (error: any) {
  //       console.error("Google Login Error:", error);
  //       toast({ title: "Google Login Error", description: error.message, variant: "destructive" });
  //   } finally {
  //       setLoading(false);
  //   }
  // };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="mx-auto max-w-sm w-full">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <Bot className="h-10 w-10 text-primary" />
          </div>
          <CardTitle className="text-2xl text-center">Admin Login</CardTitle>
          <CardDescription className="text-center">
            Enter your credentials to access the admin dashboard.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
              </div>
              <Input 
                id="password" 
                type="password" 
                required 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
              />
            </div>
            <Button type="submit" disabled={loading} className="w-full">
              {loading ? 'Logging in...' : 'Login'}
            </Button>
            {/* 
            <Button onClick={handleGoogleLogin} disabled={loading} variant="outline" className="w-full">
              {loading ? 'Please wait...' : 'Login with Google'}
            </Button>
            */}
          </form>
           <Separator className="my-6" />
           <div className="text-center">
                <p className="text-sm text-muted-foreground mb-4">Are you a student?</p>
                <Button asChild variant="secondary" className="w-full">
                    <Link href="/signup">
                        <UserPlus className="mr-2" />
                        Sign Up Here
                    </Link>
                </Button>
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
