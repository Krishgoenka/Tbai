
"use client"

import { Row } from "@tanstack/react-table"
import { MoreHorizontal, Trash2, Edit } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
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

import { employeeSchema } from "./schema"
import { ManageTasksDialog } from "./manage-tasks-dialog"
import { EditEmployeeDialog } from "./edit-employee-dialog"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { deleteEmployee } from "./actions"
import { useRouter } from "next/navigation"


interface DataTableRowActionsProps<TData> {
  row: Row<TData>
}

export function DataTableRowActions<TData>({
  row,
}: DataTableRowActionsProps<TData>) {
  const employee = employeeSchema.parse(row.original)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isTasksDialogOpen, setIsTasksDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const { toast } = useToast();
  const router = useRouter();


  const handleDelete = async () => {
    const result = await deleteEmployee(employee.id);
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
    <div className="flex items-center gap-2">
      <ManageTasksDialog employee={employee} open={isTasksDialogOpen} onOpenChange={setIsTasksDialogOpen}>
        <Button variant="secondary" size="sm" onClick={() => setIsTasksDialogOpen(true)}>Manage Tasks</Button>
      </ManageTasksDialog>
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
            <DropdownMenuItem onSelect={(e) => { e.preventDefault(); setIsEditDialogOpen(true); }}>
                <Edit className="mr-2 h-4 w-4" />
                Edit
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

        {/* Edit Dialog is controlled from here */}
        <EditEmployeeDialog employee={employee} open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            {/* The trigger is virtual; dialog is opened via state */}
            <></>
        </EditEmployeeDialog>
        
        {/* Delete Confirmation Dialog */}
        <AlertDialogContent>
            <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the
                employee and remove their data from our servers.
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
    </div>
  )
}
