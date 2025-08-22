"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { doc, setDoc, getDoc, collection, query, where, getDocs } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Bot } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSignUp = async (role: 'student' | 'admin') => {
    setLoading(true);
    try {
      if (role === 'admin') {
        const q = query(collection(db, "preApprovedAdmins"), where("email", "==", email));
        const querySnapshot = await getDocs(q);
        if (querySnapshot.empty) {
          toast({ title: "Error", description: "This email is not authorized for admin signup.", variant: "destructive" });
          setLoading(false);
          return;
        }
      }

      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        email: user.email,
        displayName: fullName,
        role: role,
      });

      toast({ title: "Success", description: "Account created successfully!" });
      // The auth provider will handle redirection.
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignUp = async (role: 'student' | 'admin') => {
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      if (role === 'admin') {
        if (!user.email) {
            await auth.signOut();
            toast({ title: "Error", description: "Could not retrieve email from Google Account.", variant: "destructive" });
            setLoading(false);
            return;
        }
        const q = query(collection(db, "preApprovedAdmins"), where("email", "==", user.email));
        const querySnapshot = await getDocs(q);
        if (querySnapshot.empty) {
          await user.delete(); // Delete the user if not pre-approved
          await auth.signOut();
          toast({ title: "Error", description: "This Google account is not authorized for admin signup.", variant: "destructive" });
          setLoading(false);
          return;
        }
      }

      const userDocRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userDocRef);

      if (!userDoc.exists()) {
        await setDoc(userDocRef, {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          role: role,
        });
      }
      
      toast({ title: "Success", description: "Signed up successfully!" });
      // The auth provider will handle redirection.
    } catch (error: any) {
       toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
        setLoading(false);
    }
  };

  const renderSignupForm = (role: 'student' | 'admin') => {
    return (
      <div className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor={`${role}-full-name`}>Full Name</Label>
          <Input id={`${role}-full-name`} placeholder="Max Robinson" required onChange={(e) => setFullName(e.target.value)} />
        </div>
        <div className="grid gap-2">
          <Label htmlFor={`${role}-email`}>Email</Label>
          <Input id={`${role}-email`} type="email" placeholder="m@example.com" required onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div className="grid gap-2">
          <Label htmlFor={`${role}-password`}>Password</Label>
          <Input id={`${role}-password`} type="password" required onChange={(e) => setPassword(e.target.value)} />
        </div>
        <Button onClick={() => handleSignUp(role)} disabled={loading} className="w-full">
          {loading ? "Creating Account..." : `Create ${role === 'admin' ? 'Admin' : 'Student'} Account`}
        </Button>
        <Button onClick={() => handleGoogleSignUp(role)} disabled={loading} variant="outline" className="w-full">
          {loading ? "Please wait..." : `Sign up with Google`}
        </Button>
      </div>
    );
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="mx-auto max-w-md w-full">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <Bot className="h-10 w-10 text-primary" />
          </div>
          <CardTitle className="text-2xl text-center">Sign Up</CardTitle>
          <CardDescription className="text-center">
            Choose your role to get started
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="student" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="student">Student</TabsTrigger>
              <TabsTrigger value="admin">Admin</TabsTrigger>
            </TabsList>
            <TabsContent value="student">
              <Card>
                <CardHeader>
                  <CardTitle>Student Signup</CardTitle>
                  <CardDescription>Create an account to submit your assignments.</CardDescription>
                </CardHeader>
                <CardContent>
                  {renderSignupForm("student")}
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="admin">
              <Card>
                <CardHeader>
                  <CardTitle>Admin Signup</CardTitle>
                  <CardDescription>Admin accounts require pre-approval.</CardDescription>
                </CardHeader>
                <CardContent>
                  {renderSignupForm("admin")}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
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
