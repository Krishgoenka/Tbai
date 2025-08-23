
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
import { PlusCircle } from "lucide-react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { addAssignment } from "./actions"
import { useToast } from "@/hooks/use-toast"
import { useState } from "react"
import { assignmentSchema } from "./schema"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// This schema is for form validation. It includes fields that are not in the database model.
const formSchema = assignmentSchema.omit({ id: true, submissions: true, fileUrl: true, dueDate: true }).extend({
    dueDate: z.string().min(1, "Due date is required."),
    dueTime: z.string().min(1, "Due time is required."),
    title: z.string().min(3, "Title is required."),
    description: z.string().min(10, "Description is required."),
    file: z.any().optional(),
});


export function AddAssignmentDialog() {
    const [isOpen, setIsOpen] = useState(false);
    const { toast } = useToast();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: "",
            description: "",
            dueDate: "",
            dueTime: "23:59",
            status: "Draft", // Default to Draft
        },
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        // Combine date and time into a single ISO string for the database
        const combinedDueDate = `${values.dueDate}T${values.dueTime}`;

        const result = await addAssignment({
           ...values,
           dueDate: new Date(combinedDueDate).toISOString(),
        });

        if (result.success) {
            toast({
                title: "Success",
                description: `Assignment has been successfully saved.`,
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
    }


  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Assignment
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[475px]">
         <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
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
                        name="status"
                        render={({ field }) => (
                            <FormItem className="grid grid-cols-4 items-center gap-4">
                                <FormLabel className="text-right">Status</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                    <SelectTrigger className="col-span-3">
                                        <SelectValue placeholder="Select a status" />
                                    </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                    <SelectItem value="Draft">Draft</SelectItem>
                                    <SelectItem value="Published">Published</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage className="col-span-4 pl-[25%]" />
                            </FormItem>
                        )}
                        />
                    <FormField
                        control={form.control}
                        name="file"
                        render={({ field }) => (
                            <FormItem className="grid grid-cols-4 items-center gap-4">
                                <FormLabel className="text-right">PDF File</FormLabel>
                                <FormControl>
                                    <Input id="file" type="file" accept=".pdf" className="col-span-3" onChange={(e) => field.onChange(e.target.files)} />
                                </FormControl>
                                <FormMessage className="col-span-4" />
                            </FormItem>
                        )}
                    />
                </div>
                <DialogFooter>
                    <Button type="button" variant="secondary" onClick={() => setIsOpen(false)}>Cancel</Button>
                    <Button type="submit">Save Assignment</Button>
                </DialogFooter>
            </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
