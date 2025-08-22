"use client"

import { Row } from "@tanstack/react-table"
import { MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { employeeSchema } from "./schema"
import { ManageTasksDialog } from "./manage-tasks-dialog"

interface DataTableRowActionsProps<TData> {
  row: Row<TData>
}

export function DataTableRowActions<TData>({
  row,
}: DataTableRowActionsProps<TData>) {
  const employee = employeeSchema.parse(row.original)

  return (
    <ManageTasksDialog employee={employee}>
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
                <DropdownMenuItem asChild>
                    {/* This is the trigger for the ManageTasksDialog */}
                    <div className="w-full">Manage Tasks</div>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                Delete
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    </ManageTasksDialog>
  )
}
