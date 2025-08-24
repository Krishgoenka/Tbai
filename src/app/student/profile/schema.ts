
import { z } from "zod";

export const studentProfileSchema = z.object({
  displayName: z.string().min(2, "Name must be at least 2 characters."),
  studentId: z.string().min(1, "Student ID is required."),
  batch: z.string().min(1, "Batch is required."),
  yearOfStudy: z.string().min(1, "Year of study is required."),
});

export type StudentProfile = z.infer<typeof studentProfileSchema>;
