
import { z } from "zod"

export const assignmentSchema = z.object({
  id: z.string(),
  title: z.string().min(3, { message: "Title must be at least 3 characters long." }),
  description: z.string().min(10, { message: "Description must be at least 10 characters long." }),
  dueDate: z.string(),
  fileUrl: z.string().url().or(z.string().startsWith("/")).optional(),
  status: z.enum(["Draft", "Published"]),
  submissions: z.number().optional().default(0),
})

export type Assignment = z.infer<typeof assignmentSchema>
