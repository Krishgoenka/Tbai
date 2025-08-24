
"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Assignment, assignmentSchema } from "./schema"
import { useMemo, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { updateAssignmentAction } from "./actions"
import { useToast } from "@/hooks/use-toast"

interface EditAssignmentDialogProps {
    assignment: Assignment;
    children: React.ReactNode;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

const formSchema = assignmentSchema.omit({ submissions: true, fileUrl: true }).extend({
    dueTime: z.string().min(1, "Due time is required."),
    file: z.any().optional(),
});


export function EditAssignmentDialog({ assignment, children, open, onOpenChange }: EditAssignmentDialogProps) {
    const { toast } = useToast();

    const defaultValues = useMemo(() => {
        try {
            const date = new Date(assignment.dueDate);
            const dateString = date.toISOString().split('T')[0];
            const timeString = date.toTimeString().slice(0, 5);
            return {
                ...assignment,
                dueDate: dateString,
                dueTime: timeString,
            }
        } catch(e) {
            console.error("Error parsing date:", e);
            const fallbackDate = new Date();
            return {
                 ...assignment,
                dueDate: fallbackDate.toISOString().split('T')[0],
                dueTime: fallbackDate.toTimeString().slice(0,5),
            }
        }
    }, [assignment]);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues,
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        const combinedDueDate = `${values.dueDate}T${values.dueTime}`;

        const result = await updateAssignmentAction({
           id: values.id,
           title: values.title,
           description: values.description,
           status: values.status,
           dueDate: new Date(combinedDueDate).toISOString(),
        });

        if (result.success) {
            toast({
                title: "Success",
                description: "Assignment has been successfully updated.",
            });
            onOpenChange(false);
            // No router.refresh() needed, revalidatePath in action handles it
        } else {
             toast({
                title: "Error",
                description: result.message,
                variant: "destructive",
            });
        }
    }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[475px]">
         <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <DialogHeader>
                <DialogTitle>Edit Assignment</DialogTitle>
                <DialogDescription>
                    Make changes to the assignment below. Click save when you're done.
                </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                            <FormItem className="grid grid-cols-4 items-center gap-4">
                                <FormLabel className="text-right">Title</FormLabel>
                                <FormControl>
                                    <Input placeholder="e.g. Calculus Homework 3" className="col-span-3" {...field} />
                                </FormControl>
                                <FormMessage className="col-span-4 pl-[25%]" />
                            </FormItem>
                        )}
                    />
                     <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                            <FormItem className="grid grid-cols-4 items-center gap-4">
                                <FormLabel className="text-right">Description</FormLabel>
                                <FormControl>
                                    <Textarea placeholder="Assignment details..." className="col-span-3" {...field} />
                                </FormControl>
                                <FormMessage className="col-span-4 pl-[25%]" />
                            </FormItem>
                        )}
                    />
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="due-date" className="text-right">
                        Due Date
                        </Label>
                        <div className="col-span-3 grid grid-cols-2 gap-2">
                            <FormField
                                control={form.control}
                                name="dueDate"
                                render={({ field }) => (
                                     <FormItem>
                                        <FormControl>
                                             {/* The value needs to be formatted as yyyy-mm-dd for the input */}
                                            <Input type="date" {...field} value={field.value.split('T')[0]} />
                                        </FormControl>
                                         <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="dueTime"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <Input type="time" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                    </div>
                   <div className="grid grid-cols-4 items-center gap-4">
                    <Label className="text-right">
                      PDF File
                    </Label>
                    <div className="col-span-3">
                      <p className="text-sm text-muted-foreground">Editing the existing file is not yet supported.</p>
                    </div>
                  </div>
                </div>
                <DialogFooter>
                    <Button type="button" variant="secondary" onClick={() => onOpenChange(false)}>Cancel</Button>
                    <Button type="submit">Save Changes</Button>
                </DialogFooter>
            </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
