"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { Button } from "@futurecareer/ui";
import { updateCompanyAction } from "@/app/actions/companyActions";

interface CompanyProfileFormProps {
  companyId: string;
  initialData: {
    name: string;
    shortBio: string;
    fullBio: string;
    industry: string;
    size: string;
    logoUrl: string | null;
    coverUrl: string | null;
  };
}

export function CompanyProfileForm({ companyId, initialData }: CompanyProfileFormProps) {
  const [companyName, setCompanyName] = useState(initialData.name);
  const [shortDesc, setShortDesc] = useState(initialData.shortBio);
  const [fullDesc, setFullDesc] = useState(initialData.fullBio);
  const [industry, setIndustry] = useState(initialData.industry);
  const [companySize, setCompanySize] = useState(initialData.size);

  const [logoUrl, setLogoUrl] = useState<string | null>(initialData.logoUrl);
  const [coverUrl, setCoverUrl] = useState<string | null>(initialData.coverUrl);
  const [logoUploading, setLogoUploading] = useState(false);
  const [coverUploading, setCoverUploading] = useState(false);
  const [logoError, setLogoError] = useState<string | null>(null);
  const [coverError, setCoverError] = useState<string | null>(null);

  const logoInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const maxShortDesc = 160;

  async function handleSave() {
    setSaving(true);
    setSaveError(null);
    setSaveSuccess(false);
    try {
      const result = await updateCompanyAction(companyId, {
        name: companyName,
        shortBio: shortDesc,
        fullBio: fullDesc,
        industry,
        size: companySize,
      });
      if (!result.success) {
        setSaveError(typeof result.error === "string" ? result.error : "เกิดข้อผิดพลาดในการบันทึก");
      } else {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      }
    } catch {
      setSaveError("เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง");
    } finally {
      setSaving(false);
    }
  }

  async function handleLogoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = "";

    const allowed = ["image/png", "image/jpeg"];
    if (!allowed.includes(file.type)) {
      setLogoError("รองรับเฉพาะ PNG หรือ JPG เท่านั้น");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setLogoError("ขนาดไฟล์ต้องไม่เกิน 2MB");
      return;
    }

    setLogoError(null);
    setLogoUploading(true);

    const previewUrl = URL.createObjectURL(file);
    setLogoUrl(previewUrl);

    try {
      const { createBrowserClient } = await import("@/lib/supabase/browser");
      const supabase = createBrowserClient();
      const path = `logos/${companyId}_${Date.now()}.${file.name.split(".").pop()}`;
      const { error: uploadError } = await supabase.storage.from("company-assets").upload(path, file, { upsert: true });

      if (uploadError) {
        setLogoError("ไม่สามารถอัปโหลดโลโก้ได้ กรุณาลองใหม่อีกครั้ง");
        setLogoUrl(null);
        return;
      }

      const { data: urlData } = supabase.storage.from("company-assets").getPublicUrl(path);
      const publicUrl = urlData.publicUrl;
      setLogoUrl(publicUrl);

      const result = await updateCompanyAction(companyId, { logoUrl: publicUrl });
      if (!result.success) {
        setLogoError(typeof result.error === "string" ? result.error : "เกิดข้อผิดพลาดในการบันทึก");
      }
    } catch {
      setLogoError("เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง");
    } finally {
      setLogoUploading(false);
    }
  }

  async function handleCoverChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = "";

    const allowed = ["image/png", "image/jpeg", "image/webp"];
    if (!allowed.includes(file.type)) {
      setCoverError("รองรับเฉพาะ PNG, JPG หรือ WebP เท่านั้น");
      return;
    }

    setCoverError(null);
    setCoverUploading(true);

    const previewUrl = URL.createObjectURL(file);
    setCoverUrl(previewUrl);

    try {
      const { createBrowserClient } = await import("@/lib/supabase/browser");
      const supabase = createBrowserClient();
      const path = `covers/${companyId}_${Date.now()}.${file.name.split(".").pop()}`;
      const { error: uploadError } = await supabase.storage.from("company-assets").upload(path, file, { upsert: true });

      if (uploadError) {
        setCoverError("ไม่สามารถอัปโหลดภาพปกได้ กรุณาลองใหม่อีกครั้ง");
        setCoverUrl(null);
        return;
      }

      const { data: urlData } = supabase.storage.from("company-assets").getPublicUrl(path);
      const publicUrl = urlData.publicUrl;
      setCoverUrl(publicUrl);

      const result = await updateCompanyAction(companyId, { coverUrl: publicUrl });
      if (!result.success) {
        setCoverError(typeof result.error === "string" ? result.error : "เกิดข้อผิดพลาดในการบันทึก");
      }
    } catch {
      setCoverError("เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง");
    } finally {
      setCoverUploading(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-text-primary">โปรไฟล์บริษัท</h1>
        <Link href={`/companies/${companyId}`} className="text-sm font-medium text-primary hover:text-primary-hover transition-colors">
          ดูโปรไฟล์สาธารณะ &rarr;
        </Link>
      </div>

      <input
        ref={logoInputRef}
        type="file"
        accept="image/png,image/jpeg"
        className="sr-only"
        aria-hidden="true"
        tabIndex={-1}
        onChange={handleLogoChange}
      />
      <input
        ref={coverInputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp"
        className="sr-only"
        aria-hidden="true"
        tabIndex={-1}
        onChange={handleCoverChange}
      />

      <section className="rounded-xl border border-border-default bg-bg-primary p-6 shadow-sm" aria-label="ข้อมูลบริษัท">
        <div className="space-y-6">
          <div>
            <label className="mb-2 block text-sm font-medium text-text-primary">โลโก้บริษัท</label>
            <div className="flex items-center gap-4">
              <button
                type="button"
                aria-label="อัปโหลดโลโก้บริษัท"
                onClick={() => logoInputRef.current?.click()}
                disabled={logoUploading}
                className="relative flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-xl border-2 border-dashed border-border-strong bg-bg-tertiary text-text-tertiary transition-colors hover:border-primary focus:outline-none"
              >
                {logoUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={logoUrl} alt="โลโก้บริษัท" className="h-full w-full object-cover" />
                ) : (
                  <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0 0 22.5 18.75V5.25A2.25 2.25 0 0 0 20.25 3H3.75A2.25 2.25 0 0 0 1.5 5.25v13.5A2.25 2.25 0 0 0 3.75 21Z" />
                  </svg>
                )}
                {logoUploading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                    <svg className="h-6 w-6 animate-spin text-white" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                  </div>
                )}
              </button>
              <div>
                <button
                  type="button"
                  onClick={() => logoInputRef.current?.click()}
                  disabled={logoUploading}
                  className="rounded-lg border border-border-default bg-bg-primary px-4 py-2 text-sm font-medium text-text-primary shadow-sm transition-colors hover:bg-bg-tertiary disabled:opacity-50"
                >
                  อัปโหลดโลโก้
                </button>
                <p className="mt-1 text-xs text-text-tertiary">PNG, JPG สูงสุด 2MB (แนะนำ 400x400px)</p>
                {logoError && <p role="alert" className="mt-1 text-xs text-error">{logoError}</p>}
              </div>
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-text-primary">ภาพปก</label>
            <button
              type="button"
              aria-label="อัปโหลดภาพปก"
              onClick={() => coverInputRef.current?.click()}
              disabled={coverUploading}
              className="relative flex h-40 w-full items-center justify-center overflow-hidden rounded-xl border-2 border-dashed border-border-strong bg-bg-tertiary text-text-tertiary transition-colors hover:border-primary focus:outline-none"
            >
              {coverUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={coverUrl} alt="ภาพปกบริษัท" className="h-full w-full object-cover" />
              ) : (
                <div className="text-center">
                  <svg className="mx-auto h-8 w-8" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0 0 22.5 18.75V5.25A2.25 2.25 0 0 0 20.25 3H3.75A2.25 2.25 0 0 0 1.5 5.25v13.5A2.25 2.25 0 0 0 3.75 21Z" />
                  </svg>
                  <p className="mt-2 text-sm">คลิกเพื่ออัปโหลดภาพปก</p>
                  <p className="text-xs">แนะนำ 1200x400px</p>
                </div>
              )}
              {coverUploading && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                  <svg className="h-8 w-8 animate-spin text-white" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                </div>
              )}
            </button>
            {coverError && <p role="alert" className="mt-1 text-xs text-error">{coverError}</p>}
          </div>

          <div>
            <label htmlFor="company-name" className="mb-2 block text-sm font-medium text-text-primary">ชื่อบริษัท</label>
            <input
              id="company-name"
              type="text"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              className="w-full rounded-lg border border-border-default bg-bg-primary px-4 py-2.5 text-sm text-text-primary shadow-sm transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-focus-ring"
            />
          </div>

          <div>
            <label htmlFor="short-desc" className="mb-2 block text-sm font-medium text-text-primary">คำอธิบายสั้น</label>
            <textarea
              id="short-desc"
              rows={3}
              maxLength={maxShortDesc}
              value={shortDesc}
              onChange={(e) => setShortDesc(e.target.value)}
              className="w-full rounded-lg border border-border-default bg-bg-primary px-4 py-2.5 text-sm text-text-primary shadow-sm transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-focus-ring"
            />
            <p className="mt-1 text-right text-xs text-text-tertiary">{shortDesc.length}/{maxShortDesc}</p>
          </div>

          <div>
            <label htmlFor="full-desc" className="mb-2 block text-sm font-medium text-text-primary">คำอธิบายเต็ม</label>
            <div className="flex gap-1 rounded-t-lg border border-b-0 border-border-default bg-bg-tertiary px-2 py-1.5">
              {["B", "I", "•", "1."].map((btn) => (
                <button key={btn} type="button" className="rounded px-2 py-1 text-sm text-text-secondary hover:bg-bg-primary">{btn}</button>
              ))}
            </div>
            <textarea
              id="full-desc"
              rows={6}
              value={fullDesc}
              onChange={(e) => setFullDesc(e.target.value)}
              className="w-full rounded-b-lg border border-border-default bg-bg-primary px-4 py-2.5 text-sm text-text-primary shadow-sm transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-focus-ring"
            />
          </div>

          <div>
            <label htmlFor="industry" className="mb-2 block text-sm font-medium text-text-primary">อุตสาหกรรม</label>
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

          <div>
            <label htmlFor="company-size" className="mb-2 block text-sm font-medium text-text-primary">ขนาดบริษัท</label>
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

          {saveError && <p role="alert" className="text-sm text-error">{saveError}</p>}
          {saveSuccess && <p role="status" className="text-sm text-success">บันทึกเรียบร้อยแล้ว</p>}
          <div className="flex justify-end pt-2">
            <Button variant="primary" size="md" onClick={handleSave} disabled={saving}>
              {saving ? "กำลังบันทึก..." : "บันทึกการเปลี่ยนแปลง"}
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
