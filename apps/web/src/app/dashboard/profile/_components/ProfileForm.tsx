"use client";

import { useState, useTransition } from "react";
import { Card, Input, Textarea, Select, Button, Tag } from "@futurecareer/ui";
import { updateProfileAction } from "@/app/actions/profileActions";
import type { ProfileWithTags, Tag as TagType } from "@futurecareer/types";

interface ProfileFormProps {
  profile: ProfileWithTags | null;
  allTags: TagType[];
}

export default function ProfileForm({ profile, allTags }: ProfileFormProps) {
  const skillTags = allTags.filter((t) => t.category === "skill");
  const industryTags = allTags.filter((t) => t.category === "industry");

  const initialSkillIds = new Set(
    (profile?.tags ?? []).filter((t) => t.category === "skill").map((t) => t.id)
  );
  const initialIndustryIds = new Set(
    (profile?.tags ?? []).filter((t) => t.category === "industry").map((t) => t.id)
  );

  const [selectedSkillIds, setSelectedSkillIds] = useState<Set<string>>(initialSkillIds);
  const [selectedIndustryIds, setSelectedIndustryIds] = useState<Set<string>>(initialIndustryIds);
  const [skillInput, setSkillInput] = useState("");
  const [industryInput, setIndustryInput] = useState("");
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [isPending, startTransition] = useTransition();

  const visibleSkills = skillTags.filter((t) =>
    selectedSkillIds.has(t.id) || t.name.toLowerCase().includes(skillInput.toLowerCase())
  );

  const visibleIndustries = industryTags.filter((t) =>
    selectedIndustryIds.has(t.id) || t.name.toLowerCase().includes(industryInput.toLowerCase())
  );

  const handleSave = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);

    const input = {
      fullName: data.get("fullName") as string,
      bio: data.get("bio") as string,
      phone: data.get("phone") as string,
      tagIds: [...selectedSkillIds, ...selectedIndustryIds],
    };

    setSaveStatus("saving");
    startTransition(async () => {
      const result = await updateProfileAction(input);
      setSaveStatus(result.success ? "saved" : "error");
      if (result.success) setTimeout(() => setSaveStatus("idle"), 2000);
    });
  };

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <h1 className="text-2xl font-bold text-text-primary">ตั้งค่าโปรไฟล์</h1>

      <Card>
        <div className="flex items-center gap-6">
          <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-primary-light text-2xl font-bold text-primary" aria-label="รูปโปรไฟล์">
            {profile?.fullName?.[0] ?? "?"}
          </div>
          <div className="space-y-2">
            <p className="text-sm font-medium text-text-primary">รูปโปรไฟล์</p>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm">อัปโหลดรูป</Button>
            </div>
          </div>
        </div>
      </Card>

      <form onSubmit={handleSave} className="space-y-8">
        <Card>
          <div className="space-y-6">
            <Input
              label="ชื่อ-นามสกุล"
              name="fullName"
              defaultValue={profile?.fullName ?? ""}
            />
            <Textarea
              label="แนะนำตัว"
              name="bio"
              defaultValue={profile?.bio ?? ""}
              rows={4}
            />
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <Input label="อีเมล" variant="email" defaultValue={profile?.email ?? ""} disabled />
              <Input label="เบอร์โทร" name="phone" defaultValue={profile?.phone ?? ""} />
            </div>
          </div>
        </Card>

        <Card>
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold text-text-primary">ความชอบของคุณ</h2>
              <p className="mt-1 text-sm text-text-secondary">ข้อมูลนี้ช่วยจับคู่งานที่เหมาะกับคุณ</p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-text-primary">ทักษะ</label>
              <div className="flex flex-wrap gap-2">
                {skillTags.filter((t) => selectedSkillIds.has(t.id)).map((t) => (
                  <Tag
                    key={t.id}
                    label={t.name}
                    category="skill"
                    onRemove={() => {
                      const next = new Set(selectedSkillIds);
                      next.delete(t.id);
                      setSelectedSkillIds(next);
                    }}
                  />
                ))}
              </div>
              <input
                type="text"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                placeholder="ค้นหาทักษะ..."
                className="w-full rounded-[6px] border border-border-default bg-bg-primary px-3 py-2 text-sm text-text-primary placeholder:text-text-tertiary focus:outline-none focus:ring-2 focus:ring-focus-ring focus:border-primary transition-colors"
              />
              {skillInput && (
                <div className="flex flex-wrap gap-1.5">
                  {visibleSkills.filter((t) => !selectedSkillIds.has(t.id)).slice(0, 10).map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => {
                        setSelectedSkillIds(new Set([...selectedSkillIds, t.id]));
                        setSkillInput("");
                      }}
                      className="rounded-full bg-bg-tertiary px-3 py-1 text-xs text-text-secondary hover:bg-primary-light hover:text-primary"
                    >
                      + {t.name}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-text-primary">อุตสาหกรรมที่สนใจ</label>
              <div className="flex flex-wrap gap-2">
                {industryTags.filter((t) => selectedIndustryIds.has(t.id)).map((t) => (
                  <Tag
                    key={t.id}
                    label={t.name}
                    category="industry"
                    onRemove={() => {
                      const next = new Set(selectedIndustryIds);
                      next.delete(t.id);
                      setSelectedIndustryIds(next);
                    }}
                  />
                ))}
              </div>
              <input
                type="text"
                value={industryInput}
                onChange={(e) => setIndustryInput(e.target.value)}
                placeholder="ค้นหาอุตสาหกรรม..."
                className="w-full rounded-[6px] border border-border-default bg-bg-primary px-3 py-2 text-sm text-text-primary placeholder:text-text-tertiary focus:outline-none focus:ring-2 focus:ring-focus-ring focus:border-primary transition-colors"
              />
              {industryInput && (
                <div className="flex flex-wrap gap-1.5">
                  {visibleIndustries.filter((t) => !selectedIndustryIds.has(t.id)).slice(0, 10).map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => {
                        setSelectedIndustryIds(new Set([...selectedIndustryIds, t.id]));
                        setIndustryInput("");
                      }}
                      className="rounded-full bg-bg-tertiary px-3 py-1 text-xs text-text-secondary hover:bg-primary-light hover:text-primary"
                    >
                      + {t.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </Card>

        <div className="flex items-center justify-end gap-4">
          {saveStatus === "saved" && <span className="text-sm text-success">บันทึกเรียบร้อยแล้ว</span>}
          {saveStatus === "error" && <span className="text-sm text-error">เกิดข้อผิดพลาด กรุณาลองใหม่</span>}
          <Button variant="primary" size="lg" type="submit" disabled={isPending}>
            {isPending ? "กำลังบันทึก..." : "บันทึกการเปลี่ยนแปลง"}
          </Button>
        </div>
      </form>

      <hr className="border-border-default" />

      <Card className="border-error/30">
        <div className="space-y-4">
          <div>
            <h2 className="text-lg font-semibold text-error">โซนอันตราย</h2>
            <p className="mt-1 text-sm text-text-secondary">
              การลบบัญชีจะลบข้อมูลทั้งหมดของคุณอย่างถาวร รวมถึงโปรไฟล์ เรซูเม่ และประวัติการสมัครงาน
            </p>
          </div>
          <Button variant="danger" size="md" type="button">ลบบัญชี</Button>
        </div>
      </Card>
    </div>
  );
}
