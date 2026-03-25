import { z } from "zod";

export const uploadResumeSchema = z.object({
  fileName: z.string().min(1, "กรุณาเลือกไฟล์"),
  fileSize: z.number().max(10 * 1024 * 1024, "ไฟล์ต้องมีขนาดไม่เกิน 10MB"),
  fileType: z.literal("application/pdf", {
    errorMap: () => ({ message: "รองรับเฉพาะไฟล์ PDF เท่านั้น" }),
  }),
});

export type UploadResumeInput = z.infer<typeof uploadResumeSchema>;
