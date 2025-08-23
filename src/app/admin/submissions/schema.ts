import { z } from "zod"

export const submissionSchema = z.object({
  id: z.string(),
  studentName: z.string(),
  studentEmail: z.string().email(),
  submissionDate: z.string(),
  assignmentTitle: z.string(),
  fileUrl: z.string().url().or(z.string().startsWith("/")),
  score: z.number().optional(),
})

export type Submission = z.infer<typeof submissionSchema>