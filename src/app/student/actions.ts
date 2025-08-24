
"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { addSubmission, getStudentSubmissionForAssignment } from "@/lib/submission-data";
import { db } from "@/lib/firebase";
import { doc, increment, updateDoc } from "firebase/firestore";
import { auth } from "@/lib/firebase";

const submissionSchema = z.object({
    assignmentId: z.string(),
    assignmentTitle: z.string(),
    studentName: z.string(),
    studentEmail: z.string().email(),
});

export async function submitAssignment(
    data: z.infer<typeof submissionSchema>,
    file: File
) {
    try {
        const validatedData = submissionSchema.parse(data);

        // 1. Check if the user has already submitted for this assignment
        const existingSubmission = await getStudentSubmissionForAssignment(validatedData.studentEmail, validatedData.assignmentId);

        // 2. Add or update the submission to the 'submissions' collection
        // The addSubmission function will handle both creating a new doc or updating an existing one.
        await addSubmission({
            studentName: validatedData.studentName,
            studentEmail: validatedData.studentEmail,
            assignmentId: validatedData.assignmentId,
            assignmentTitle: validatedData.assignmentTitle,
            submissionDate: new Date().toISOString(),
            // Score is omitted, will be added during grading
        }, file, existingSubmission?.id);
        
        // 3. Increment submission count ONLY if it's the first time.
        if (!existingSubmission) {
            const assignmentRef = doc(db, 'assignments', validatedData.assignmentId);
            await updateDoc(assignmentRef, {
                submissions: increment(1)
            });
        }

        // 4. Revalidate paths to update UI
        revalidatePath("/student");
        revalidatePath("/admin/assignments");
        revalidatePath("/admin/submissions");

        return { success: true, message: "Assignment submitted successfully!" };

    } catch (error) {
        console.error("Error submitting assignment:", error);
        if (error instanceof z.ZodError) {
            return { success: false, message: error.errors.map(e => e.message).join(", ") };
        }
        return { success: false, message: "An unknown error occurred during submission." };
    }
}
