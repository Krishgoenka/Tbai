
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
import { Employee, employeeSchema } from "./schema"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { updateEmployee } from "./actions"
import { useToast } from "@/hooks/use-toast"

interface EditEmployeeDialogProps {
    employee: Employee;
    children: React.ReactNode;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

const formSchema = employeeSchema.omit({ tasks: true, id: true });


export function EditEmployeeDialog({ employee, children, open, onOpenChange }: EditEmployeeDialogProps) {
    const { toast } = useToast();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: employee.name,
            role: employee.role,
            details: employee.details
        },
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        const result = await updateEmployee(employee.id, values);

        if (result.success) {
            toast({
                title: "Success",
                description: "Employee has been successfully updated.",
            });
            form.reset();
            onOpenChange(false);
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
      <DialogContent className="sm:max-w-[425px]">
         <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <DialogHeader>
                <DialogTitle>Edit Employee</DialogTitle>
                <DialogDescription>
                    Make changes to the employee's details below.
                </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem className="grid grid-cols-4 items-center gap-4">
                                <FormLabel className="text-right">Name</FormLabel>
                                <FormControl>
                                    <Input placeholder="John Doe" className="col-span-3" {...field} />
                                </FormControl>
                                <FormMessage className="col-span-4 pl-[25%]" />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="role"
                        render={({ field }) => (
                            <FormItem className="grid grid-cols-4 items-center gap-4">
                                <FormLabel className="text-right">Role</FormLabel>
                                <FormControl>
                                    <Input placeholder="Software Engineer" className="col-span-3" {...field} />
                                </FormControl>
                                <FormMessage className="col-span-4 pl-[25%]" />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="details"
                        render={({ field }) => (
                            <FormItem className="grid grid-cols-4 items-center gap-4">
                                <FormLabel className="text-right">Details</FormLabel>
                                <FormControl>
                                    <Textarea placeholder="Profile details..." className="col-span-3" {...field} />
                                </FormControl>
                                <FormMessage className="col-span-4 pl-[25%]" />
                            </FormItem>
                        )}
                    />
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
