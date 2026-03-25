"use client";

import { useState, useTransition } from "react";
import { Button, Card, Input } from "@futurecareer/ui";
import { updateProfileAction } from "@/app/actions/profile.actions";
import { updatePasswordAction } from "@/app/actions/auth.actions";
import { User, Lock, Eye, EyeOff, CheckCircle2, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import type { Profile } from "@futurecareer/types";

interface HRAccountFormProps {
  profile: Profile;
  email: string;
}

export function HRAccountForm({ profile, email }: HRAccountFormProps) {
  const [isProfilePending, startProfileTransition] = useTransition();
  const [isPasswordPending, startPasswordTransition] = useTransition();
  const [profileError, setProfileError] = useState<string | null>(null);
  const [profileSuccess, setProfileSuccess] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleProfileSave = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setProfileError(null);
    setProfileSuccess(false);
    const formData = new FormData(e.currentTarget);

    startProfileTransition(async () => {
      const result = await updateProfileAction(formData);
      if (result.success) {
        setProfileSuccess(true);
        toast.success("บันทึกข้อมูลสำเร็จ!");
        setTimeout(() => setProfileSuccess(false), 3000);
      } else {
        setProfileError(result.error ?? "เกิดข้อผิดพลาด");
      }
    });
  };

  const handlePasswordChange = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPasswordError(null);
    const formData = new FormData(e.currentTarget);

    startPasswordTransition(async () => {
      const result = await updatePasswordAction(formData);
      if (result.success) {
        toast.success("เปลี่ยนรหัสผ่านสำเร็จ!");
        (e.target as HTMLFormElement).reset();
      } else {
        setPasswordError(result.error ?? "เกิดข้อผิดพลาด");
      }
    });
  };

  return (
    <div className="min-h-screen bg-muted/30 pb-20 pt-10">
      <div className="container mx-auto px-4 max-w-2xl space-y-6">
        <div>
          <h1 className="text-3xl font-bold font-kanit mb-1">บัญชีของฉัน</h1>
          <p className="text-muted-foreground font-sarabun text-sm">จัดการข้อมูลส่วนตัวและรหัสผ่าน</p>
        </div>

        {/* Personal Info */}
        <Card className="p-6 border-none shadow-sm">
          <div className="flex items-center gap-2 mb-6">
            <User className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-bold font-kanit">ข้อมูลส่วนตัว</h2>
          </div>

          <form onSubmit={handleProfileSave} className="space-y-4 font-sarabun">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-semibold">ชื่อ *</label>
                <Input
                  name="first_name"
                  defaultValue={profile.first_name ?? ""}
                  placeholder="ชื่อ"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-semibold">นามสกุล *</label>
                <Input
                  name="last_name"
                  defaultValue={profile.last_name ?? ""}
                  placeholder="นามสกุล"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-semibold">อีเมล</label>
              <Input value={email} disabled className="bg-muted/50 text-muted-foreground" />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-semibold">เบอร์โทรศัพท์</label>
              <Input
                name="phone"
                defaultValue={profile.phone ?? ""}
                placeholder="เบอร์โทรศัพท์"
              />
            </div>

            {profileError && (
              <div className="flex items-center gap-2 text-sm text-destructive bg-destructive/5 p-3 rounded-xl">
                <AlertCircle className="w-4 h-4 shrink-0" />
                {profileError}
              </div>
            )}
            {profileSuccess && (
              <div className="flex items-center gap-2 text-sm text-success bg-success/5 p-3 rounded-xl">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                บันทึกข้อมูลเรียบร้อยแล้ว
              </div>
            )}

            <div className="flex justify-end pt-2">
              <Button type="submit" disabled={isProfilePending} className="font-bold px-8">
                {isProfilePending ? "กำลังบันทึก..." : "บันทึก"}
              </Button>
            </div>
          </form>
        </Card>

        {/* Change Password */}
        <Card className="p-6 border-none shadow-sm">
          <div className="flex items-center gap-2 mb-6">
            <Lock className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-bold font-kanit">เปลี่ยนรหัสผ่าน</h2>
          </div>

          <form onSubmit={handlePasswordChange} className="space-y-4 font-sarabun">
            <div className="space-y-1.5">
              <label className="text-sm font-semibold">รหัสผ่านใหม่ *</label>
              <div className="relative">
                <Input
                  name="password"
                  type={showNewPassword ? "text" : "password"}
                  placeholder="รหัสผ่านใหม่ (อย่างน้อย 8 ตัว ตัวพิมพ์ใหญ่ + ตัวเลข)"
                  required
                  className="pr-10"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  onClick={() => setShowNewPassword((v) => !v)}
                >
                  {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-semibold">ยืนยันรหัสผ่านใหม่ *</label>
              <div className="relative">
                <Input
                  name="confirm_password"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="ยืนยันรหัสผ่านใหม่"
                  required
                  className="pr-10"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  onClick={() => setShowConfirmPassword((v) => !v)}
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {passwordError && (
              <div className="flex items-center gap-2 text-sm text-destructive bg-destructive/5 p-3 rounded-xl">
                <AlertCircle className="w-4 h-4 shrink-0" />
                {passwordError}
              </div>
            )}

            <div className="flex justify-end pt-2">
              <Button type="submit" disabled={isPasswordPending} variant="outline" className="font-bold px-8">
                {isPasswordPending ? "กำลังเปลี่ยน..." : "เปลี่ยนรหัสผ่าน"}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}
