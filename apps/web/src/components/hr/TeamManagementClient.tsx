"use client";

import { useState, useTransition } from "react";
import { Button, Card, Input, Badge, Dialog } from "@futurecareer/ui";
import { inviteMemberAction, removeMemberAction } from "@/app/actions/team.actions";
import {
  Users,
  UserPlus,
  Trash2,
  ShieldCheck,
  Mail,
  Search,
  Send,
  Lock,
} from "lucide-react";
// Mail is used in the invite dialog
import { toast } from "sonner";
import type { CompanyMember, Profile } from "@futurecareer/types";

type MemberWithProfile = CompanyMember & { profile: Profile };

interface TeamManagementClientProps {
  members: MemberWithProfile[];
  currentUserId: string;
  isAdmin: boolean;
}

export function TeamManagementClient({
  members,
  currentUserId,
  isAdmin,
}: TeamManagementClientProps) {
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [searchQuery, setSearchQuery] = useState("");
  const [inviteError, setInviteError] = useState<string | null>(null);
  const [removingId, setRemovingId] = useState<string | null>(null);

  const filteredMembers = members.filter((m) => {
    const name = [m.profile.first_name, m.profile.last_name].filter(Boolean).join(" ");
    return name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const adminCount = members.filter((m) => m.role === "admin").length;
  const totalCount = members.length;

  const handleInvite = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setInviteError(null);
    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      const result = await inviteMemberAction(formData);
      if (result.success) {
        setIsInviteModalOpen(false);
        toast.success("ส่งคำเชิญเรียบร้อยแล้ว!", {
          description: `ระบบได้ส่งอีเมลคำเชิญไปที่ ${formData.get("email")} แล้ว`,
        });
      } else {
        setInviteError(result.error ?? "เกิดข้อผิดพลาด กรุณาลองใหม่");
      }
    });
  };

  const handleRemove = (memberId: string) => {
    if (!confirm("ยืนยันการลบสมาชิกคนนี้ออกจากทีม?")) return;
    setRemovingId(memberId);
    const formData = new FormData();
    formData.set("member_id", memberId);

    startTransition(async () => {
      const result = await removeMemberAction(formData);
      setRemovingId(null);
      if (result.success) {
        toast.success("ลบสมาชิกออกจากทีมเรียบร้อยแล้ว");
      } else {
        toast.error(result.error ?? "เกิดข้อผิดพลาด");
      }
    });
  };

  return (
    <div className="min-h-screen bg-muted/30 pb-20 pt-10">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <h1 className="text-3xl font-bold font-kanit mb-2">จัดการทีม (Team Management)</h1>
            <p className="text-muted-foreground font-sarabun">
              เพิ่มหรือจัดการสิทธิ์ของทีมงาน Recruiter ในบริษัทของคุณ
            </p>
          </div>
          {isAdmin && (
            <Button
              className="gap-2 font-bold font-kanit h-12 shadow-lg shadow-primary/20"
              onClick={() => setIsInviteModalOpen(true)}
            >
              <UserPlus className="w-5 h-5" /> เชิญทีมงานใหม่
            </Button>
          )}
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar Stats */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="p-6 border-none shadow-sm">
              <h4 className="font-bold font-kanit mb-4 flex items-center gap-2">
                <Users className="w-4 h-4 text-primary" /> สรุปทีมงาน
              </h4>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-xl">
                  <span className="text-sm font-medium">สมาชิกทั้งหมด</span>
                  <span className="font-bold text-lg">{totalCount}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-xl">
                  <span className="text-sm font-medium">แอดมิน (Admin)</span>
                  <span className="font-bold text-lg">{adminCount}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-xl">
                  <span className="text-sm font-medium">Recruiter</span>
                  <span className="font-bold text-lg">{totalCount - adminCount}</span>
                </div>
              </div>
            </Card>

            <Card className="p-6 border-none shadow-sm bg-primary text-white overflow-hidden relative">
              <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl" />
              <h4 className="font-bold font-kanit mb-2">สิทธิ์การเข้าถึง</h4>
              <p className="text-xs text-primary-foreground/80 leading-relaxed font-sarabun">
                แอดมินสามารถจัดการตำแหน่งงานและทีมงานได้ทั้งหมด ส่วน Recruiter
                จะจัดการได้เฉพาะตำแหน่งงานที่ได้รับมอบหมายเท่านั้น
              </p>
            </Card>
          </div>

          {/* Team Table */}
          <div className="lg:col-span-3">
            <Card className="border-none shadow-sm overflow-hidden">
              <div className="p-6 border-b border-border flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="relative w-full md:w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="ค้นหาสมาชิกทีม..."
                    className="pl-10 h-10 border-slate-200"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left font-sarabun">
                  <thead>
                    <tr className="bg-muted/50">
                      <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase">สมาชิก</th>
                      <th className="px-4 py-4 text-xs font-bold text-muted-foreground uppercase">สิทธิ์การใช้งาน</th>
                      <th className="px-4 py-4 text-xs font-bold text-muted-foreground uppercase">วันที่เข้าร่วม</th>
                      {isAdmin && (
                        <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase text-right">จัดการ</th>
                      )}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {filteredMembers.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="px-6 py-10 text-center text-muted-foreground font-sarabun text-sm">
                          ไม่พบสมาชิก
                        </td>
                      </tr>
                    ) : (
                      filteredMembers.map((member) => {
                        const name =
                          [member.profile.first_name, member.profile.last_name]
                            .filter(Boolean)
                            .join(" ") || "ไม่ระบุชื่อ";
                        const initials = name.charAt(0).toUpperCase();
                        const isCurrentUser = member.user_id === currentUserId;

                        return (
                          <tr key={member.id} className="hover:bg-muted/20 transition-colors group">
                            <td className="px-6 py-5">
                              <div className="flex items-center gap-4">
                                {member.profile.avatar_url ? (
                                  <img
                                    src={member.profile.avatar_url}
                                    alt={name}
                                    className="w-10 h-10 rounded-full object-cover border border-border shadow-sm"
                                  />
                                ) : (
                                  <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-primary font-bold text-sm border border-border shadow-sm">
                                    {initials}
                                  </div>
                                )}
                                <div>
                                  <p className="font-bold text-slate-900 mb-0.5">
                                    {name}
                                    {isCurrentUser && (
                                      <span className="ml-2 text-[10px] font-bold text-primary bg-primary/10 px-1.5 py-0.5 rounded-full">
                                        คุณ
                                      </span>
                                    )}
                                  </p>
                                  <p className="text-xs text-muted-foreground font-medium">
                                    {member.role === "admin" ? "Admin" : "Recruiter"}
                                  </p>
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-5">
                              <Badge
                                variant={member.role === "admin" ? "secondary" : "default"}
                                className="text-[10px] font-bold uppercase gap-1.5"
                              >
                                {member.role === "admin" ? (
                                  <ShieldCheck className="w-3 h-3" />
                                ) : (
                                  <Users className="w-3 h-3" />
                                )}
                                {member.role === "admin" ? "Admin" : "Recruiter"}
                              </Badge>
                            </td>
                            <td className="px-4 py-5 text-sm text-muted-foreground font-medium">
                              {new Date(member.created_at).toLocaleDateString("th-TH", {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              })}
                            </td>
                            {isAdmin && (
                              <td className="px-6 py-5 text-right">
                                {!isCurrentUser && (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-9 w-9 p-0 rounded-full text-destructive hover:bg-destructive/5 transition-colors"
                                    onClick={() => handleRemove(member.id)}
                                    disabled={removingId === member.id || isPending}
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                )}
                              </td>
                            )}
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </Card>

            {/* Security note */}
            <div className="mt-8 p-6 bg-yellow-50 border border-yellow-200 rounded-2xl flex items-start gap-4">
              <div className="w-10 h-10 bg-yellow-100 rounded-xl flex items-center justify-center text-yellow-600 shrink-0">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-yellow-900 mb-1">ความปลอดภัยของทีม</h4>
                <p className="text-sm text-yellow-800 leading-relaxed font-sarabun">
                  ในฐานะแอดมิน โปรดระมัดระวังในการมอบสิทธิ์ &apos;Admin&apos; ให้กับทีมงาน
                  เนื่องจากสมาชิกแอดมินสามารถเข้าถึงและแก้ไขข้อมูลสำคัญของบริษัททั้งหมดได้
                  รวมถึงการจัดการทีมงานคนอื่นๆ
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Invite Dialog */}
      <Dialog
        open={isInviteModalOpen}
        onOpenChange={(open) => {
          setIsInviteModalOpen(open);
          if (!open) setInviteError(null);
        }}
        title="เชิญทีมงานใหม่เข้าร่วมบริษัท"
        size="md"
      >
        <form onSubmit={handleInvite} className="space-y-6 font-sarabun">
          <div className="space-y-4">
            <div className="p-4 bg-muted/30 rounded-2xl border border-border/50 text-center space-y-2">
              <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-2">
                <Mail className="w-6 h-6" />
              </div>
              <h4 className="font-bold font-kanit">ส่งคำเชิญผ่านอีเมล</h4>
              <p className="text-xs text-muted-foreground">
                ระบบจะส่งลิงก์ให้ทีมงานลงทะเบียนและเข้าร่วมทีมของคุณอัตโนมัติ
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold font-kanit">อีเมลผู้รับ *</label>
              <Input
                type="email"
                name="email"
                placeholder="name@company.com"
                required
                className="h-11 border-slate-200"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold font-kanit">กำหนดสิทธิ์การใช้งาน (Role)</label>
              <div className="grid grid-cols-2 gap-4">
                <label className="flex flex-col gap-2 p-4 border border-border rounded-xl cursor-pointer hover:bg-muted/50 transition-colors relative group">
                  <input
                    type="radio"
                    name="role"
                    value="admin"
                    className="absolute top-4 right-4 text-primary"
                    defaultChecked
                  />
                  <ShieldCheck className="w-5 h-5 text-primary" />
                  <div className="space-y-0.5">
                    <p className="text-sm font-bold">Admin</p>
                    <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-tight">Full Access</p>
                  </div>
                </label>
                <label className="flex flex-col gap-2 p-4 border border-border rounded-xl cursor-pointer hover:bg-muted/50 transition-colors relative">
                  <input
                    type="radio"
                    name="role"
                    value="recruiter"
                    className="absolute top-4 right-4 text-primary"
                  />
                  <Users className="w-5 h-5 text-slate-400" />
                  <div className="space-y-0.5">
                    <p className="text-sm font-bold">Recruiter</p>
                    <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-tight">Limited Access</p>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {inviteError && (
            <p className="text-sm text-destructive bg-destructive/5 p-3 rounded-xl">{inviteError}</p>
          )}

          <div className="flex gap-4 pt-4 border-t border-border">
            <Button
              type="button"
              variant="ghost"
              className="flex-1"
              onClick={() => {
                setIsInviteModalOpen(false);
                setInviteError(null);
              }}
            >
              ยกเลิก
            </Button>
            <Button className="flex-1 font-bold gap-2" type="submit" disabled={isPending}>
              <Send className="w-4 h-4" /> {isPending ? "กำลังส่ง..." : "ส่งคำเชิญ"}
            </Button>
          </div>
        </form>
      </Dialog>
    </div>
  );
}
