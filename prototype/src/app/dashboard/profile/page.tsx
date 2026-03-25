"use client";

import React, { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { Tag } from "@/components/ui/Tag";

export default function ProfilePage() {
  const [skills, setSkills] = useState(["React", "TypeScript", "Node.js"]);
  const [industries, setIndustries] = useState(["Technology", "Fintech"]);
  const [skillInput, setSkillInput] = useState("");
  const [industryInput, setIndustryInput] = useState("");

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

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      {/* Page heading */}
      <h1 className="text-2xl font-bold text-text-primary">ตั้งค่าโปรไฟล์</h1>

      {/* Avatar section */}
      <Card>
        <div className="flex items-center gap-6">
          <div
            className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-primary-light text-2xl font-bold text-primary"
            aria-label="รูปโปรไฟล์"
          >
            ส
          </div>
          <div className="space-y-2">
            <p className="text-sm font-medium text-text-primary">รูปโปรไฟล์</p>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm">
                อัปโหลดรูป
              </Button>
              <button
                type="button"
                className="text-sm text-text-secondary hover:text-text-primary transition-colors"
              >
                เปลี่ยน
              </button>
              <span className="text-text-tertiary">·</span>
              <button
                type="button"
                className="text-sm text-error hover:text-red-600 transition-colors"
              >
                ลบ
              </button>
            </div>
          </div>
        </div>
      </Card>

      {/* Personal info form */}
      <Card>
        <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
          <Input
            label="ชื่อ-นามสกุล"
            defaultValue="สมชาย ใจดี"
          />

          <Textarea
            label="แนะนำตัว"
            defaultValue="Full Stack Developer ที่มีประสบการณ์กว่า 5 ปี ชอบสร้างเว็บแอปพลิเคชันที่ใช้งานง่ายและมีประสิทธิภาพ มีความเชี่ยวชาญด้าน React, TypeScript และ Node.js"
            rows={4}
          />

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <Input
              label="อีเมล"
              variant="email"
              defaultValue="somchai@example.com"
            />
            <Input
              label="เบอร์โทร"
              defaultValue="081-234-5678"
            />
          </div>
        </form>
      </Card>

      {/* Preferences section */}
      <Card>
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-semibold text-text-primary">
              ความชอบของคุณ
            </h2>
            <p className="mt-1 text-sm text-text-secondary">
              ข้อมูลนี้ช่วยจับคู่งานที่เหมาะกับคุณ
            </p>
          </div>

          {/* Skills tags */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-text-primary">
              ทักษะ
            </label>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill) => (
                <Tag
                  key={skill}
                  category="skill"
                  onRemove={() => setSkills(skills.filter((s) => s !== skill))}
                >
                  {skill}
                </Tag>
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

          {/* Industry tags */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-text-primary">
              อุตสาหกรรมที่สนใจ
            </label>
            <div className="flex flex-wrap gap-2">
              {industries.map((industry) => (
                <Tag
                  key={industry}
                  category="industry"
                  onRemove={() =>
                    setIndustries(industries.filter((i) => i !== industry))
                  }
                >
                  {industry}
                </Tag>
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

          {/* Dropdowns row */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            <Select label="ระดับ" defaultValue="senior">
              <option value="junior">Junior</option>
              <option value="mid">Mid-level</option>
              <option value="senior">Senior</option>
              <option value="lead">Lead</option>
              <option value="manager">Manager</option>
            </Select>

            <Select label="สถานที่" defaultValue="bangkok">
              <option value="bangkok">กรุงเทพฯ</option>
              <option value="chiangmai">เชียงใหม่</option>
              <option value="phuket">ภูเก็ต</option>
              <option value="remote">Remote</option>
            </Select>

            <Select label="ประเภทงาน" defaultValue="fulltime">
              <option value="fulltime">Full-time</option>
              <option value="parttime">Part-time</option>
              <option value="contract">Contract</option>
              <option value="freelance">Freelance</option>
            </Select>
          </div>
        </div>
      </Card>

      {/* Save button */}
      <div className="flex justify-end">
        <Button variant="primary" size="lg">
          บันทึกการเปลี่ยนแปลง
        </Button>
      </div>

      {/* Danger zone */}
      <hr className="border-border-default" />

      <Card className="border-error/30">
        <div className="space-y-4">
          <div>
            <h2 className="text-lg font-semibold text-error">โซนอันตราย</h2>
            <p className="mt-1 text-sm text-text-secondary">
              การลบบัญชีจะลบข้อมูลทั้งหมดของคุณอย่างถาวร รวมถึงโปรไฟล์ เรซูเม่
              และประวัติการสมัครงาน
            </p>
          </div>
          <Button variant="danger" size="md">
            ลบบัญชี
          </Button>
        </div>
      </Card>
    </div>
  );
}
