
"use client"

import { Row } from "@tanstack/react-table"
import { MoreHorizontal, Trash2, Edit, CheckCircle, Archive } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuLabel
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

import { assignmentSchema } from "./schema"
import { EditAssignmentDialog } from "./edit-assignment-dialog"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { deleteAssignment, updateAssignmentStatus } from "./actions"
import { useRouter } from "next/navigation"


interface DataTableRowActionsProps<TData> {
  row: Row<TData>
}

export function DataTableRowActions<TData>({
  row,
}: DataTableRowActionsProps<TData>) {
  const assignment = assignmentSchema.parse(row.original)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const { toast } = useToast();
  const router = useRouter();


  const handleStatusChange = async (status: "Published" | "Draft") => {
     const result = await updateAssignmentStatus(assignment.id, status);
      if (result.success) {
            toast({
                title: "Success",
                description: result.message,
            });
            router.refresh();
        } else {
             toast({
                title: "Error",
                description: result.message,
                variant: "destructive",
            });
        }
  }

  const handleDelete = async () => {
    const result = await deleteAssignment(assignment.id);
     if (result.success) {
        toast({
            title: "Success",
            description: result.message,
        });
        setIsDeleteDialogOpen(false);
        router.refresh();
    } else {
            toast({
            title: "Error",
            description: result.message,
            variant: "destructive",
        });
    }
  }

  return (
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
            >
              <MoreHorizontal className="h-4 w-4" />
              <span className="sr-only">Open menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[160px]">
             <DropdownMenuLabel>Actions</DropdownMenuLabel>
             <DropdownMenuSeparator />
              {assignment.status === "Draft" && (
                 <DropdownMenuItem onClick={() => handleStatusChange("Published")}>
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Publish
                </DropdownMenuItem>
              )}
               {assignment.status === "Published" && (
                 <DropdownMenuItem onClick={() => handleStatusChange("Draft")}>
                    <Archive className="mr-2 h-4 w-4" />
                    Unpublish
                </DropdownMenuItem>
              )}
            <DropdownMenuItem asChild onSelect={(e) => e.preventDefault()}>
                <EditAssignmentDialog assignment={assignment} onOpenChange={setIsEditDialogOpen} open={isEditDialogOpen}>
                     <div onClick={() => setIsEditDialogOpen(true)} className="w-full flex items-center relative cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50">
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                     </div>
                </EditAssignmentDialog>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
                className="text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-900/40"
                onSelect={() => setIsDeleteDialogOpen(true)}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <AlertDialogContent>
            <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                This action cannot be undone. This will permanently delete this assignment.
                </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90">
                Continue
                </AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
  )
}
