import { z } from "zod"

export const assignmentSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  dueDate: z.string(),
  fileUrl: z.string().url().or(z.string().startsWith("/")),
  submissions: z.number().optional().default(0),
})

export type Assignment = z.infer<typeof assignmentSchema>
