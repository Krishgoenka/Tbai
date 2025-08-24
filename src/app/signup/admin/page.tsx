
"use client";

import Link from "next/link";
import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserCog } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

export default function AdminSignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
      toast({ title: "Error", description: "Password must be at least 6 characters long.", variant: "destructive" });
      return;
    }
     if (!fullName) {
      toast({ title: "Error", description: "Full name is required.", variant: "destructive" });
      return;
    }
    setLoading(true);
    try {
      // We'll set the role and name in temporary session storage.
      // The AuthProvider will pick this up after redirect to create the user doc.
      window.sessionStorage.setItem('signupRole', 'admin');
      window.sessionStorage.setItem('signupName', fullName);
      
      await createUserWithEmailAndPassword(auth, email, password);
      // The onAuthStateChanged listener in AuthProvider will handle document creation and redirection.
      toast({ title: "Success", description: "Admin account created! Redirecting to complete profile..." });

    } catch (error: any) {
      console.error("Signup Error:", error);
      toast({ title: "Signup Error", description: error.message, variant: "destructive" });
      window.sessionStorage.removeItem('signupRole');
      window.sessionStorage.removeItem('signupName');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="mx-auto max-w-sm w-full">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <UserCog className="h-10 w-10 text-primary" />
          </div>
          <CardTitle className="text-2xl text-center">Create Admin Account</CardTitle>
          <CardDescription className="text-center">
            Enter your details to create a new administrator account.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignUp} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="full-name">Full Name</Label>
              <Input id="full-name" placeholder="Max Robinson" required value={fullName} onChange={(e) => setFullName(e.target.value)} disabled={loading} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="m@example.com" required value={email} onChange={(e) => setEmail(e.target.value)} disabled={loading}/>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} disabled={loading} />
            </div>
            <Button type="submit" disabled={loading} className="w-full">
              {loading ? "Creating Account..." : "Create Admin Account"}
            </Button>
          </form>
            {/*
            <Button onClick={handleGoogleSignUp} disabled={loading} variant="outline" className="w-full mt-4">
              {loading ? "Please wait..." : "Sign up with Google"}
            </Button>
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
