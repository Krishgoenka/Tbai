
"use client"

import { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { updateProfile } from "firebase/auth";

export default function AdminProfilePage() {
    const { user, loading } = useAuth();
    const { toast } = useToast();
    const [isEditing, setIsEditing] = useState(false);

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");

    useEffect(() => {
        if (user) {
            setName(user.displayName || "");
            setEmail(user.email || "");
        }
    }, [user]);

    const handleSave = async () => {
        if (!user) return;

        try {
            // Update Firebase Auth profile
            await updateProfile(user, { displayName: name });
            
            // Update Firestore user document
            const userDocRef = doc(db, 'users', user.uid);
            await updateDoc(userDocRef, { displayName: name });
            
            toast({
                title: "Success",
                description: "Profile updated successfully.",
            });
            setIsEditing(false);
        } catch (error) {
             toast({
                title: "Error",
                description: "Failed to update profile.",
                variant: "destructive"
            });
            console.error("Profile update error:", error);
        }
    };

    const handleCancel = () => {
        if (user) {
            setName(user.displayName || "");
            setEmail(user.email || "");
        }
        setIsEditing(false);
    }

    if (loading || !user) {
        return <p>Loading profile...</p>
    }

  return (
    <div className="space-y-8">
        <h1 className="text-3xl font-bold">My Profile</h1>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
                 <Avatar className="h-20 w-20">
                    <AvatarImage src={user?.photoURL || "https://placehold.co/100x100.png"} data-ai-hint="admin avatar" />
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
                    <Input id="email" type="email" value={email} disabled />
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
    </div>
  )
}
