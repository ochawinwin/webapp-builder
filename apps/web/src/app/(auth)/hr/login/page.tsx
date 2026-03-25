import { HRLoginForm } from "@/components/auth/HRLoginForm";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "เข้าสู่ระบบ HR" };

export default function HRLoginPage() {
  return <HRLoginForm />;
}
