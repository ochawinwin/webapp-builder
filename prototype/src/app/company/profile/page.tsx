"use client";

import { useState } from "react";
import Link from "next/link";

export default function CompanyProfilePage() {
  const [companyName, setCompanyName] = useState("TechCorp");
  const [shortDesc, setShortDesc] = useState(
    "บริษัทเทคโนโลยีชั้นนำที่มุ่งเน้นการพัฒนาซอฟต์แวร์คุณภาพสูง"
  );
  const [fullDesc, setFullDesc] = useState(
    "TechCorp เป็นบริษัทเทคโนโลยีที่ก่อตั้งขึ้นในปี 2020 ด้วยวิสัยทัศน์ในการสร้างโซลูชันซอฟต์แวร์ที่เปลี่ยนแปลงวิธีการทำงานของธุรกิจในประเทศไทย เราเชี่ยวชาญด้าน Web Application, Mobile App และ Cloud Infrastructure"
  );
  const [industry, setIndustry] = useState("technology");
  const [companySize, setCompanySize] = useState("51-200");

  const maxShortDesc = 160;

  return (
    <div className="mx-auto max-w-3xl">
      {/* Header */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-text-primary">
          โปรไฟล์บริษัท
        </h1>
        <Link
          href="/companies/1"
          className="text-sm font-medium text-primary hover:text-primary-hover transition-colors"
        >
          ดูโปรไฟล์สาธารณะ &rarr;
        </Link>
      </div>

      {/* Main card */}
      <section
        className="rounded-xl border border-border-default bg-bg-primary p-6 shadow-sm"
        aria-label="ข้อมูลบริษัท"
      >
        <div className="space-y-6">
          {/* Logo upload */}
          <div>
            <label className="mb-2 block text-sm font-medium text-text-primary">
              โลโก้บริษัท
            </label>
            <div className="flex items-center gap-4">
              <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-xl border-2 border-dashed border-border-strong bg-bg-tertiary text-text-tertiary">
                <svg
                  className="h-8 w-8"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0 0 22.5 18.75V5.25A2.25 2.25 0 0 0 20.25 3H3.75A2.25 2.25 0 0 0 1.5 5.25v13.5A2.25 2.25 0 0 0 3.75 21Z"
                  />
                </svg>
              </div>
              <div>
                <button
                  type="button"
                  className="rounded-lg border border-border-default bg-bg-primary px-4 py-2 text-sm font-medium text-text-primary shadow-sm transition-colors hover:bg-bg-tertiary"
                >
                  อัปโหลดโลโก้
                </button>
                <p className="mt-1 text-xs text-text-tertiary">
                  PNG, JPG สูงสุด 2MB (แนะนำ 400x400px)
                </p>
              </div>
            </div>
          </div>

          {/* Cover image upload */}
          <div>
            <label className="mb-2 block text-sm font-medium text-text-primary">
              ภาพปก
            </label>
            <div className="flex h-40 w-full items-center justify-center rounded-xl border-2 border-dashed border-border-strong bg-bg-tertiary text-text-tertiary">
              <div className="text-center">
                <svg
                  className="mx-auto h-8 w-8"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0 0 22.5 18.75V5.25A2.25 2.25 0 0 0 20.25 3H3.75A2.25 2.25 0 0 0 1.5 5.25v13.5A2.25 2.25 0 0 0 3.75 21Z"
                  />
                </svg>
                <p className="mt-2 text-sm">คลิกเพื่ออัปโหลดภาพปก</p>
                <p className="text-xs">แนะนำ 1200x400px</p>
              </div>
            </div>
          </div>

          {/* Company name */}
          <div>
            <label
              htmlFor="company-name"
              className="mb-2 block text-sm font-medium text-text-primary"
            >
              ชื่อบริษัท
            </label>
            <input
              id="company-name"
              type="text"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              className="w-full rounded-lg border border-border-default bg-bg-primary px-4 py-2.5 text-sm text-text-primary shadow-sm transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-focus-ring"
            />
          </div>

          {/* Short description */}
          <div>
            <label
              htmlFor="short-desc"
              className="mb-2 block text-sm font-medium text-text-primary"
            >
              คำอธิบายสั้น
            </label>
            <textarea
              id="short-desc"
              rows={3}
              maxLength={maxShortDesc}
              value={shortDesc}
              onChange={(e) => setShortDesc(e.target.value)}
              className="w-full rounded-lg border border-border-default bg-bg-primary px-4 py-2.5 text-sm text-text-primary shadow-sm transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-focus-ring"
            />
            <p className="mt-1 text-right text-xs text-text-tertiary">
              {shortDesc.length}/{maxShortDesc}
            </p>
          </div>

          {/* Full description */}
          <div>
            <label
              htmlFor="full-desc"
              className="mb-2 block text-sm font-medium text-text-primary"
            >
              คำอธิบายเต็ม
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
              id="full-desc"
              rows={6}
              value={fullDesc}
              onChange={(e) => setFullDesc(e.target.value)}
              className="w-full rounded-b-lg border border-border-default bg-bg-primary px-4 py-2.5 text-sm text-text-primary shadow-sm transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-focus-ring"
            />
          </div>

          {/* Industry */}
          <div>
            <label
              htmlFor="industry"
              className="mb-2 block text-sm font-medium text-text-primary"
            >
              อุตสาหกรรม
            </label>
            <select
              id="industry"
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
              className="w-full rounded-lg border border-border-default bg-bg-primary px-4 py-2.5 text-sm text-text-primary shadow-sm transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-focus-ring"
            >
              <option value="technology">Technology</option>
              <option value="finance">Finance</option>
              <option value="healthcare">Healthcare</option>
              <option value="education">Education</option>
              <option value="ecommerce">E-Commerce</option>
            </select>
          </div>

          {/* Company size */}
          <div>
            <label
              htmlFor="company-size"
              className="mb-2 block text-sm font-medium text-text-primary"
            >
              ขนาดบริษัท
            </label>
            <select
              id="company-size"
              value={companySize}
              onChange={(e) => setCompanySize(e.target.value)}
              className="w-full rounded-lg border border-border-default bg-bg-primary px-4 py-2.5 text-sm text-text-primary shadow-sm transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-focus-ring"
            >
              <option value="1-10">1-10 คน</option>
              <option value="11-50">11-50 คน</option>
              <option value="51-200">51-200 คน</option>
              <option value="201-500">201-500 คน</option>
              <option value="501+">501+ คน</option>
            </select>
          </div>

          {/* Save button */}
          <div className="flex justify-end pt-2">
            <button
              type="button"
              className="rounded-lg bg-primary px-6 py-2.5 text-sm font-medium text-text-inverse shadow-sm transition-colors hover:bg-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
            >
              บันทึกการเปลี่ยนแปลง
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
