"use client";

import { useRef, useState, useEffect } from "react";
import { Card, Input, Textarea, Select, Button, Tag } from "@futurecareer/ui";
import { uploadAvatarAction, updateProfileAction } from "@/app/actions/profileActions";
import { createBrowserClient } from "@/lib/supabase/browser";

export default function DashboardProfilePage() {
  const [fullName, setFullName] = useState("");
  const [bio, setBio] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [skills, setSkills] = useState<string[]>([]);
  const [industries, setIndustries] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState("");
  const [industryInput, setIndustryInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");

  const avatarInputRef = useRef<HTMLInputElement>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [avatarError, setAvatarError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProfile() {
      const supabase = createBrowserClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (profile) {
        setFullName(profile.full_name ?? "");
        setBio(profile.bio ?? "");
        setEmail(profile.email ?? user.email ?? "");
        setPhone(profile.phone ?? "");
        setAvatarUrl(profile.avatar_url);
      }

      // Fetch user's tags
      const { data: profileTags } = await supabase
        .from("profile_tags")
        .select("tag_id, tags(name, category)")
        .eq("profile_id", user.id);

      if (profileTags) {
        const skillTags: string[] = [];
        const industryTags: string[] = [];
        for (const pt of profileTags) {
          const tag = pt.tags as unknown as { name: string; category: string } | null;
          if (tag?.category === "skill") skillTags.push(tag.name);
          if (tag?.category === "industry") industryTags.push(tag.name);
        }
        setSkills(skillTags);
        setIndustries(industryTags);
      }

      setLoading(false);
    }
    fetchProfile();
  }, []);

  const initials = fullName
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) || "?";

  const handleAddSkill = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && skillInput.trim()) {
      e.preventDefault();
      if (!skills.includes(skillInput.trim())) {
        setSkills([...skills, skillInput.trim()]);
      }
      setSkillInput("");
    }
  };

  const handleAddIndustry = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && industryInput.trim()) {
      e.preventDefault();
      if (!industries.includes(industryInput.trim())) {
        setIndustries([...industries, industryInput.trim()]);
      }
      setIndustryInput("");
    }
  };

  async function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = "";

    const allowed = ["image/jpeg", "image/png", "image/webp"];
    if (!allowed.includes(file.type)) {
      setAvatarError("รองรับเฉพาะไฟล์ JPEG, PNG หรือ WebP เท่านั้น");
      return;
    }

    setAvatarError(null);
    setAvatarUploading(true);

    const formData = new FormData();
    formData.append("avatar", file);

    try {
      const result = await uploadAvatarAction(formData);
      if (!result.success) {
        setAvatarError(typeof result.error === "string" ? result.error : "เกิดข้อผิดพลาดในการอัปโหลด");
      } else {
        setAvatarUrl(result.data.avatarUrl);
      }
    } catch {
      setAvatarError("เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง");
    } finally {
      setAvatarUploading(false);
    }
  }

  async function handleSave() {
    setSaving(true);
    setSaveMessage("");
    const result = await updateProfileAction({ fullName, bio, phone });
    if (result.success) {
      setSaveMessage("บันทึกสำเร็จ");
      setTimeout(() => setSaveMessage(""), 3000);
    } else {
      setSaveMessage(typeof result.error === "string" ? result.error : "เกิดข้อผิดพลาด");
    }
    setSaving(false);
  }

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <p className="text-text-tertiary">กำลังโหลด...</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <h1 className="text-2xl font-bold text-text-primary">ตั้งค่าโปรไฟล์</h1>

      <input
        ref={avatarInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="sr-only"
        aria-hidden="true"
        tabIndex={-1}
        onChange={handleAvatarChange}
      />

      <Card>
        <div className="flex items-center gap-6">
          <button
            type="button"
            aria-label="เปลี่ยนรูปโปรไฟล์"
            className="relative shrink-0 focus:outline-none"
            onClick={() => avatarInputRef.current?.click()}
            disabled={avatarUploading}
          >
            <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-full bg-primary-light">
              {avatarUrl ? (
                <img src={avatarUrl} alt="รูปโปรไฟล์" className="h-full w-full object-cover" />
              ) : (
                <span className="text-2xl font-bold text-primary">{initials}</span>
              )}
            </div>
            {avatarUploading && (
              <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40">
                <svg className="h-6 w-6 animate-spin text-white" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              </div>
            )}
          </button>
          <div className="space-y-2">
            <p className="text-sm font-medium text-text-primary">รูปโปรไฟล์</p>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm" onClick={() => avatarInputRef.current?.click()} disabled={avatarUploading}>
                อัปโหลดรูป
              </Button>
            </div>
            {avatarError && <p role="alert" className="text-xs text-error">{avatarError}</p>}
          </div>
        </div>
      </Card>

      <Card>
        <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
          <Input label="ชื่อ-นามสกุล" value={fullName} onChange={(e) => setFullName(e.target.value)} />
          <Textarea label="แนะนำตัว" value={bio} onChange={(e) => setBio(e.target.value)} rows={4} placeholder="เล่าเกี่ยวกับตัวคุณ..." />
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <Input label="อีเมล" variant="email" value={email} disabled />
            <Input label="เบอร์โทร" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="081-xxx-xxxx" />
          </div>
        </form>
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
              {skills.map((skill) => (
                <Tag key={skill} label={skill} category="skill" onRemove={() => setSkills(skills.filter((s) => s !== skill))} />
              ))}
            </div>
            <input
              type="text"
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              onKeyDown={handleAddSkill}
              placeholder="พิมพ์แล้วกด Enter เพื่อเพิ่มทักษะ"
              className="w-full rounded-[6px] border border-border-default bg-bg-primary px-3 py-2 text-sm text-text-primary placeholder:text-text-tertiary focus:outline-none focus:ring-2 focus:ring-focus-ring focus:border-primary transition-colors"
              aria-label="เพิ่มทักษะ"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-text-primary">อุตสาหกรรมที่สนใจ</label>
            <div className="flex flex-wrap gap-2">
              {industries.map((industry) => (
                <Tag key={industry} label={industry} category="industry" onRemove={() => setIndustries(industries.filter((i) => i !== industry))} />
              ))}
            </div>
            <input
              type="text"
              value={industryInput}
              onChange={(e) => setIndustryInput(e.target.value)}
              onKeyDown={handleAddIndustry}
              placeholder="พิมพ์แล้วกด Enter เพื่อเพิ่มอุตสาหกรรม"
              className="w-full rounded-[6px] border border-border-default bg-bg-primary px-3 py-2 text-sm text-text-primary placeholder:text-text-tertiary focus:outline-none focus:ring-2 focus:ring-focus-ring focus:border-primary transition-colors"
              aria-label="เพิ่มอุตสาหกรรม"
            />
          </div>
        </div>
      </Card>

      <div className="flex items-center justify-end gap-4">
        {saveMessage && (
          <p className={`text-sm ${saveMessage === "บันทึกสำเร็จ" ? "text-success" : "text-error"}`}>{saveMessage}</p>
        )}
        <Button variant="primary" size="lg" onClick={handleSave} disabled={saving}>
          {saving ? "กำลังบันทึก..." : "บันทึกการเปลี่ยนแปลง"}
        </Button>
      </div>

      <hr className="border-border-default" />

      <Card className="border-error/30">
        <div className="space-y-4">
          <div>
            <h2 className="text-lg font-semibold text-error">โซนอันตราย</h2>
            <p className="mt-1 text-sm text-text-secondary">
              การลบบัญชีจะลบข้อมูลทั้งหมดของคุณอย่างถาวร รวมถึงโปรไฟล์ เรซูเม่ และประวัติการสมัครงาน
            </p>
          </div>
          <Button variant="danger" size="md">ลบบัญชี</Button>
        </div>
      </Card>
    </div>
  );
}
