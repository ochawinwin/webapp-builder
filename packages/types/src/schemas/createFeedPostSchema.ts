import { z } from "zod";

export const createFeedPostSchema = z.object({
  title: z.string().min(1, "กรุณากรอกหัวข้อ"),
  content: z.string().optional(),
  imageUrl: z.string().url().optional().nullable(),
});

export type CreateFeedPostInput = z.infer<typeof createFeedPostSchema>;
