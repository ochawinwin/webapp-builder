"use client";

import { useState } from "react";

const initialSkills = ["React", "TypeScript", "Next.js"];

export default function JobEditPage() {
  const [jobTitle, setJobTitle] = useState("Senior Frontend Developer");
  const [jobDesc, setJobDesc] = useState(
    "เรากำลังมองหา Senior Frontend Developer ที่มีความเชี่ยวชาญใน React, TypeScript และ Next.js เพื่อเข้าร่วมทีมพัฒนาผลิตภัณฑ์ของเรา คุณจะได้ทำงานร่วมกับทีม Product และ Design เพื่อสร้างประสบการณ์ผู้ใช้ที่ยอดเยี่ยม"
  );
  const [skills, setSkills] = useState<string[]>(initialSkills);
  const [skillInput, setSkillInput] = useState("");
  const [industryVal, setIndustryVal] = useState("technology");
  const [positionVal, setPositionVal] = useState("engineering");
  const [levelVal, setLevelVal] = useState("senior");
  const [locationVal, setLocationVal] = useState("bangkok");
  const [jobType, setJobType] = useState("fulltime");
  const [statusVal, setStatusVal] = useState("draft");

  const addSkill = () => {
    const trimmed = skillInput.trim();
    if (trimmed && !skills.includes(trimmed)) {
      setSkills([...skills, trimmed]);
      setSkillInput("");
    }
  };

  const removeSkill = (skill: string) => {
    setSkills(skills.filter((s) => s !== skill));
  };

  return (
    <div className="mx-auto max-w-3xl pb-24">
      {/* Header */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-text-primary">
          สร้างประกาศรับสมัครงาน
        </h1>
        <button
          type="button"
          className="rounded-lg border border-border-default bg-bg-primary px-4 py-2 text-sm font-medium text-text-secondary shadow-sm transition-colors hover:bg-bg-tertiary"
        >
          ดูตัวอย่าง
        </button>
      </div>

      <div className="space-y-6">
        {/* Section 1: Job details */}
        <section
          className="rounded-xl border border-border-default bg-bg-primary p-6 shadow-sm"
          aria-labelledby="job-details-heading"
        >
          <h2
            id="job-details-heading"
            className="mb-4 text-lg font-semibold text-text-primary"
          >
            รายละเอียดงาน
          </h2>
          <div className="space-y-4">
            <div>
              <label
                htmlFor="job-title"
                className="mb-2 block text-sm font-medium text-text-primary"
              >
                ชื่อตำแหน่ง
              </label>
              <input
                id="job-title"
                type="text"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                className="w-full rounded-lg border border-border-default bg-bg-primary px-4 py-2.5 text-sm text-text-primary shadow-sm transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-focus-ring"
              />
            </div>
            <div>
              <label
                htmlFor="job-desc"
                className="mb-2 block text-sm font-medium text-text-primary"
              >
                รายละเอียดงาน
              </label>
              {/* Toolbar placeholder */}
              <div className="flex gap-1 rounded-t-lg border border-b-0 border-border-default bg-bg-tertiary px-2 py-1.5">
                <button
                  type="button"
                  className="rounded px-2 py-1 text-sm font-bold text-text-secondary hover:bg-bg-primary"
                  aria-label="ตัวหนา"
                >
                  B
                </button>
                <button
                  type="button"
                  className="rounded px-2 py-1 text-sm italic text-text-secondary hover:bg-bg-primary"
                  aria-label="ตัวเอียง"
                >
                  I
                </button>
                <button
                  type="button"
                  className="rounded px-2 py-1 text-sm text-text-secondary hover:bg-bg-primary"
                  aria-label="รายการแบบจุด"
                >
                  &bull;
                </button>
                <button
                  type="button"
                  className="rounded px-2 py-1 text-sm text-text-secondary hover:bg-bg-primary"
                  aria-label="รายการแบบตัวเลข"
                >
                  1.
                </button>
                <button
                  type="button"
                  className="rounded px-2 py-1 text-sm text-text-secondary hover:bg-bg-primary"
                  aria-label="ลิงก์"
                >
                  &#128279;
                </button>
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

        {/* Section 2: Tags & categories */}
        <section
          className="rounded-xl border border-border-default bg-bg-primary p-6 shadow-sm"
          aria-labelledby="tags-heading"
        >
          <h2
            id="tags-heading"
            className="mb-4 text-lg font-semibold text-text-primary"
          >
            Tags &amp; หมวดหมู่
          </h2>
          <div className="space-y-4">
            {/* Skills chips */}
            <div>
              <label
                htmlFor="skill-input"
                className="mb-2 block text-sm font-medium text-text-primary"
              >
                ทักษะ
              </label>
              <div className="mb-2 flex flex-wrap gap-2">
                {skills.map((skill) => (
                  <span
                    key={skill}
                    className="inline-flex items-center gap-1 rounded-full bg-primary-light px-3 py-1 text-sm font-medium text-primary"
                  >
                    {skill}
                    <button
                      type="button"
                      onClick={() => removeSkill(skill)}
                      className="ml-1 text-primary hover:text-primary-hover"
                      aria-label={`ลบทักษะ ${skill}`}
                    >
                      &times;
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  id="skill-input"
                  type="text"
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addSkill();
                    }
                  }}
                  placeholder="พิมพ์ทักษะแล้วกด Enter"
                  className="flex-1 rounded-lg border border-border-default bg-bg-primary px-4 py-2.5 text-sm text-text-primary shadow-sm transition-colors placeholder:text-text-tertiary focus:border-primary focus:outline-none focus:ring-2 focus:ring-focus-ring"
                />
                <button
                  type="button"
                  onClick={addSkill}
                  className="rounded-lg border border-border-default bg-bg-primary px-4 py-2.5 text-sm font-medium text-text-secondary shadow-sm transition-colors hover:bg-bg-tertiary"
                >
                  เพิ่ม
                </button>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="edit-industry"
                  className="mb-2 block text-sm font-medium text-text-primary"
                >
                  อุตสาหกรรม
                </label>
                <select
                  id="edit-industry"
                  value={industryVal}
                  onChange={(e) => setIndustryVal(e.target.value)}
                  className="w-full rounded-lg border border-border-default bg-bg-primary px-4 py-2.5 text-sm text-text-primary shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-focus-ring"
                >
                  <option value="technology">Technology</option>
                  <option value="finance">Finance</option>
                  <option value="healthcare">Healthcare</option>
                </select>
              </div>
              <div>
                <label
                  htmlFor="edit-position"
                  className="mb-2 block text-sm font-medium text-text-primary"
                >
                  ตำแหน่ง
                </label>
                <select
                  id="edit-position"
                  value={positionVal}
                  onChange={(e) => setPositionVal(e.target.value)}
                  className="w-full rounded-lg border border-border-default bg-bg-primary px-4 py-2.5 text-sm text-text-primary shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-focus-ring"
                >
                  <option value="engineering">Engineering</option>
                  <option value="design">Design</option>
                  <option value="product">Product</option>
                  <option value="marketing">Marketing</option>
                </select>
              </div>
              <div>
                <label
                  htmlFor="edit-level"
                  className="mb-2 block text-sm font-medium text-text-primary"
                >
                  ระดับ
                </label>
                <select
                  id="edit-level"
                  value={levelVal}
                  onChange={(e) => setLevelVal(e.target.value)}
                  className="w-full rounded-lg border border-border-default bg-bg-primary px-4 py-2.5 text-sm text-text-primary shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-focus-ring"
                >
                  <option value="junior">Junior</option>
                  <option value="mid">Mid-level</option>
                  <option value="senior">Senior</option>
                  <option value="lead">Lead</option>
                  <option value="manager">Manager</option>
                </select>
              </div>
              <div>
                <label
                  htmlFor="edit-location"
                  className="mb-2 block text-sm font-medium text-text-primary"
                >
                  สถานที่
                </label>
                <select
                  id="edit-location"
                  value={locationVal}
                  onChange={(e) => setLocationVal(e.target.value)}
                  className="w-full rounded-lg border border-border-default bg-bg-primary px-4 py-2.5 text-sm text-text-primary shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-focus-ring"
                >
                  <option value="bangkok">กรุงเทพมหานคร</option>
                  <option value="remote">Remote</option>
                  <option value="hybrid">Hybrid</option>
                  <option value="chiangmai">เชียงใหม่</option>
                </select>
              </div>
            </div>

            <div>
              <label
                htmlFor="edit-job-type"
                className="mb-2 block text-sm font-medium text-text-primary"
              >
                ประเภทงาน
              </label>
              <select
                id="edit-job-type"
                value={jobType}
                onChange={(e) => setJobType(e.target.value)}
                className="w-full rounded-lg border border-border-default bg-bg-primary px-4 py-2.5 text-sm text-text-primary shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-focus-ring sm:w-1/2"
              >
                <option value="fulltime">Full-time</option>
                <option value="parttime">Part-time</option>
                <option value="contract">Contract</option>
                <option value="internship">Internship</option>
              </select>
            </div>
          </div>
        </section>

        {/* Section 3: Screening questions */}
        <section
          className="rounded-xl border border-border-default bg-bg-primary p-6 shadow-sm"
          aria-labelledby="screening-heading"
        >
          <h2
            id="screening-heading"
            className="mb-4 text-lg font-semibold text-text-primary"
          >
            คำถามคัดกรอง
          </h2>
          <div className="space-y-4">
            {/* Q1: Open-ended */}
            <div className="rounded-lg border border-border-default bg-bg-secondary p-4">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm font-medium text-text-primary">
                  คำถามที่ 1
                </span>
                <span className="rounded-full bg-bg-tertiary px-2.5 py-0.5 text-xs font-medium text-text-tertiary">
                  ตอบอิสระ
                </span>
              </div>
              <p className="text-sm text-text-secondary">
                ทำไมคุณถึงสนใจตำแหน่งนี้ที่ TechCorp?
              </p>
            </div>

            {/* Q2: Multiple choice */}
            <div className="rounded-lg border border-border-default bg-bg-secondary p-4">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm font-medium text-text-primary">
                  คำถามที่ 2
                </span>
                <span className="rounded-full bg-bg-tertiary px-2.5 py-0.5 text-xs font-medium text-text-tertiary">
                  หลายตัวเลือก
                </span>
              </div>
              <p className="mb-2 text-sm text-text-secondary">
                คุณมีประสบการณ์ React กี่ปี?
              </p>
              <ul className="ml-4 space-y-1 text-sm text-text-secondary">
                <li className="flex items-center gap-2">
                  <span
                    className="h-3 w-3 rounded-full border border-border-strong"
                    aria-hidden="true"
                  />
                  น้อยกว่า 1 ปี
                </li>
                <li className="flex items-center gap-2">
                  <span
                    className="h-3 w-3 rounded-full border border-border-strong"
                    aria-hidden="true"
                  />
                  1-3 ปี
                </li>
                <li className="flex items-center gap-2">
                  <span
                    className="h-3 w-3 rounded-full border border-border-strong"
                    aria-hidden="true"
                  />
                  3-5 ปี
                </li>
                <li className="flex items-center gap-2">
                  <span
                    className="h-3 w-3 rounded-full border border-border-strong"
                    aria-hidden="true"
                  />
                  มากกว่า 5 ปี
                </li>
              </ul>
            </div>

            <button
              type="button"
              className="w-full rounded-lg border-2 border-dashed border-border-strong py-3 text-sm font-medium text-text-secondary transition-colors hover:border-primary hover:text-primary"
            >
              + เพิ่มคำถาม
            </button>
          </div>
        </section>

        {/* Section 4: Status */}
        <section
          className="rounded-xl border border-border-default bg-bg-primary p-6 shadow-sm"
          aria-labelledby="status-heading"
        >
          <h2
            id="status-heading"
            className="mb-4 text-lg font-semibold text-text-primary"
          >
            สถานะ
          </h2>
          <select
            value={statusVal}
            onChange={(e) => setStatusVal(e.target.value)}
            aria-label="สถานะประกาศงาน"
            className="w-full rounded-lg border border-border-default bg-bg-primary px-4 py-2.5 text-sm text-text-primary shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-focus-ring sm:w-1/3"
          >
            <option value="draft">แบบร่าง</option>
            <option value="published">เผยแพร่</option>
            <option value="paused">หยุดชั่วคราว</option>
            <option value="closed">ปิดแล้ว</option>
          </select>
        </section>
      </div>

      {/* Sticky bottom bar */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border-default bg-bg-primary px-6 py-4 shadow-lg md:left-[250px]">
        <div className="mx-auto flex max-w-3xl justify-end gap-3">
          <button
            type="button"
            className="rounded-lg border border-border-default bg-bg-primary px-6 py-2.5 text-sm font-medium text-text-secondary shadow-sm transition-colors hover:bg-bg-tertiary"
          >
            บันทึกเป็นแบบร่าง
          </button>
          <button
            type="button"
            className="rounded-lg bg-primary px-6 py-2.5 text-sm font-medium text-text-inverse shadow-sm transition-colors hover:bg-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
          >
            เผยแพร่
          </button>
        </div>
      </div>
    </div>
  );
}
