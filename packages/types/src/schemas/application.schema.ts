import { z } from "zod";

export const submitApplicationSchema = z.object({
  job_id: z.string().uuid(),
  intro_message: z
    .string()
    .min(10, "Please write at least 10 characters")
    .max(2000),
  prescreen_answers: z.record(z.string(), z.string()),
  use_profile_resume: z.boolean(),
});

export const updateApplicationStatusSchema = z.object({
  id: z.string().uuid(),
  status: z.enum(["new", "reviewing", "interview", "hired", "rejected"]),
});

export type SubmitApplicationInput = z.infer<typeof submitApplicationSchema>;
export type UpdateApplicationStatusInput = z.infer<
  typeof updateApplicationStatusSchema
>;
