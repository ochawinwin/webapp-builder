import { z } from "zod";

export const applyJobSchema = z.object({
  resumeId: z.string().uuid("กรุณาเลือก Resume"),
  coverMessage: z.string().max(2000).optional(),
  contactEmail: z.string().email("รูปแบบอีเมลไม่ถูกต้อง"),
  contactPhone: z.string().optional(),
  answers: z.array(
    z.object({
      questionId: z.string().uuid(),
      answerText: z.string(),
    })
  ).default([]),
});

export type ApplyJobInput = z.infer<typeof applyJobSchema>;
