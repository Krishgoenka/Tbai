import { z } from "zod"

export const taskSchema = z.object({
  id: z.string(),
  description: z.string().min(3, "Description must be at least 3 characters long."),
  date: z.string().min(1, "Date is required."),
  status: z.enum(["To Do", "In Progress", "Done"]),
})

export const employeeSchema = z.object({
  id: z.string(),
  name: z.string().min(2, "Name must be at least 2 characters."),
  role: z.string().min(2, "Role must be at least 2 characters."),
  details: z.string().optional(),
  tasks: z.array(taskSchema),
})

export type Employee = z.infer<typeof employeeSchema>
export type Task = z.infer<typeof taskSchema>
