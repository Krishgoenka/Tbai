
"use client"

import { useAuth } from "@/hooks/use-auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { studentProfileSchema, type StudentProfile } from "./schema";
import { updateStudentProfile } from "./actions";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function StudentProfilePage() {
    const { user, loading: authLoading, profileNeedsUpdate } = useAuth();
    const { toast } = useToast();
    const [isEditing, setIsEditing] = useState(false);
    const [pageLoading, setPageLoading] = useState(true);

    const form = useForm<z.infer<typeof studentProfileSchema>>({
        resolver: zodResolver(studentProfileSchema),
        defaultValues: {
            displayName: "",
            batch: "",
            studentId: "",
            yearOfStudy: "",
        }
    });

    useEffect(() => {
        async function fetchProfile() {
            if (user) {
                setPageLoading(true);
                const userDocRef = doc(db, 'users', user.uid);
                const docSnap = await getDoc(userDocRef);
                if (docSnap.exists()) {
                    const data = docSnap.data();
                    form.reset({
                        displayName: data.displayName || "",
                        batch: data.batch || "",
                        studentId: data.studentId || "",
                        yearOfStudy: data.yearOfStudy || "",
                    });
                }
                setPageLoading(false);
            }
        }
        if (!authLoading) {
            fetchProfile();
            // If the auth hook determines the profile needs an update, start in edit mode.
            if (profileNeedsUpdate) {
                setIsEditing(true);
            }
        }
    }, [user, authLoading, form, profileNeedsUpdate]);

    const onSubmit = async (data: z.infer<typeof studentProfileSchema>) => {
        if (!user) return;
        const result = await updateStudentProfile(user.uid, data);
        if (result.success) {
            toast({ title: "Success", description: result.message });
            setIsEditing(false);
        } else {
            toast({ title: "Error", description: result.message, variant: "destructive" });
        }
    };

    const handleCancel = () => {
        form.reset(); // Resets to the last fetched values
        setIsEditing(false);
    }
    
    if (authLoading || pageLoading) {
        return <p>Loading profile...</p>;
    }

    if (!user) {
        return <p>Please log in to view your profile.</p>
    }

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold">My Profile</h1>
            {profileNeedsUpdate && isEditing && (
                <Card className="border-primary bg-primary/5">
                    <CardHeader>
                        <CardTitle>Welcome!</CardTitle>
                        <CardDescription>Please complete your profile to continue.</CardDescription>
                    </CardHeader>
                </Card>
            )}
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Avatar className="h-20 w-20">
                                <AvatarImage src={user.photoURL || "https://placehold.co/100x100.png"} data-ai-hint="student avatar" />
                                <AvatarFallback>{form.getValues("displayName")?.charAt(0).toUpperCase() || 'S'}</AvatarFallback>
                            </Avatar>
                            <div>
                                <CardTitle className="text-2xl">{form.getValues("displayName")}</CardTitle>
                                <CardDescription>{user.email}</CardDescription>
                            </div>
                        </div>
                        {!isEditing && (
                            <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
                        )}
                    </div>
                </CardHeader>
                <Separator />
                <CardContent className="pt-6">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                             <FormField
                                control={form.control}
                                name="displayName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Full Name</FormLabel>
                                        <FormControl>
                                            <Input {...field} disabled={!isEditing} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="studentId"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Student ID</FormLabel>
                                        <FormControl>
                                            <Input {...field} disabled={!isEditing} placeholder="e.g. 21BCE1234"/>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                             <FormField
                                control={form.control}
                                name="batch"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Batch</FormLabel>
                                        <FormControl>
                                            <Input {...field} disabled={!isEditing} placeholder="e.g. 2021-2025"/>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                             <FormField
                                control={form.control}
                                name="yearOfStudy"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Year of Study</FormLabel>
                                        <FormControl>
                                            <Input type="number" {...field} disabled={!isEditing} placeholder="e.g. 3"/>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            {isEditing && (
                                <div className="flex justify-end gap-2">
                                    <Button type="button" variant="outline" onClick={handleCancel} disabled={profileNeedsUpdate}>Cancel</Button>
                                    <Button type="submit">Save Changes</Button>
                                </div>
                            )}
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
}
