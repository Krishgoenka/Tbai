
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
import { PlusCircle, Loader2 } from "lucide-react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { addAssignment } from "./actions"
import { useToast } from "@/hooks/use-toast"
import { useState, useRef } from "react"
import { assignmentSchema } from "./schema"

// This schema is only for the form fields, not the final database object.
const formSchema = assignmentSchema.omit({ id: true, submissions: true, fileUrl: true, status: true, dueDate: true }).extend({
    dueDate: z.string().min(1, "Due date is required."),
    dueTime: z.string().min(1, "Due time is required."),
    title: z.string().min(3, "Title is required."),
    description: z.string().min(10, "Description is required."),
    file: z.any().optional(), // Keep for client-side validation
});


export function AddAssignmentDialog() {
    const [isOpen, setIsOpen] = useState(false);
    const [submittingStatus, setSubmittingStatus] = useState<"Draft" | "Published" | "idle">("idle");
    const { toast } = useToast();
    const formRef = useRef<HTMLFormElement>(null);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: "",
            description: "",
            dueDate: "",
            dueTime: "23:59",
        },
    });

    const processFormSubmission = async (status: "Published" | "Draft") => {
        const isValid = await form.trigger();
        if (!isValid) return;

        setSubmittingStatus(status);
        
        const formData = new FormData(formRef.current!);
        const values = form.getValues();
        const combinedDueDate = new Date(`${values.dueDate}T${values.dueTime}`).toISOString();
        
        formData.append("dueDate", combinedDueDate);
        formData.append("status", status);
        
        const result = await addAssignment(formData);

        if (result.success) {
            toast({
                title: "Success",
                description: result.message,
            });
            form.reset();
            setIsOpen(false);
        } else {
             toast({
                title: "Error",
                description: result.message,
                variant: "destructive",
            });
        }
        setSubmittingStatus("idle");
    }

    const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // This function is intentionally left blank.
        // Submission is handled by the buttons' onClick events.
    };


  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
        if (submittingStatus === 'idle') {
            form.reset();
            setIsOpen(open);
        }
    }}>
      <DialogTrigger asChild>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Assignment
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[475px]">
         <Form {...form}>
            <form ref={formRef} onSubmit={handleFormSubmit}>
                <DialogHeader>
                <DialogTitle>Add New Assignment</DialogTitle>
                <DialogDescription>
                    Fill in the details below to create a new assignment. You can save it as a draft or publish it directly to students.
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
                                            <Input type="date" {...field} />
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
                    <FormField
                        control={form.control}
                        name="file"
                        render={({ field }) => (
                            <FormItem className="grid grid-cols-4 items-center gap-4">
                                <FormLabel className="text-right">PDF File</FormLabel>
                                <FormControl>
                                    <Input 
                                        id="file" 
                                        name="file" // Name attribute is crucial for FormData
                                        type="file" 
                                        accept=".pdf,.png,.jpg,.jpeg" 
                                        className="col-span-3" 
                                        onChange={(e) => field.onChange(e.target.files?.[0])}
                                    />
                                </FormControl>
                                <FormMessage className="col-span-4" />
                            </FormItem>
                        )}
                    />
                </div>
                <DialogFooter>
                    <Button type="button" variant="secondary" onClick={() => processFormSubmission('Draft')} disabled={submittingStatus !== 'idle'}>
                        {submittingStatus === 'Draft' ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                        Save as Draft
                    </Button>
                    <Button type="button" onClick={() => processFormSubmission('Published')} disabled={submittingStatus !== 'idle'}>
                         {submittingStatus === 'Published' ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                        Publish
                    </Button>
                </DialogFooter>
            </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
