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
import { Assignment } from "./schema"
import { useMemo } from "react"

interface EditAssignmentDialogProps {
    assignment: Assignment;
    children: React.ReactNode;
}

export function EditAssignmentDialog({ assignment, children }: EditAssignmentDialogProps) {

  const { date, time } = useMemo(() => {
    try {
      const [datePart, timePart] = assignment.dueDate.split('T');
      if (timePart) {
         return { date: datePart, time: timePart.slice(0, 5) };
      }
      return { date: datePart, time: "23:59" };
    } catch(e) {
      return { date: assignment.dueDate, time: "23:59" };
    }
  }, [assignment.dueDate]);
  
  return (
    <Dialog>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[475px]">
        <DialogHeader>
          <DialogTitle>Edit Assignment</DialogTitle>
          <DialogDescription>
            Make changes to the assignment below. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="title" className="text-right">
              Title
            </Label>
            <Input id="title" defaultValue={assignment.title} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">
              Description
            </Label>
            <Textarea id="description" defaultValue={assignment.description} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="due-date" className="text-right">
              Due Date
            </Label>
            <div className="col-span-3 grid grid-cols-2 gap-2">
                <Input id="due-date" type="date" defaultValue={date} />
                <Input id="due-time" type="time" defaultValue={time} />
            </div>
          </div>
           <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="file" className="text-right">
              PDF File
            </Label>
            <Input id="file" type="file" accept=".pdf" className="col-span-3" />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit">Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
