"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Tag } from "@futurecareer/ui";
import { updateJobAction } from "@/app/actions/jobActions";

interface EditJobFormProps {
  jobId: string;
  initialData: {
    title: string;
    description: string;
    location: string;
    jobType: string;
    level: string;
    status: string;
  };
}

export function EditJobForm({ jobId, initialData }: EditJobFormProps) {
  const router = useRouter();
  const [jobTitle, setJobTitle] = useState(initialData.title);
  const [jobDesc, setJobDesc] = useState(initialData.description);
  const [skills, setSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState("");
  const [locationVal, setLocationVal] = useState(initialData.location);
  const [jobType, setJobType] = useState(initialData.jobType);
  const [levelVal, setLevelVal] = useState(initialData.level);
  const [statusVal, setStatusVal] = useState(initialData.status);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const addSkill = () => {
    const trimmed = skillInput.trim();
    if (trimmed && !skills.includes(trimmed)) {
      setSkills([...skills, trimmed]);
      setSkillInput("");
    }
  };

  async function handleSave(overrideStatus?: "draft" | "active") {
    setSaving(true);
    setError(null);
    setSaveSuccess(false);
    try {
      const status = overrideStatus ?? statusVal;
      const result = await updateJobAction(jobId, {
        title: jobTitle,
        description: jobDesc || undefined,
        location: locationVal,
        jobType,
        level: levelVal,
        status,
      });
      if (result.success) {
        if (overrideStatus) {
          setStatusVal(overrideStatus);
        }
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
        router.refresh();
      } else {
        setError(typeof result.error === "string" ? result.error : "เกิดข้อผิดพลาดในการบันทึก");
      }
    } catch {
      setError("เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl pb-24">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-text-primary">แก้ไขประกาศรับสมัครงาน</h1>
        <Button variant="outline" size="md" onClick={() => router.push(`/jobs/${jobId}`)}>ดูตัวอย่าง</Button>
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
                className="w-full rounded-lg border border-border-default bg-bg-primary px-4 py-2.5 text-sm text-text-primary shadow-sm transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-focus-ring"
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
                className="w-full rounded-b-lg border border-border-default bg-bg-primary px-4 py-2.5 text-sm text-text-primary shadow-sm transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-focus-ring"
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
                <label htmlFor="edit-level" className="mb-2 block text-sm font-medium text-text-primary">ระดับ</label>
                <select id="edit-level" value={levelVal} onChange={(e) => setLevelVal(e.target.value)} className="w-full rounded-lg border border-border-default bg-bg-primary px-4 py-2.5 text-sm text-text-primary shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-focus-ring">
                  <option value="junior">Junior</option>
                  <option value="mid">Mid-level</option>
                  <option value="senior">Senior</option>
                  <option value="lead">Lead</option>
                  <option value="manager">Manager</option>
                </select>
              </div>
              <div>
                <label htmlFor="edit-location" className="mb-2 block text-sm font-medium text-text-primary">สถานที่</label>
                <select id="edit-location" value={locationVal} onChange={(e) => setLocationVal(e.target.value)} className="w-full rounded-lg border border-border-default bg-bg-primary px-4 py-2.5 text-sm text-text-primary shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-focus-ring">
                  <option value="bangkok">กรุงเทพมหานคร</option>
                  <option value="remote">Remote</option>
                  <option value="hybrid">Hybrid</option>
                  <option value="chiangmai">เชียงใหม่</option>
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="edit-job-type" className="mb-2 block text-sm font-medium text-text-primary">ประเภทงาน</label>
              <select id="edit-job-type" value={jobType} onChange={(e) => setJobType(e.target.value)} className="w-full rounded-lg border border-border-default bg-bg-primary px-4 py-2.5 text-sm text-text-primary shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-focus-ring sm:w-1/2">
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
              statusVal === "active" ? "bg-success-bg text-success" :
              statusVal === "draft" ? "bg-bg-tertiary text-text-tertiary" :
              statusVal === "paused" ? "bg-warning-bg text-warning" :
              "bg-error-bg text-error"
            }`}>
              {statusVal === "active" ? "เผยแพร่" :
               statusVal === "draft" ? "แบบร่าง" :
               statusVal === "paused" ? "หยุดชั่วคราว" : "ปิดแล้ว"}
            </span>
          </p>
        </section>
      </div>

      {error && <div role="alert" className="mt-4 rounded-lg bg-error-bg p-3 text-sm text-error">{error}</div>}
      {saveSuccess && <p role="status" className="mt-4 text-sm text-success">บันทึกเรียบร้อยแล้ว</p>}

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
