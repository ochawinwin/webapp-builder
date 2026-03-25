import { z } from "zod";

export const updateCompanySchema = z.object({
  name: z.string().min(1, "กรุณากรอกชื่อบริษัท").optional(),
  shortBio: z.string().max(160).optional(),
  fullBio: z.string().optional(),
  industry: z.string().optional(),
  size: z.string().optional(),
  logoUrl: z.string().url().optional().nullable(),
  coverUrl: z.string().url().optional().nullable(),
});

export type UpdateCompanyInput = z.infer<typeof updateCompanySchema>;
