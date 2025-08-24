
"use server"

import { z } from "zod"
import { assignmentSchema } from "./schema"
import { addAssignment as dbAddAssignment, updateAssignment, deleteAssignment, updateAssignmentStatus } from "@/lib/assignment-data"
import { revalidatePath } from "next/cache"

// This schema is what the form provides to the action. It no longer includes status.
const addAssignmentFormSchema = assignmentSchema.omit({ id: true, submissions: true, fileUrl: true, status: true });
// Schema for updating, omits fields not on the form.
const updateAssignmentFormSchema = assignmentSchema.omit({ submissions: true, fileUrl: true });


export async function addAssignment(
    data: z.infer<typeof addAssignmentFormSchema>,
    status: "Published" | "Draft",
    file?: File
) {
    try {
        const validatedData = addAssignmentFormSchema.parse(data);

        // Add the status to the data before sending to the database function
        const assignmentDataWithStatus = { ...validatedData, status };

        // CORRECTED: Pass the object that includes the status to the DB function.
        await dbAddAssignment(assignmentDataWithStatus, file);

        revalidatePath("/admin/assignments");
        revalidatePath("/student");
        return { success: true, message: `Assignment has been successfully ${status === 'Published' ? 'published' : 'saved as a draft'}.` };
    } catch (error) {
        if (error instanceof z.ZodError) {
            return { success: false, message: error.errors.map(e => e.message).join(", ") };
        }
        console.error("Error in addAssignment action:", error);
        return { success: false, message: "An unknown error occurred while adding the assignment." };
    }
}

export async function updateAssignmentAction(data: z.infer<typeof updateAssignmentFormSchema>) {
    try {
        const validatedData = updateAssignmentFormSchema.parse(data);
        await updateAssignment(validatedData.id, validatedData);

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

export async function updateAssignmentStatusAction(id: string, status: "Published" | "Draft") {
    try {
        await updateAssignmentStatus(id, status);
        revalidatePath("/admin/assignments");
        revalidatePath("/student");
        return { success: true, message: `Assignment has been ${status === 'Published' ? 'published' : 'unpublished'}.` };
    } catch (error) {
        return { success: false, message: "Failed to update assignment status." };
    }
}

export async function deleteAssignmentAction(id: string) {
    try {
        await deleteAssignment(id);
        revalidatePath("/admin/assignments");
        revalidatePath("/student");
        return { success: true, message: "Assignment deleted successfully." };
    } catch (error) {
        return { success: false, message: "Failed to delete assignment." };
    }
}
