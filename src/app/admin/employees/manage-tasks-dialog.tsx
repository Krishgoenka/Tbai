
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
import { Employee, Task, taskSchema } from "./schema"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { PlusCircle, Trash2 } from "lucide-react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { useToast } from "@/hooks/use-toast"
import { addTask, deleteTask } from "./actions"

interface ManageTasksDialogProps {
  employee: Employee;
  children: React.ReactNode;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const formSchema = taskSchema.omit({ id: true });


function TaskItem({ task, employeeId }: { task: Task, employeeId: string }) {
  const { toast } = useToast();

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Done": return "bg-green-500 hover:bg-green-500/80";
      case "In Progress": return "bg-blue-500 hover:bg-blue-500/80";
      case "To Do":
      default:
        return "bg-gray-500 hover:bg-gray-500/80";
    }
  }

  const handleDelete = async () => {
    const result = await deleteTask(employeeId, task.id);
    if (result.success) {
      toast({ title: "Success", description: "Task deleted." });
    } else {
      toast({ title: "Error", description: result.message, variant: "destructive" });
    }
  }

  return (
     <div className="flex items-start justify-between p-3 rounded-lg border">
        <div className="flex-1">
            <p className="font-medium">{task.description}</p>
            <p className="text-sm text-muted-foreground">{task.date}</p>
        </div>
        <div className="flex items-center gap-2">
            <Badge className={`${getStatusColor(task.status)} text-white`}>{task.status}</Badge>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:bg-destructive/10 hover:text-destructive" onClick={handleDelete}>
                <Trash2 className="h-4 w-4" />
            </Button>
        </div>
    </div>
  )
}

export function ManageTasksDialog({ employee, children, open, onOpenChange }: ManageTasksDialogProps) {
    const { toast } = useToast();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            description: "",
            date: "",
            status: "To Do",
        },
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
       const result = await addTask(employee.id, values);
       if (result.success) {
            toast({
                title: "Success",
                description: "New task added successfully.",
            });
            form.reset();
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
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Manage Tasks for {employee.name}</DialogTitle>
          <DialogDescription>
            View, add, or update tasks for this employee.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-6 py-4">
            <Card>
                <CardHeader>
                    <CardTitle>Existing Tasks</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 max-h-60 overflow-y-auto pr-2">
                    {employee.tasks.length > 0 ? (
                        employee.tasks.map((task, index) => (
                            <TaskItem key={task.id} task={task} employeeId={employee.id}/>
                        ))
                    ) : (
                        <p className="text-muted-foreground text-sm text-center py-4">No tasks assigned.</p>
                    )}
                </CardContent>
            </Card>

            <Separator />
            
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <h3 className="text-lg font-medium">Add New Task</h3>
                    <div className="grid gap-4">
                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Description</FormLabel>
                                    <FormControl>
                                        <Input placeholder="New feature development" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="date"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Due Date</FormLabel>
                                        <FormControl>
                                            <Input type="date" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="status"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Status</FormLabel>
                                        <FormControl>
                                            <select {...field} className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                                                <option value="To Do">To Do</option>
                                                <option value="In Progress">In Progress</option>
                                                <option value="Done">Done</option>
                                            </select>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                    </div>
                     <DialogFooter>
                        <Button type="submit">
                            <PlusCircle className="mr-2 h-4 w-4" />
                            Add Task
                        </Button>
                    </DialogFooter>
                </form>
            </Form>
        </div>
      </DialogContent>
    </Dialog>
  )
}
