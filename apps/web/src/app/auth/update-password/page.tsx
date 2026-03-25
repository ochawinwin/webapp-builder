import { UpdatePasswordForm } from "@/components/auth/UpdatePasswordForm";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "ตั้งรหัสผ่านใหม่" };

export default function UpdatePasswordPage() {
  return <UpdatePasswordForm />;
}
