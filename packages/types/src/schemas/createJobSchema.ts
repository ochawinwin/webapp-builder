import { z } from "zod";

export const createJobSchema = z.object({
  title: z.string().min(1, "กรุณากรอกชื่อตำแหน่ง"),
  description: z.string().optional(),
  qualifications: z.string().optional(),
  benefits: z.string().optional(),
  location: z.string().optional(),
  jobType: z.string().optional(),
  level: z.string().optional(),
  status: z.enum(["draft", "active", "paused", "closed"]).default("draft"),
  tagIds: z.array(z.string().uuid()).default([]),
});

export type CreateJobInput = z.infer<typeof createJobSchema>;
