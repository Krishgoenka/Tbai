
import { z } from "zod";

export const studentSchema = z.object({
  id: z.string(),
  displayName: z.string(),
  email: z.string().email(),
});

export type Student = z.infer<typeof studentSchema>;
