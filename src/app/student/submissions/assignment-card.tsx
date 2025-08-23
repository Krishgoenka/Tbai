
"use client";

import type { Assignment } from "@/app/admin/assignments/schema";
import { cn } from "@/lib/utils";
import { Book } from "lucide-react";

interface AssignmentCardProps {
  assignment: Assignment;
  isSelected: boolean;
  onSelect: () => void;
}

export function AssignmentCard({ assignment, isSelected, onSelect }: AssignmentCardProps) {
  return (
    <button
      onClick={onSelect}
      className={cn(
        "w-full text-left p-4 rounded-lg border transition-colors",
        "flex items-start gap-4",
        isSelected
          ? "bg-primary/10 border-primary"
          : "hover:bg-accent hover:text-accent-foreground"
      )}
    >
        <div className="p-2 bg-muted rounded-md mt-1">
             <Book className="h-5 w-5 text-primary" />
        </div>
        <div>
            <p className="font-semibold">{assignment.title}</p>
            <p className="text-sm text-muted-foreground">Due: {new Date(assignment.dueDate).toLocaleString()}</p>
        </div>
    </button>
  );
}
