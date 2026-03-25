import { z } from "zod";

export const updateCompanySchema = z.object({
  name: z.string().min(2, "Company name is required").max(200),
  short_bio: z.string().max(300).optional().or(z.literal("")),
  full_bio: z.string().max(5000).optional().or(z.literal("")),
  industry: z.string().max(100).optional().or(z.literal("")),
  size: z
    .enum(["1-10", "11-50", "51-200", "201-500", "501-1000", "1000+"])
    .optional(),
  website: z.string().max(300).optional().or(z.literal("")),
  contact_email: z.string().email().optional().or(z.literal("")),
  contact_phone: z.string().max(50).optional().or(z.literal("")),
  location: z.string().max(200).optional().or(z.literal("")),
});

export const createPostSchema = z.object({
  title: z.string().min(1, "กรุณากรอกหัวข้อโพสต์").max(200),
  content: z.string().min(1, "กรุณากรอกเนื้อหาโพสต์").max(2000),
  image_url: z.string().url().optional().or(z.literal("")),
});

export const inviteMemberSchema = z.object({
  email: z.string().email("Invalid email address"),
  role: z.enum(["admin", "recruiter"]),
});

export type UpdateCompanyInput = z.infer<typeof updateCompanySchema>;
export type CreatePostInput = z.infer<typeof createPostSchema>;
export type InviteMemberInput = z.infer<typeof inviteMemberSchema>;
