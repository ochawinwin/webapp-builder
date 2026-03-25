import { HRRegisterForm } from "@/components/auth/HRRegisterForm";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "ลงทะเบียนบริษัท" };

export default function HRRegisterPage() {
  return <HRRegisterForm />;
}
