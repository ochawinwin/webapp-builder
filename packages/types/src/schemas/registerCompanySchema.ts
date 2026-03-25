import { z } from "zod";

export const registerCompanySchema = z
  .object({
    fullName: z.string().min(1, "กรุณากรอกชื่อ-นามสกุล"),
    workEmail: z.string().email("รูปแบบอีเมลไม่ถูกต้อง"),
    companyName: z.string().min(1, "กรุณากรอกชื่อบริษัท"),
    password: z.string().min(8, "รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "รหัสผ่านไม่ตรงกัน",
    path: ["confirmPassword"],
  });

export type RegisterCompanyInput = z.infer<typeof registerCompanySchema>;
