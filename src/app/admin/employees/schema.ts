import { z } from "zod"

export const taskSchema = z.object({
  description: z.string(),
  date: z.string(),
  status: z.enum(["To Do", "In Progress", "Done"]),
})

export const employeeSchema = z.object({
  id: z.string(),
  name: z.string(),
  role: z.string(),
  details: z.string(),
  tasks: z.array(taskSchema),
})

export type Employee = z.infer<typeof employeeSchema>
export type Task = z.infer<typeof taskSchema>
