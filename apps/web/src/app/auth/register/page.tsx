import type { Metadata } from "next";
import { RegisterForm } from "./_components/RegisterForm";

export const metadata: Metadata = { title: "สมัครสมาชิก" };

export default function RegisterPage() {
  return <RegisterForm />;
}
