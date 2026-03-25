import { CandidateLoginForm } from "@/components/auth/CandidateLoginForm";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "เข้าสู่ระบบ" };

export default function LoginPage() {
  return <CandidateLoginForm />;
}
