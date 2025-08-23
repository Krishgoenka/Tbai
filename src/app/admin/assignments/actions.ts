
"use server"

import { z } from "zod"
import { assignmentSchema } from "./schema"
import { addAssignment as dbAddAssignment, updateAssignment as dbUpdateAssignment, deleteAssignment as dbDeleteAssignment, updateAssignmentStatus as dbUpdateAssignmentStatus } from "@/lib/assignment-data"
import { revalidatePath } from "next/cache"

// This schema is what the form provides to the action. It includes status.
const addAssignmentFormSchema = assignmentSchema.omit({ id: true, submissions: true, fileUrl: true });
// Schema for updating, omits fields not on the form.
const updateAssignmentFormSchema = assignmentSchema.omit({ submissions: true, fileUrl: true });


export async function addAssignment(data: z.infer<typeof addAssignmentFormSchema>) {
    try {
        // The form now provides the status, so we can validate it directly.
        const validatedData = addAssignmentFormSchema.parse(data);

        // The data is valid, proceed to add it to the database.
        await dbAddAssignment(validatedData);

        // Revalidate paths to update the UI across the app
        revalidatePath("/admin/assignments");
        revalidatePath("/student");
        return { success: true, message: "Assignment added successfully." };
    } catch (error) {
        if (error instanceof z.ZodError) {
            return { success: false, message: error.errors.map(e => e.message).join(", ") };
        }
        console.error("Error in addAssignment action:", error);
        return { success: false, message: "An unknown error occurred while adding the assignment." };
    }
}

export async function updateAssignment(data: z.infer<typeof updateAssignmentFormSchema>) {
    try {
        const validatedData = updateAssignmentFormSchema.parse(data);
        await dbUpdateAssignment(validatedData.id, validatedData);

        revalidatePath("/admin/assignments");
        revalidatePath("/student");
        return { success: true, message: "Assignment updated successfully." };
    } catch (error) {
        if (error instanceof z.ZodError) {
            return { success: false, message: error.errors.map(e => e.message).join(", ") };
        }
        console.error("Error in updateAssignment action:", error);
        return { success: false, message: "An unknown error occurred while updating the assignment." };
    }
}

export async function updateAssignmentStatus(id: string, status: "Published" | "Draft") {
    try {
        await dbUpdateAssignmentStatus(id, status);
        revalidatePath("/admin/assignments");
        revalidatePath("/student");
        return { success: true, message: `Assignment has been ${status === 'Published' ? 'published' : 'unpublished'}.` };
    } catch (error) {
        return { success: false, message: "Failed to update assignment status." };
    }
}

export async function deleteAssignment(id: string) {
    try {
        await dbDeleteAssignment(id);
        revalidatePath("/admin/assignments");
        revalidatePath("/student");
        return { success: true, message: "Assignment deleted successfully." };
    } catch (error) {
        return { success: false, message: "Failed to delete assignment." };
    }
}
