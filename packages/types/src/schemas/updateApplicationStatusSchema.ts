import { z } from "zod";

export const updateApplicationStatusSchema = z.object({
  applicationId: z.string().uuid(),
  status: z.enum(["new", "reviewing", "interview", "offered", "hired", "rejected"]),
});

export type UpdateApplicationStatusInput = z.infer<typeof updateApplicationStatusSchema>;
