import { z } from "zod";

export const inviteRecruiterSchema = z.object({
  email: z.string().email("รูปแบบอีเมลไม่ถูกต้อง"),
});

export type InviteRecruiterInput = z.infer<typeof inviteRecruiterSchema>;
