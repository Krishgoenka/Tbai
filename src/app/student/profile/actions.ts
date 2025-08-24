
"use server";

import { z } from "zod";
import { studentProfileSchema } from "./schema";
import { db } from "@/lib/firebase";
import { doc, updateDoc } from "firebase/firestore";
import { revalidatePath } from "next/cache";

export async function updateStudentProfile(userId: string, data: z.infer<typeof studentProfileSchema>) {
    try {
        const validatedData = studentProfileSchema.parse(data);
        const userDocRef = doc(db, 'users', userId);

        await updateDoc(userDocRef, {
            displayName: validatedData.displayName,
            batch: validatedData.batch,
            studentId: validatedData.studentId,
            yearOfStudy: validatedData.yearOfStudy,
        });

        revalidatePath('/student/profile');
        
        return { success: true, message: "Profile updated successfully." };

    } catch (error) {
        if (error instanceof z.ZodError) {
            return { success: false, message: error.errors.map(e => e.message).join(", ") };
        }
        console.error("Error updating student profile:", error);
        return { success: false, message: "An unknown error occurred while updating the profile." };
    }
}
