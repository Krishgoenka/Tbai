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
import { Employee, Task } from "./schema"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { PlusCircle } from "lucide-react"

interface ManageTasksDialogProps {
  employee: Employee;
  children: React.ReactNode;
}

function TaskItem({ task }: { task: Task }) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Done": return "bg-green-500";
      case "In Progress": return "bg-blue-500";
      case "To Do":
      default:
        return "bg-gray-500";
    }
  }

  return (
     <div className="flex items-start justify-between p-3 rounded-lg border">
        <div>
            <p className="font-medium">{task.description}</p>
            <p className="text-sm text-muted-foreground">{task.date}</p>
        </div>
        <Badge className={`${getStatusColor(task.status)}`}>{task.status}</Badge>
    </div>
  )
}

export function ManageTasksDialog({ employee, children }: ManageTasksDialogProps) {
  return (
    <Dialog>
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
                <CardContent className="space-y-4 max-h-60 overflow-y-auto">
                    {employee.tasks.length > 0 ? (
                        employee.tasks.map((task, index) => (
                            <TaskItem key={index} task={task} />
                        ))
                    ) : (
                        <p className="text-muted-foreground text-sm">No tasks assigned.</p>
                    )}
                </CardContent>
            </Card>

            <Separator />
            
            <div>
                 <h3 className="text-lg font-medium mb-4">Add New Task</h3>
                <div className="grid gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Input id="description" placeholder="New feature development" />
                    </div>
                     <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="date">Due Date</Label>
                            <Input id="date" type="date" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="status">Status</Label>
                             <select id="status" className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                                <option>To Do</option>
                                <option>In Progress</option>
                                <option>Done</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <DialogFooter>
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Task
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
