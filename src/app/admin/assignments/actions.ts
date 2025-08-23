
"use server"

import { z } from "zod"
import { assignmentSchema } from "./schema"
import { addMockAssignment, updateMockAssignment, deleteMockAssignment, updateMockAssignmentStatus } from "@/lib/assignment-data"
import { revalidatePath } from "next/cache"

const addAssignmentSchema = assignmentSchema.omit({ id: true, submissions: true, fileUrl: true });
const updateAssignmentSchema = assignmentSchema.omit({ submissions: true, fileUrl: true });

export async function addAssignment(data: z.infer<typeof addAssignmentSchema>) {
    try {
        const validatedData = addAssignmentSchema.parse(data);
        
        // In a real app, you'd save to a database and handle file uploads here.
        // For now, we'll just add it to our mock data array.
        await addMockAssignment(validatedData);
        revalidatePath("/admin/assignments");
        revalidatePath("/student/submissions");
        return { success: true, message: "Assignment added successfully." };
    } catch (error) {
        if (error instanceof z.ZodError) {
            return { success: false, message: error.errors.map(e => e.message).join(", ") };
        }
        return { success: false, message: "An unknown error occurred." };
    }
}

export async function updateAssignment(data: z.infer<typeof updateAssignmentSchema>) {
    try {
        const validatedData = updateAssignmentSchema.parse(data);
        await updateMockAssignment(validatedData.id, validatedData);
        revalidatePath("/admin/assignments");
        revalidatePath("/student/submissions");
        return { success: true, message: "Assignment updated successfully." };
    } catch (error) {
        if (error instanceof z.ZodError) {
            return { success: false, message: error.errors.map(e => e.message).join(", ") };
        }
        console.error(error);
        return { success: false, message: "An unknown error occurred." };
    }
}

export async function updateAssignmentStatus(id: string, status: "Published" | "Draft") {
    try {
        await updateMockAssignmentStatus(id, status);
        revalidatePath("/admin/assignments");
        revalidatePath("/student/submissions");
        return { success: true, message: `Assignment has been ${status === 'Published' ? 'published' : 'unpublished'}.` };
    } catch (error) {
        return { success: false, message: "Failed to update assignment status." };
    }
}

export async function deleteAssignment(id: string) {
    try {
        await deleteMockAssignment(id);
        revalidatePath("/admin/assignments");
        revalidatePath("/student/submissions");
        return { success: true, message: "Assignment deleted successfully." };
    } catch (error) {
        return { success: false, message: "Failed to delete assignment." };
    }
}
