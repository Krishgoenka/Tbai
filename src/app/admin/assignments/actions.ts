
"use server"

import { z } from "zod"
import { assignmentSchema } from "./schema"
import { addAssignment as dbAddAssignment, updateAssignment, deleteAssignment, updateAssignmentStatus } from "@/lib/assignment-data"
import { revalidatePath } from "next/cache"

// This schema validates the data extracted from FormData
const addAssignmentFormSchema = assignmentSchema.omit({ id: true, submissions: true, fileUrl: true });

// Schema for updating, omits fields not on the form.
const updateAssignmentFormSchema = assignmentSchema.omit({ submissions: true, fileUrl: true });


export async function addAssignment(formData: FormData) {
    try {
        const file = formData.get("file") as File | null;

        const data = {
            title: formData.get("title") as string,
            description: formData.get("description") as string,
            dueDate: formData.get("dueDate") as string,
            status: formData.get("status") as "Published" | "Draft",
        };

        const validatedData = addAssignmentFormSchema.parse(data);

        await dbAddAssignment(validatedData, file && file.size > 0 ? file : undefined);

        revalidatePath("/admin/assignments");
        revalidatePath("/student");
        return { success: true, message: `Assignment has been successfully ${validatedData.status === 'Published' ? 'published' : 'saved as a draft'}.` };
    } catch (error) {
        if (error instanceof z.ZodError) {
            return { success: false, message: error.errors.map(e => e.message).join(", ") };
        }
        if (error instanceof Error) {
            return { success: false, message: error.message };
        }
        return { success: false, message: "An unknown error occurred while adding the assignment." };
    }
}

export async function updateAssignmentAction(data: z.infer<typeof updateAssignmentFormSchema>) {
    try {
        const validatedData = updateAssignmentFormSchema.parse(data);
        const result = await updateAssignment(validatedData.id, validatedData);
        if (!result.success) throw new Error("Database update failed");

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
        const result = await updateAssignmentStatus(id, status);
        if (!result.success) throw new Error("Database status update failed");

        revalidatePath("/admin/assignments");
        revalidatePath("/student");
        return { success: true, message: `Assignment has been ${status === 'Published' ? 'published' : 'unpublished'}.` };
    } catch (error) {
        console.error("Error in updateAssignmentStatusAction:", error);
        return { success: false, message: "Failed to update assignment status." };
    }
}

export async function deleteAssignmentAction(id: string) {
    try {
        const result = await deleteAssignment(id);
        if (!result.success) throw new Error("Database deletion failed");

        revalidatePath("/admin/assignments");
        revalidatePath("/student");
        return { success: true, message: "Assignment deleted successfully." };
    } catch (error) {
        console.error("Error in deleteAssignmentAction:", error);
        return { success: false, message: "Failed to delete assignment." };
    }
}
