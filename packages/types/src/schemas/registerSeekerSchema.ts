import { z } from "zod";

export const registerSeekerSchema = z
  .object({
    fullName: z.string().min(1, "กรุณากรอกชื่อ-นามสกุล"),
    email: z.string().email("รูปแบบอีเมลไม่ถูกต้อง"),
    password: z.string().min(8, "รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "รหัสผ่านไม่ตรงกัน",
    path: ["confirmPassword"],
  });

export type RegisterSeekerInput = z.infer<typeof registerSeekerSchema>;
