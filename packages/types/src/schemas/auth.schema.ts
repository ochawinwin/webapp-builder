import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("รูปแบบอีเมลไม่ถูกต้อง"),
  password: z.string().min(1, "กรุณากรอกรหัสผ่าน"),
});

export const candidateRegisterSchema = z
  .object({
    email: z.string().email("รูปแบบอีเมลไม่ถูกต้อง"),
    password: z
      .string()
      .min(8, "รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร")
      .regex(/[A-Z]/, "รหัสผ่านต้องมีตัวพิมพ์ใหญ่อย่างน้อย 1 ตัว")
      .regex(/[0-9]/, "รหัสผ่านต้องมีตัวเลขอย่างน้อย 1 ตัว"),
    confirmPassword: z.string(),
    first_name: z.string().min(1, "กรุณากรอกชื่อ").max(100),
    last_name: z.string().min(1, "กรุณากรอกนามสกุล").max(100),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "รหัสผ่านไม่ตรงกัน",
    path: ["confirmPassword"],
  });

export const companyRegisterSchema = z
  .object({
    email: z.string().email("รูปแบบอีเมลไม่ถูกต้อง"),
    password: z
      .string()
      .min(8, "รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร")
      .regex(/[A-Z]/, "รหัสผ่านต้องมีตัวพิมพ์ใหญ่อย่างน้อย 1 ตัว")
      .regex(/[0-9]/, "รหัสผ่านต้องมีตัวเลขอย่างน้อย 1 ตัว"),
    confirmPassword: z.string(),
    company_name: z.string().min(2, "กรุณากรอกชื่อบริษัท").max(200),
    industry: z.string().min(1, "กรุณาเลือกอุตสาหกรรม").max(100),
    size: z.enum(["1-10", "11-50", "51-200", "201-500", "501-1000", "1000+"]),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "รหัสผ่านไม่ตรงกัน",
    path: ["confirmPassword"],
  });

export type LoginInput = z.infer<typeof loginSchema>;
export type CandidateRegisterInput = z.infer<typeof candidateRegisterSchema>;
export type CompanyRegisterInput = z.infer<typeof companyRegisterSchema>;
