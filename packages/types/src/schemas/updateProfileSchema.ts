import { z } from "zod";

export const updateProfileSchema = z.object({
  fullName: z.string().min(1, "กรุณากรอกชื่อ-นามสกุล").optional(),
  bio: z.string().max(500).optional(),
  phone: z.string().optional(),
  avatarUrl: z.string().url().optional().nullable(),
  tagIds: z.array(z.string().uuid()).optional(),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
