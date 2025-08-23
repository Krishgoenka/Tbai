
"use server"

import { z } from "zod"
import { assignmentSchema } from "./schema"
import { addMockAssignment } from "@/lib/assignment-data"

const addAssignmentSchema = assignmentSchema.omit({ id: true, submissions: true, fileUrl: true });

export async function addAssignment(data: z.infer<typeof addAssignmentSchema>) {
    try {
        const validatedData = addAssignmentSchema.parse(data);
        
        // In a real app, you'd save to a database and handle file uploads here.
        // For now, we'll just add it to our mock data array.
        await addMockAssignment(validatedData);

        return { success: true, message: "Assignment added successfully." };
    } catch (error) {
        if (error instanceof z.ZodError) {
            return { success: false, message: error.errors.map(e => e.message).join(", ") };
        }
        return { success: false, message: "An unknown error occurred." };
    }
}
