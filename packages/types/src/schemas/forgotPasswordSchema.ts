import { z } from "zod";

export const forgotPasswordSchema = z.object({
  email: z.string().email("รูปแบบอีเมลไม่ถูกต้อง"),
});

export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
