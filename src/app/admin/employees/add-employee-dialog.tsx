
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
  DialogClose,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { PlusCircle, Loader2 } from "lucide-react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { employeeSchema } from "./schema"
import { addEmployee } from "./actions"
import { useToast } from "@/hooks/use-toast"
import { useState } from "react"

const formSchema = employeeSchema.omit({ id: true, tasks: true });

export function AddEmployeeDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      role: "",
      details: "",
    },
  });

  const { isSubmitting } = form.formState;

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const result = await addEmployee(values);

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
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Employee
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[475px]">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <DialogHeader>
              <DialogTitle>Add New Employee</DialogTitle>
              <DialogDescription>
                Fill in the details below to add a new employee to the system.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 px-1 py-2">
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Full Name</FormLabel>
                            <FormControl>
                                <Input placeholder="e.g. John Doe" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="role"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Role</FormLabel>
                            <FormControl>
                                <Input placeholder="e.g. Software Engineer" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="details"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Details (Optional)</FormLabel>
                            <FormControl>
                                <Textarea placeholder="Profile details, skills, etc." {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </div>

            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="secondary" disabled={isSubmitting}>
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Employee
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
