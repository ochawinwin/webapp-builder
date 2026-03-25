"use client";

import { useState, useEffect } from "react";
import { Button, Badge } from "@futurecareer/ui";
import { createBrowserClient } from "@/lib/supabase/browser";
import { inviteRecruiterAction, removeTeamMemberAction } from "@/app/actions/companyActions";

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
}

export default function CompanyTeamPage() {
  const [inviteEmail, setInviteEmail] = useState("");
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [inviting, setInviting] = useState(false);
  const [error, setError] = useState("");
  const [companyId, setCompanyId] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTeam() {
      const supabase = createBrowserClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data: membership } = await supabase.from("company_members").select("company_id").eq("user_id", user.id).single();
      if (!membership?.company_id) return;
      const cid = membership.company_id;
      setCompanyId(cid);
      const { data } = await supabase
        .from("company_members")
        .select("id, role, profiles(full_name, email)")
        .eq("company_id", cid);
      if (data) {
        setMembers(data.map((m) => ({
          id: m.id,
          name: (m.profiles as unknown as { full_name: string })?.full_name ?? "Unknown",
          email: (m.profiles as unknown as { email: string })?.email ?? "",
          role: m.role,
        })));
      }
      setLoading(false);
    }
    fetchTeam();
  }, []);

  const handleInvite = async () => {
    if (!inviteEmail.trim()) return;
    setInviting(true);
    setError("");
    if (!companyId) return;
    const result = await inviteRecruiterAction(companyId, { email: inviteEmail });
    if (result.success) {
      setInviteEmail("");
    } else {
      setError(typeof result.error === "string" ? result.error : "เกิดข้อผิดพลาด");
    }
    setInviting(false);
  };

  const handleRemove = async (memberId: string) => {
    await removeTeamMemberAction(memberId);
    setMembers((prev) => prev.filter((m) => m.id !== memberId));
  };

  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="mb-6 text-2xl font-bold text-text-primary">จัดการทีมงาน</h1>

      <section className="mb-6 rounded-xl border border-border-default bg-bg-primary p-6 shadow-sm" aria-label="เชิญสมาชิกใหม่">
        <h2 className="mb-4 text-lg font-semibold text-text-primary">เชิญ Recruiter</h2>
        {error && <p className="mb-3 text-sm text-error">{error}</p>}
        <div className="flex flex-col gap-3 sm:flex-row">
          <label htmlFor="invite-email" className="sr-only">อีเมล</label>
          <input
            id="invite-email"
            type="email"
            value={inviteEmail}
            onChange={(e) => setInviteEmail(e.target.value)}
            placeholder="อีเมลของผู้ที่ต้องการเชิญ"
            className="flex-1 rounded-lg border border-border-default bg-bg-primary px-4 py-2.5 text-sm text-text-primary shadow-sm transition-colors placeholder:text-text-tertiary focus:border-primary focus:outline-none focus:ring-2 focus:ring-focus-ring"
          />
          <Button variant="primary" size="md" onClick={handleInvite} disabled={inviting}>
            {inviting ? "กำลังส่ง..." : "ส่งคำเชิญ"}
          </Button>
        </div>
      </section>

      <section className="rounded-xl border border-border-default bg-bg-primary shadow-sm" aria-label="สมาชิกทีม">
        <div className="border-b border-border-default px-6 py-4">
          <h2 className="text-lg font-semibold text-text-primary">สมาชิกทีม ({members.length})</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-border-default bg-bg-secondary">
                <th scope="col" className="px-6 py-3 font-medium text-text-secondary">ชื่อ</th>
                <th scope="col" className="px-6 py-3 font-medium text-text-secondary">อีเมล</th>
                <th scope="col" className="px-6 py-3 font-medium text-text-secondary">ตำแหน่ง</th>
                <th scope="col" className="px-6 py-3"><span className="sr-only">การจัดการ</span></th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={4} className="px-6 py-8 text-center text-text-tertiary">กำลังโหลด...</td></tr>
              ) : members.length === 0 ? (
                <tr><td colSpan={4} className="px-6 py-8 text-center text-text-tertiary">ยังไม่มีสมาชิกในทีม</td></tr>
              ) : members.map((member) => (
                <tr key={member.id} className="border-b border-border-default last:border-b-0">
                  <td className="px-6 py-4 font-medium text-text-primary">{member.name}</td>
                  <td className="px-6 py-4 text-text-secondary">{member.email}</td>
                  <td className="px-6 py-4">
                    <Badge variant={member.role === "admin" ? "info" : "violet"} size="sm">
                      {member.role === "admin" ? "แอดมิน" : "Recruiter"}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-right">
                    {member.role !== "admin" && (
                      <Button variant="danger" size="sm" onClick={() => handleRemove(member.id)}>ลบออก</Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
