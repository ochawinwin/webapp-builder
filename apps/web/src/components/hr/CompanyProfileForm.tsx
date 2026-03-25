"use client";

import { useState, useTransition } from "react";
import { Button, Card, Input } from "@futurecareer/ui";
import {
  updateCompanyAction,
  uploadCompanyLogoAction,
} from "@/app/actions/company.actions";
import {
  Building2,
  Globe,
  MapPin,
  Mail,
  Phone,
  CheckCircle2,
  AlertCircle,
  Edit2,
  Link as LinkIcon,
} from "lucide-react";
import { toast } from "sonner";
import type { Company } from "@futurecareer/types";

interface CompanyProfileFormProps {
  company: Company;
  isAdmin: boolean;
}

export function CompanyProfileForm({ company, isAdmin }: CompanyProfileFormProps) {
  const [isPending, startTransition] = useTransition();
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  const [logoUrl, setLogoUrl] = useState(company.logo_url);
  const [error, setError] = useState<string | null>(null);

  const handleSave = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      const result = await updateCompanyAction(formData);
      if (result.success) {
        toast.success("บันทึกข้อมูลบริษัทเรียบร้อยแล้ว!");
      } else {
        setError(result.error ?? "เกิดข้อผิดพลาด กรุณาลองใหม่");
        toast.error(result.error ?? "เกิดข้อผิดพลาด กรุณาลองใหม่");
      }
    });
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingLogo(true);
    const formData = new FormData();
    formData.append("logo", file);

    const result = await uploadCompanyLogoAction(formData);
    setIsUploadingLogo(false);

    if (result.success && result.data) {
      setLogoUrl(result.data.logoUrl);
      toast.success("อัปโหลดโลโก้เรียบร้อยแล้ว!");
    } else {
      toast.error(result.error ?? "เกิดข้อผิดพลาดในการอัปโหลดโลโก้");
    }
  };

  return (
    <div className="min-h-screen bg-muted/30 pb-20 pt-10">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <div>
            <h1 className="text-3xl font-bold font-kanit mb-2">ตั้งค่าโปรไฟล์บริษัท</h1>
            <p className="text-muted-foreground font-sarabun">
              ข้อมูลเหล่านี้จะถูกแสดงในหน้า Profile สาธารณะเพื่อดึงดูดผู้สมัคร
            </p>
          </div>
          {isAdmin && (
            <Button
              className="gap-2 font-bold font-kanit px-8 h-12 shadow-lg shadow-primary/20"
              form="company-profile-form"
              type="submit"
              disabled={isPending}
            >
              <CheckCircle2 className="w-5 h-5" />
              {isPending ? "กำลังบันทึก..." : "บันทึกการเปลี่ยนแปลง"}
            </Button>
          )}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column: Logo & Social */}
          <div className="space-y-6">
            <Card className="p-0 border-none shadow-sm overflow-hidden">
              {/* Banner placeholder */}
              <div className="h-32 bg-gradient-to-br from-primary/20 to-primary/5 relative">
                <div className="absolute inset-0 flex items-center justify-center text-primary/30">
                  <Building2 className="w-16 h-16" />
                </div>
              </div>
              <div className="px-6 pb-6 text-center -mt-10 relative z-10">
                <div className="inline-block relative">
                  <div className="w-24 h-24 rounded-2xl border-4 border-white bg-white shadow-xl overflow-hidden flex items-center justify-center">
                    {logoUrl ? (
                      <img src={logoUrl} alt="Logo" className="w-full h-full object-cover" />
                    ) : (
                      <Building2 className="w-10 h-10 text-muted-foreground" />
                    )}
                  </div>
                  {isAdmin && (
                    <label className="absolute -bottom-1 -right-1 bg-primary text-white p-1.5 rounded-full shadow-lg hover:scale-110 transition-transform cursor-pointer">
                      <Edit2 className="w-3 h-3" />
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp,image/svg+xml"
                        className="hidden"
                        onChange={handleLogoUpload}
                        disabled={isUploadingLogo}
                      />
                    </label>
                  )}
                </div>
                {isUploadingLogo && (
                  <p className="text-xs text-muted-foreground mt-2">กำลังอัปโหลด...</p>
                )}
                <h3 className="text-xl font-bold font-kanit mt-4">{company.name}</h3>
                <p className="text-sm text-muted-foreground font-sarabun">{company.industry ?? "—"}</p>
              </div>
            </Card>

            <Card className="p-6 border-none shadow-sm">
              <h4 className="font-bold font-kanit mb-4 flex items-center gap-2">
                <LinkIcon className="w-4 h-4 text-primary" /> ข้อมูลติดต่อ
              </h4>
              <div className="space-y-3 text-sm font-sarabun">
                <div className="flex items-center gap-2 text-slate-600">
                  <Globe className="w-4 h-4 text-primary shrink-0" />
                  <span>{company.industry ?? "ไม่ระบุอุตสาหกรรม"}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-600">
                  <Building2 className="w-4 h-4 text-primary shrink-0" />
                  <span>{company.size ?? "ไม่ระบุขนาดองค์กร"}</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  สร้างบัญชีเมื่อ {new Date(company.created_at).toLocaleDateString("th-TH", { year: "numeric", month: "long" })}
                </p>
              </div>
            </Card>
          </div>

          {/* Right Column: Form */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="p-8 border-none shadow-sm font-sarabun">
              <form id="company-profile-form" onSubmit={handleSave}>
                <div className="grid md:grid-cols-2 gap-8 mb-10">
                  <div className="space-y-6">
                    <h4 className="font-bold font-kanit text-lg border-b border-border pb-2">
                      ข้อมูลเบื้องต้น
                    </h4>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-sm font-bold">ชื่อบริษัท *</label>
                        <Input
                          name="name"
                          defaultValue={company.name}
                          required
                          disabled={!isAdmin}
                          className="h-11"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-bold">อุตสาหกรรม</label>
                        <select
                          name="industry"
                          defaultValue={company.industry ?? ""}
                          disabled={!isAdmin}
                          className="w-full h-11 px-3 rounded-xl border border-border bg-muted/30 focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm disabled:opacity-60"
                        >
                          <option value="">เลือกอุตสาหกรรม</option>
                          <option value="Software & Technology">Software & Technology</option>
                          <option value="Finance & Banking">Finance & Banking</option>
                          <option value="Education">Education</option>
                          <option value="Healthcare">Healthcare</option>
                          <option value="E-commerce">E-commerce</option>
                          <option value="Manufacturing">Manufacturing</option>
                          <option value="Consulting">Consulting</option>
                          <option value="Media & Entertainment">Media & Entertainment</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-bold">ขนาดองค์กร</label>
                        <select
                          name="size"
                          defaultValue={company.size ?? ""}
                          disabled={!isAdmin}
                          className="w-full h-11 px-3 rounded-xl border border-border bg-muted/30 focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm disabled:opacity-60"
                        >
                          <option value="">เลือกขนาด</option>
                          <option value="1-10">1-10 คน</option>
                          <option value="11-50">11-50 คน</option>
                          <option value="51-200">51-200 คน</option>
                          <option value="201-500">201-500 คน</option>
                          <option value="501-1000">501-1,000 คน</option>
                          <option value="1000+">1,000+ คน</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <h4 className="font-bold font-kanit text-lg border-b border-border pb-2">
                      ช่องทางติดต่อ (แสดงบน Profile)
                    </h4>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-sm font-bold flex items-center gap-2">
                          <Globe className="w-4 h-4 text-primary" /> เว็บไซต์
                        </label>
                        <Input name="website" defaultValue={company.website ?? ""} placeholder="www.company.com" disabled={!isAdmin} className="h-11" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-bold flex items-center gap-2">
                          <Mail className="w-4 h-4 text-primary" /> อีเมลติดต่อ
                        </label>
                        <Input
                          name="contact_email"
                          type="email"
                          defaultValue={company.contact_email ?? ""}
                          placeholder="hr@company.com"
                          disabled={!isAdmin}
                          className="h-11"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-bold flex items-center gap-2">
                          <Phone className="w-4 h-4 text-primary" /> เบอร์โทรศัพท์
                        </label>
                        <Input name="contact_phone" defaultValue={company.contact_phone ?? ""} placeholder="02-xxx-xxxx" disabled={!isAdmin} className="h-11" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-bold flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-primary" /> สำนักงานใหญ่
                        </label>
                        <Input name="location" defaultValue={company.location ?? ""} placeholder="กรุงเทพฯ" disabled={!isAdmin} className="h-11" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Company bio */}
                <div className="space-y-6">
                  <h4 className="font-bold font-kanit text-lg border-b border-border pb-2">
                    คำอธิบายบริษัท
                  </h4>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-bold">คำอธิบายสั้นๆ (Short Bio)</label>
                      <textarea
                        name="short_bio"
                        defaultValue={company.short_bio ?? ""}
                        disabled={!isAdmin}
                        className="w-full min-h-[80px] p-4 rounded-xl border border-border bg-muted/10 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-sm leading-relaxed disabled:opacity-60"
                        placeholder="ระบุสโลแกนหรือคำบรรยายสั้นๆ ที่น่าสนใจ..."
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold">รายละเอียดบริษัทฉบับเต็ม (Full Bio)</label>
                      <textarea
                        name="full_bio"
                        defaultValue={company.full_bio ?? ""}
                        disabled={!isAdmin}
                        className="w-full min-h-[150px] p-4 rounded-xl border border-border bg-muted/10 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-sm leading-relaxed disabled:opacity-60"
                        placeholder="บรรยายความเป็นมา วัฒนธรรมองค์กร และวิสัยทัศน์ของคุณ..."
                      />
                    </div>
                  </div>
                </div>

                {error && (
                  <p className="mt-6 text-sm text-destructive bg-destructive/5 p-3 rounded-xl">{error}</p>
                )}

                {/* Info banner */}
                <div className="mt-8 p-6 bg-primary/5 rounded-2xl border border-primary/20 flex items-start gap-4">
                  <AlertCircle className="w-6 h-6 text-primary shrink-0 mt-1" />
                  <div>
                    <h4 className="font-bold text-primary mb-1">ข้อมูลบริษัทเป็นสาธารณะ</h4>
                    <p className="text-sm text-primary/80 leading-relaxed">
                      โปรตรวจสอบข้อมูลให้ถูกต้องก่อนบันทึก เนื่องจากการมีโปรไฟล์ที่สมบูรณ์และเป็นมืออาชีพ
                      จะช่วยเพิ่มโอกาสให้ผู้สมัครที่มีคุณภาพสนใจร่วมงานกับคุณมากขึ้น
                    </p>
                  </div>
                </div>

                {!isAdmin && (
                  <div className="mt-6 p-4 bg-muted/50 rounded-xl text-sm text-muted-foreground font-sarabun text-center">
                    เฉพาะ Admin เท่านั้นที่สามารถแก้ไขข้อมูลบริษัทได้
                  </div>
                )}
              </form>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
