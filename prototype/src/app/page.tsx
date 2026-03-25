"use client";

import { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

const features = [
  {
    icon: (
      <svg className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z" />
      </svg>
    ),
    title: "Smart Match",
    description: "จับคู่งานจาก Tag อัจฉริยะ วิเคราะห์ทักษะและประสบการณ์เพื่อแนะนำตำแหน่งที่เหมาะสมที่สุด",
  },
  {
    icon: (
      <svg className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
      </svg>
    ),
    title: "ระบบ ATS ในตัว",
    description: "จัดการผู้สมัครด้วย Kanban + List View ติดตามสถานะทุกขั้นตอนได้อย่างง่ายดาย",
  },
  {
    icon: (
      <svg className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15a2.25 2.25 0 012.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
      </svg>
    ),
    title: "Pre-Screen Questions",
    description: "ตั้งคำถามคัดกรองได้เอง ช่วยคัดเลือกผู้สมัครที่ตรงความต้องการตั้งแต่ขั้นตอนแรก",
  },
];

const seekerSteps = [
  { number: "1", title: "สร้าง Profile", description: "กรอกข้อมูลทักษะ ประสบการณ์ และความสนใจของคุณ" },
  { number: "2", title: "ค้นหา & จับคู่", description: "ระบบจะแนะนำงานที่ตรงกับ Profile ของคุณ" },
  { number: "3", title: "สมัครงาน", description: "สมัครงานได้ทันทีพร้อมติดตามสถานะ" },
];

const companySteps = [
  { number: "1", title: "ลงทะเบียนบริษัท", description: "สร้างโปรไฟล์บริษัทพร้อมข้อมูลสำคัญ" },
  { number: "2", title: "สร้างประกาศงาน", description: "ระบุตำแหน่ง ทักษะ และคุณสมบัติที่ต้องการ" },
  { number: "3", title: "จัดการผู้สมัคร", description: "คัดกรองและจัดการผู้สมัครผ่านระบบ ATS" },
];

const testimonials = [
  {
    quote: "ระบบ Smart Match ช่วยให้ผมเจองานที่ตรงกับทักษะมากๆ ไม่ต้องเสียเวลาเลื่อนดูงานที่ไม่เกี่ยวข้องเลย สมัครไป 3 ที่ ได้สัมภาษณ์ทั้ง 3 ที่",
    name: "ธนกร วัฒนาพร",
    role: "Full Stack Developer",
  },
  {
    quote: "เมื่อก่อนใช้เวลาคัดกรอง Resume นานมาก ตอนนี้ระบบ Pre-Screen ช่วยกรองให้ก่อน ประหยัดเวลาไปได้เยอะ และได้คนที่ตรง Spec จริงๆ",
    name: "สุภาพร ศรีสุข",
    role: "HR Manager, TechCorp",
  },
];

function HowItWorks() {
  const [activeTab, setActiveTab] = useState<"seeker" | "company">("seeker");
  const steps = activeTab === "seeker" ? seekerSteps : companySteps;

  return (
    <section className="py-16 sm:py-24 bg-bg-secondary" aria-labelledby="how-it-works-heading">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 id="how-it-works-heading" className="text-3xl font-bold text-center text-text-primary">
          วิธีการใช้งาน
        </h2>
        <p className="mt-4 text-center text-text-secondary max-w-2xl mx-auto">
          เริ่มต้นใช้งานง่ายๆ เพียงไม่กี่ขั้นตอน
        </p>

        {/* Tab Toggle */}
        <div className="mt-10 flex justify-center" role="tablist" aria-label="ประเภทผู้ใช้งาน">
          <div className="inline-flex rounded-lg bg-bg-tertiary p-1">
            <button
              role="tab"
              aria-selected={activeTab === "seeker"}
              aria-controls="panel-seeker"
              id="tab-seeker"
              className={`rounded-md px-5 py-2.5 text-sm font-medium transition-colors ${
                activeTab === "seeker"
                  ? "bg-bg-primary text-primary shadow-sm"
                  : "text-text-secondary hover:text-text-primary"
              }`}
              onClick={() => setActiveTab("seeker")}
            >
              สำหรับผู้หางาน
            </button>
            <button
              role="tab"
              aria-selected={activeTab === "company"}
              aria-controls="panel-company"
              id="tab-company"
              className={`rounded-md px-5 py-2.5 text-sm font-medium transition-colors ${
                activeTab === "company"
                  ? "bg-bg-primary text-primary shadow-sm"
                  : "text-text-secondary hover:text-text-primary"
              }`}
              onClick={() => setActiveTab("company")}
            >
              สำหรับบริษัท
            </button>
          </div>
        </div>

        {/* Steps */}
        <div
          id={`panel-${activeTab}`}
          role="tabpanel"
          aria-labelledby={`tab-${activeTab}`}
          className="mt-12 grid gap-8 sm:grid-cols-3"
        >
          {steps.map((step, index) => (
            <div key={step.title} className="flex flex-col items-center text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-white text-xl font-bold">
                {step.number}
              </div>
              {index < steps.length - 1 && (
                <div className="hidden sm:block w-full h-0.5 bg-border-default mt-7 -mb-7" aria-hidden="true" />
              )}
              <h3 className="mt-6 text-lg font-semibold text-text-primary">{step.title}</h3>
              <p className="mt-2 text-sm text-text-secondary max-w-xs">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-full">
      <Navbar />

      <main id="main-content" className="flex-1">
        {/* Hero Section */}
        <section className="bg-primary-subtle py-20 sm:py-28" aria-labelledby="hero-heading">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
            <h1
              id="hero-heading"
              className="text-4xl font-bold tracking-tight text-text-primary sm:text-5xl lg:text-6xl"
            >
              ค้นหาอาชีพในฝันของคุณ
            </h1>
            <p className="mt-6 text-lg text-text-secondary max-w-2xl mx-auto sm:text-xl">
              ระบบจับคู่งานอัจฉริยะด้วย Smart Tags — หางานที่ตรงใจ · หาคนที่ใช่
            </p>
            <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Button href="/jobs" size="lg" variant="primary">
                ค้นหางาน
              </Button>
              <Button href="/auth/register-company" size="lg" variant="outline">
                ลงประกาศรับสมัคร
              </Button>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 sm:py-24" aria-labelledby="features-heading">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 id="features-heading" className="text-3xl font-bold text-center text-text-primary">
              ทำไมต้อง FutureCareer?
            </h2>
            <p className="mt-4 text-center text-text-secondary max-w-2xl mx-auto">
              เครื่องมือที่ออกแบบมาเพื่อผู้หางานและบริษัทโดยเฉพาะ
            </p>
            <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((feature) => (
                <Card key={feature.title} className="flex flex-col items-center text-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-light">
                    {feature.icon}
                  </div>
                  <h3 className="mt-6 text-lg font-semibold text-text-primary">{feature.title}</h3>
                  <p className="mt-3 text-sm text-text-secondary leading-relaxed">{feature.description}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <HowItWorks />

        {/* Testimonials Section */}
        <section className="py-16 sm:py-24" aria-labelledby="testimonials-heading">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 id="testimonials-heading" className="text-3xl font-bold text-center text-text-primary">
              เสียงจากผู้ใช้งาน
            </h2>
            <div className="mt-12 grid gap-8 sm:grid-cols-2">
              {testimonials.map((t) => (
                <Card key={t.name} className="flex flex-col">
                  <svg className="h-8 w-8 text-primary/30" fill="currentColor" viewBox="0 0 32 32" aria-hidden="true">
                    <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" />
                  </svg>
                  <blockquote className="mt-4 flex-1">
                    <p className="text-text-secondary leading-relaxed">{t.quote}</p>
                  </blockquote>
                  <div className="mt-6 flex items-center gap-3">
                    <span
                      aria-hidden="true"
                      className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary-light text-primary text-sm font-semibold"
                    >
                      {t.name[0]}
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-text-primary">{t.name}</p>
                      <p className="text-xs text-text-secondary">{t.role}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-primary py-16 sm:py-20" aria-labelledby="cta-heading">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
            <h2 id="cta-heading" className="text-3xl font-bold text-text-inverse">
              พร้อมค้นหาอาชีพในฝัน?
            </h2>
            <p className="mt-4 text-primary-light text-lg max-w-xl mx-auto">
              สมัครสมาชิกฟรีวันนี้ แล้วเริ่มค้นหางานที่ตรงใจ
            </p>
            <div className="mt-8">
              <Button
                href="/auth/register"
                size="lg"
                variant="accent"
              >
                เริ่มต้นใช้งานฟรี
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
