import { ForgotPasswordForm } from "@/components/auth/ForgotPasswordForm";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "ลืมรหัสผ่าน" };

export default function ForgotPasswordPage() {
  return <ForgotPasswordForm />;
}
