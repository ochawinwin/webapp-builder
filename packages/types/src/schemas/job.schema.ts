import { z } from "zod";

const prescreenQuestionSchema = z.object({
  id: z.string().optional(),
  order_index: z.number().int().min(0),
  type: z.enum(["text", "long_text", "choice"]),
  question: z.string().min(1, "กรุณากรอกคำถาม").max(500),
  options: z
    .array(z.string().min(1).max(200))
    .min(2, "คำถาม Multiple Choice ต้องมีตัวเลือกอย่างน้อย 2 ข้อ")
    .max(10)
    .optional(),
});

export const createJobSchema = z.object({
  title: z.string().min(1, "กรุณากรอกชื่อตำแหน่งงาน").max(200),
  description: z.string().min(1, "กรุณากรอกรายละเอียดงาน").max(10000),
  spec: z.string().max(5000).optional().or(z.literal("")),
  qualifications: z
    .array(z.string().min(1).max(300))
    .min(1, "กรุณากรอกคุณสมบัติอย่างน้อย 1 ข้อ")
    .max(20),
  location: z.string().max(200).optional().or(z.literal("")),
  job_type: z.enum(["full_time", "part_time", "contract", "internship"]),
  level: z.enum(["junior", "mid", "senior", "lead"]),
  salary: z.string().max(100).optional().or(z.literal("")),
  tag_ids: z.array(z.string().uuid()).max(20).default([]),
  prescreen_questions: z.array(prescreenQuestionSchema).max(10).default([]),
});

export const updateJobSchema = createJobSchema.partial().extend({
  id: z.string().uuid(),
});

export const updateJobStatusSchema = z.object({
  id: z.string().uuid(),
  status: z.enum(["open", "closed"]),
});

export type CreateJobInput = z.infer<typeof createJobSchema>;
export type UpdateJobInput = z.infer<typeof updateJobSchema>;
export type UpdateJobStatusInput = z.infer<typeof updateJobStatusSchema>;
