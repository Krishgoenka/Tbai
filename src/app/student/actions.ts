
"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { addSubmission } from "@/lib/submission-data";
import { db } from "@/lib/firebase";
import { doc, increment, updateDoc } from "firebase/firestore";

const submissionSchema = z.object({
    assignmentId: z.string(),
    assignmentTitle: z.string(),
});

export async function submitAssignment(data: z.infer<typeof submissionSchema>) {
    // Since auth is disabled, we'll use mock student data.
    // In a real app, this would come from the authenticated user session.
    const student = {
        name: "Student User",
        email: "student@example.com",
    };

    try {
        const validatedData = submissionSchema.parse(data);

        // 1. Add the submission to the 'submissions' collection
        await addSubmission({
            studentName: student.name,
            studentEmail: student.email,
            assignmentId: validatedData.assignmentId,
            assignmentTitle: validatedData.assignmentTitle,
            submissionDate: new Date().toISOString(),
            fileUrl: "/placeholder.pdf", // Placeholder URL for now
            // Score is omitted, will be added during grading
        });
        
        // 2. Increment the submission count on the assignment document
        const assignmentRef = doc(db, 'assignments', validatedData.assignmentId);
        await updateDoc(assignmentRef, {
            submissions: increment(1)
        });

        // 3. Revalidate paths to update UI
        revalidatePath("/student");
        revalidatePath("/admin/assignments");
        revalidatePath("/admin/submissions");

        return { success: true, message: "Assignment submitted successfully!" };

    } catch (error) {
        console.error("Error submitting assignment:", error);
        if (error instanceof z.ZodError) {
            return { success: false, message: error.errors.map(e => e.message).join(", ") };
        }
        return { success: false, message: "An unknown error occurred." };
    }
}
