"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Tag } from "@futurecareer/ui";
import { createJobAction } from "@/app/actions/jobActions";

const INITIAL_SKILLS: string[] = [];

export default function NewJobEditPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [jobTitle, setJobTitle] = useState("");
  const [jobDesc, setJobDesc] = useState("");
  const [skills, setSkills] = useState<string[]>(INITIAL_SKILLS);
  const [skillInput, setSkillInput] = useState("");
  const [industryVal, setIndustryVal] = useState("technology");
  const [positionVal, setPositionVal] = useState("engineering");
  const [levelVal, setLevelVal] = useState("mid");
  const [locationVal, setLocationVal] = useState("bangkok");
  const [jobType, setJobType] = useState("fulltime");
  const [statusVal, setStatusVal] = useState("draft");

  async function handleSave(status: "draft" | "active") {
    setSaving(true);
    setError(null);
    try {
      const result = await createJobAction({
        title: jobTitle,
        description: jobDesc || undefined,
        location: locationVal,
        jobType,
        level: levelVal,
        status,
        tagIds: [],
      });
      if (result.success) {
        router.push("/company/jobs");
      } else {
        setError(typeof result.error === "string" ? result.error : "เกิดข้อผิดพลาดในการบันทึก");
      }
    } catch {
      setError("เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง");
    } finally {
      setSaving(false);
    }
  }

  const addSkill = () => {
    const trimmed = skillInput.trim();
    if (trimmed && !skills.includes(trimmed)) {
      setSkills([...skills, trimmed]);
      setSkillInput("");
    }
  };

  return (
    <div className="mx-auto max-w-3xl pb-24">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-text-primary">สร้างประกาศรับสมัครงาน</h1>
        <Button variant="outline" size="md">ดูตัวอย่าง</Button>
      </div>

      <div className="space-y-6">
        <section className="rounded-xl border border-border-default bg-bg-primary p-6 shadow-sm" aria-labelledby="job-details-heading">
          <h2 id="job-details-heading" className="mb-4 text-lg font-semibold text-text-primary">รายละเอียดงาน</h2>
          <div className="space-y-4">
            <div>
              <label htmlFor="job-title" className="mb-2 block text-sm font-medium text-text-primary">ชื่อตำแหน่ง</label>
              <input
                id="job-title"
                type="text"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                placeholder="เช่น Senior Frontend Developer"
                className="w-full rounded-lg border border-border-default bg-bg-primary px-4 py-2.5 text-sm text-text-primary shadow-sm transition-colors placeholder:text-text-tertiary focus:border-primary focus:outline-none focus:ring-2 focus:ring-focus-ring"
              />
            </div>
            <div>
              <label htmlFor="job-desc" className="mb-2 block text-sm font-medium text-text-primary">รายละเอียดงาน</label>
              <div className="flex gap-1 rounded-t-lg border border-b-0 border-border-default bg-bg-tertiary px-2 py-1.5">
                {["B", "I", "•", "1.", "🔗"].map((btn) => (
                  <button key={btn} type="button" className="rounded px-2 py-1 text-sm text-text-secondary hover:bg-bg-primary">{btn}</button>
                ))}
              </div>
              <textarea
                id="job-desc"
                rows={8}
                value={jobDesc}
                onChange={(e) => setJobDesc(e.target.value)}
                placeholder="อธิบายหน้าที่ความรับผิดชอบ คุณสมบัติที่ต้องการ และสวัสดิการ..."
                className="w-full rounded-b-lg border border-border-default bg-bg-primary px-4 py-2.5 text-sm text-text-primary shadow-sm transition-colors placeholder:text-text-tertiary focus:border-primary focus:outline-none focus:ring-2 focus:ring-focus-ring"
              />
            </div>
          </div>
        </section>

        <section className="rounded-xl border border-border-default bg-bg-primary p-6 shadow-sm" aria-labelledby="tags-heading">
          <h2 id="tags-heading" className="mb-4 text-lg font-semibold text-text-primary">Tags &amp; หมวดหมู่</h2>
          <div className="space-y-4">
            <div>
              <label htmlFor="skill-input" className="mb-2 block text-sm font-medium text-text-primary">ทักษะ</label>
              {skills.length > 0 && (
                <div className="mb-2 flex flex-wrap gap-2">
                  {skills.map((skill) => (
                    <Tag key={skill} label={skill} category="skill" onRemove={() => setSkills(skills.filter((s) => s !== skill))} />
                  ))}
                </div>
              )}
              <div className="flex gap-2">
                <input
                  id="skill-input"
                  type="text"
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addSkill(); } }}
                  placeholder="พิมพ์ทักษะแล้วกด Enter"
                  className="flex-1 rounded-lg border border-border-default bg-bg-primary px-4 py-2.5 text-sm text-text-primary shadow-sm transition-colors placeholder:text-text-tertiary focus:border-primary focus:outline-none focus:ring-2 focus:ring-focus-ring"
                />
                <Button variant="outline" size="md" onClick={addSkill}>เพิ่ม</Button>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="new-industry" className="mb-2 block text-sm font-medium text-text-primary">อุตสาหกรรม</label>
                <select id="new-industry" value={industryVal} onChange={(e) => setIndustryVal(e.target.value)} className="w-full rounded-lg border border-border-default bg-bg-primary px-4 py-2.5 text-sm text-text-primary shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-focus-ring">
                  <option value="technology">Technology</option>
                  <option value="finance">Finance</option>
                  <option value="healthcare">Healthcare</option>
                </select>
              </div>
              <div>
                <label htmlFor="new-position" className="mb-2 block text-sm font-medium text-text-primary">ตำแหน่ง</label>
                <select id="new-position" value={positionVal} onChange={(e) => setPositionVal(e.target.value)} className="w-full rounded-lg border border-border-default bg-bg-primary px-4 py-2.5 text-sm text-text-primary shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-focus-ring">
                  <option value="engineering">Engineering</option>
                  <option value="design">Design</option>
                  <option value="product">Product</option>
                  <option value="marketing">Marketing</option>
                </select>
              </div>
              <div>
                <label htmlFor="new-level" className="mb-2 block text-sm font-medium text-text-primary">ระดับ</label>
                <select id="new-level" value={levelVal} onChange={(e) => setLevelVal(e.target.value)} className="w-full rounded-lg border border-border-default bg-bg-primary px-4 py-2.5 text-sm text-text-primary shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-focus-ring">
                  <option value="junior">Junior</option>
                  <option value="mid">Mid-level</option>
                  <option value="senior">Senior</option>
                  <option value="lead">Lead</option>
                  <option value="manager">Manager</option>
                </select>
              </div>
              <div>
                <label htmlFor="new-location" className="mb-2 block text-sm font-medium text-text-primary">สถานที่</label>
                <select id="new-location" value={locationVal} onChange={(e) => setLocationVal(e.target.value)} className="w-full rounded-lg border border-border-default bg-bg-primary px-4 py-2.5 text-sm text-text-primary shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-focus-ring">
                  <option value="bangkok">กรุงเทพมหานคร</option>
                  <option value="remote">Remote</option>
                  <option value="hybrid">Hybrid</option>
                  <option value="chiangmai">เชียงใหม่</option>
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="new-job-type" className="mb-2 block text-sm font-medium text-text-primary">ประเภทงาน</label>
              <select id="new-job-type" value={jobType} onChange={(e) => setJobType(e.target.value)} className="w-full rounded-lg border border-border-default bg-bg-primary px-4 py-2.5 text-sm text-text-primary shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-focus-ring sm:w-1/2">
                <option value="fulltime">Full-time</option>
                <option value="parttime">Part-time</option>
                <option value="contract">Contract</option>
                <option value="internship">Internship</option>
              </select>
            </div>
          </div>
        </section>

        <section className="rounded-xl border border-border-default bg-bg-primary p-6 shadow-sm">
          <h2 className="mb-2 text-lg font-semibold text-text-primary">สถานะ</h2>
          <p className="text-sm">
            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
              statusVal === "active" ? "bg-success-bg text-success" : "bg-bg-tertiary text-text-tertiary"
            }`}>
              {statusVal === "active" ? "เผยแพร่" : "แบบร่าง"}
            </span>
          </p>
        </section>
      </div>

      {error && (
        <div role="alert" className="mt-4 rounded-lg bg-error-bg p-3 text-sm text-error">{error}</div>
      )}

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border-default bg-bg-primary px-6 py-4 shadow-lg md:left-[250px]">
        <div className="mx-auto flex max-w-3xl justify-end gap-3">
          <Button variant="outline" size="md" onClick={() => handleSave("draft")} disabled={saving}>
            {saving ? "กำลังบันทึก..." : "บันทึกเป็นแบบร่าง"}
          </Button>
          <Button variant="primary" size="md" onClick={() => handleSave("active")} disabled={saving}>
            {saving ? "กำลังเผยแพร่..." : "เผยแพร่"}
          </Button>
        </div>
      </div>
    </div>
  );
}
