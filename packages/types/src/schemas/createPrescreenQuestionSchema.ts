import { z } from "zod";

export const createPrescreenQuestionSchema = z.object({
  questionText: z.string().min(1, "กรุณากรอกคำถาม"),
  questionType: z.enum(["open_ended", "multiple_choice"]),
  options: z
    .array(z.object({ label: z.string(), value: z.string() }))
    .optional()
    .nullable(),
  sortOrder: z.number().int().default(0),
});

export type CreatePrescreenQuestionInput = z.infer<typeof createPrescreenQuestionSchema>;
