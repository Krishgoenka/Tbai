
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
import { PlusCircle } from "lucide-react"

export function AddSubmissionDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Submission
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[475px]">
        <DialogHeader>
          <DialogTitle>Add Manual Submission</DialogTitle>
          <DialogDescription>
            Fill in the details below to add a new submission record.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="studentName" className="text-right">
              Student Name
            </Label>
            <Input id="studentName" placeholder="e.g. John Doe" className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="studentEmail" className="text-right">
              Student Email
            </Label>
            <Input id="studentEmail" type="email" placeholder="e.g. john@example.com" className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="assignmentTitle" className="text-right">
              Assignment
            </Label>
            <Input id="assignmentTitle" placeholder="e.g. Calculus Homework 3" className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="score" className="text-right">
              Score
            </Label>
            <Input id="score" type="number" placeholder="e.g. 95" className="col-span-3" />
          </div>
           <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="file" className="text-right">
              PDF File
            </Label>
            <Input id="file" type="file" accept=".pdf" className="col-span-3" />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit">Save Submission</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
