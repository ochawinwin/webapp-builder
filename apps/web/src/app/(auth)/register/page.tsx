import { CandidateRegisterForm } from "@/components/auth/CandidateRegisterForm";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "สมัครสมาชิก" };

export default function RegisterPage() {
  return <CandidateRegisterForm />;
}
