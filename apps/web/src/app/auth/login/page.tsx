import type { Metadata } from "next";
import { LoginForm } from "./_components/LoginForm";

export const metadata: Metadata = { title: "เข้าสู่ระบบ" };

export default function LoginPage() {
  return <LoginForm />;
}
