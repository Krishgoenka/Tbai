"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Checkbox } from "@/components/ui/checkbox"

import { Submission } from "./schema"
import { DataTableColumnHeader } from "../employees/data-table-column-header"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ExternalLink } from "lucide-react"

export const columns: ColumnDef<Submission>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "studentName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Student Name" />
    ),
  },
  {
    accessorKey: "studentEmail",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Student Email" />
    ),
  },
    {
    accessorKey: "assignmentTitle",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Assignment" />
    ),
  },
  {
    accessorKey: "submissionDate",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Date" />
    ),
  },
  {
    id: "actions",
    header: "View",
    cell: ({ row }) => {
        const submission = row.original
        return (
            <Button variant="ghost" size="icon" asChild>
                <Link href={submission.fileUrl} target="_blank">
                    <ExternalLink className="h-4 w-4" />
                </Link>
            </Button>
        )
    }
  },
]
