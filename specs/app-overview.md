## 1. App Type & Purpose

**App Type:** Web Application (Job Matching Platform & Mini ATS)
**Purpose:** **FutureCareer** เป็นแพลตฟอร์มหางานและจับคู่อาชีพที่มุ่งเน้นความแม่นยำและตอบโจทย์ทั้งสองฝั่งตลาด (Two-sided market) 
* **สำหรับผู้หางาน (End User):** ช่วยแก้ปัญหาการหางานที่ไม่ตรงกับทักษะ โดยมีระบบ Personalized Match ที่ใช้ Tags (Skill, Industry, Level ฯลฯ) เพื่อแนะนำงานที่เหมาะสม และช่วยให้กระบวนการสมัครงาน (Job Apply) รวดเร็วผ่านการแนบ Resume และการตอบคำถาม Prescreen เบื้องต้น
* **สำหรับบริษัท (Company/Recruiter):** เป็นเครื่องมือแบบ End-to-end ตั้งแต่การสร้างแบรนด์นายจ้าง (Company Profile & Feed) การประกาศหางาน ไปจนถึงระบบจัดการผู้สมัคร (ATS - Applicant Tracking System) ในรูปแบบ Kanban Board เพื่อลดความยุ่งยากในการคัดกรองและบริหารจัดการ Candidate

---

## 2. Core Features

นี่คือฟีเจอร์หลัก 7 ประการของแพลตฟอร์ม:

1.  **Dual Role Authentication & Verification:** ระบบ Register และ Login ที่แยกหน้ากันอย่างชัดเจนระหว่าง End User (ผู้หางาน) และ Company (HR/Admin) พร้อมระบบ Email Verification เพื่อความปลอดภัย
2.  **Smart Job Search & Personalized Match:** ระบบค้นหางานที่มี Auto-complete สำหรับ Tags ต่างๆ (Skill, Industry, Position, Location) และระบบแนะนำงาน (Personalized Match) ที่ตรงกับ Profile ของผู้ใช้งาน
3.  **End User Profile & Resume Management:** พื้นที่ส่วนตัวสำหรับผู้หางานในการอัปโหลด Resume (PDF) จัดการรูปภาพ ประวัติย่อ (Bio) และข้อมูลการติดต่อ
4.  **Custom Prescreening & Easy Apply:** ระบบให้ Recruiter สร้างคำถามคัดกรอง (Multiple Choice / Open-ended) ผูกกับประกาศงาน และให้ผู้หางานสมัครผ่าน Form เดียวที่ดึง Resume จากระบบ พร้อมเขียน Introductory Message และตอบคำถามได้ทันที
5.  **Company Branding & Feed:** ฟีเจอร์สำหรับ Company Admin ในการสร้างโปรไฟล์บริษัท (Logo, Bio, Size, Industry) และ Company Feed สำหรับอัปเดตเรื่องราวหรือประกาศต่างๆ เพื่อดึงดูดผู้สมัคร
6.  **Job Position Management:** เครื่องมือสำหรับ Recruiter ในการสร้างประกาศงาน กำหนด Spec, Qualifications และติด Tags อย่างละเอียด (Industry, Level, Skill, Location, Type)
7.  **Kanban ATS (Applicant Tracking System):** บอร์ดบริหารจัดการ Candidate ที่สามารถลากเปลี่ยนสถานะได้ (Kanban Board) พร้อมระบบ Search/Filter และปุ่มสำหรับกดดู Contact Info เมื่อสนใจผู้สมัคร

---

## 3. User Flow

การทำงานหลักของระบบแบ่งออกเป็น 2 Journey ตามประเภทของผู้ใช้งาน ดังนี้:

**A. End User Journey (ผู้หางาน):**
1.  **Onboarding:** เข้าสู่เว็บ → เลือกหน้า Register สำหรับผู้หางาน → ยืนยัน Email (Verify) → เข้าสู่ระบบ (Sign in)
2.  **Profile Setup:** เข้าเมนู Member → กรอกข้อมูลส่วนตัว (Name, Bio, Contact) → อัปโหลด Resume (PDF)
3.  **Discovery:** เข้าสู่หน้า Job Search ค้นหางานด้วย Criteria ต่างๆ หรือดูงานจากระบบ Personalized Match ที่ดึงข้อมูลตาม Tag
4.  **Action:** คลิกดู Job Detail ที่สนใจ → กด Apply (ต้อง Login แล้ว) → ระบบแสดง Form ให้กรอก Introductory Message, ยืนยัน Contact/Resume, และตอบ Prescreen Questions → Submit
5.  **Follow-up:** รอการติดต่อกลับจากบริษัทหากผ่านการคัดกรอง

**B. Company Journey (บริษัท / HR):**
1.  **Onboarding:** ตัวแทนบริษัท (Admin) เข้าหน้า Register สำหรับ HR → ยืนยัน Email → เข้าสู่ระบบ
2.  **Company Setup & Team:** Admin ตั้งค่า Company Profile และอัปเดต Company Feed → ทำการ Invite Recruiter เข้ามาร่วมทีม
3.  **Job Posting:** Recruiter (หรือ Admin) เข้าเมนู Job Management → สร้างประกาศงานใหม่ → กรอกรายละเอียด, ติด Tags, และตั้งค่า Custom Prescreen Questions → Publish Job
4.  **Candidate Management:** มีผู้สมัครเข้ามา → Recruiter เข้าหน้า ATS (Kanban Board) → ใช้ Filter/Search กรองผู้สมัคร → อ่าน Resume และคำตอบ Prescreen
5.  **Decision:** หากสนใจ Candidate → เปลี่ยนสถานะบนบอร์ด → กดดู Contact Info เพื่อทำการติดต่อสัมภาษณ์ต่อไป

---

## 4. Page Structure

โครงสร้างของ Web App แบ่งออกเป็นหน้าต่างๆ ดังนี้:

**Public Pages (หน้าสาธารณะ)**
* **Home / Landing Page:** หน้าแรกของแพลตฟอร์ม อธิบายจุดเด่น และมีช่องทางแยกไป Login/Register สำหรับ Candidate และ HR
* **Job Search Page:** หน้าค้นหางานหลักที่มีช่อง Search พร้อม Auto-complete tags และ Filter ต่างๆ
* **Job Detail Page:** หน้าแสดงรายละเอียดของตำแหน่งงานนั้นๆ รวมไปถึง Spec, Qualification และปุ่ม Apply
* **Company Public Profile:** หน้าแสดงข้อมูลบริษัทแบบ Public รวมถึง Company Feed (Story/Announcement) และรายการงานที่เปิดรับของบริษัทนี้

**End User Pages (ผู้หางาน)**
* **End User Auth Pages:** หน้า Register, Sign In, Sign Out และ Email Verification (แยกเฉพาะผู้หางาน)
* **Personalized Match Dashboard:** หน้าแสดงผลงานที่ระบบจับคู่ให้ (Recommended Jobs) อิงตาม Tag ที่ผู้ใช้ระบุไว้
* **My Profile / Member Area:** หน้าจัดการข้อมูลส่วนตัว (Name, Image, Bio, Contact Info) และแนบ/เปลี่ยนไฟล์ Resume (PDF)
* **Job Apply Modal/Page:** หน้า Form สำหรับกดสมัครงาน (มีให้กรอก Intro Message, ตอบ Prescreen questions และยืนยันการใช้ Resume)

**Company Pages (บริษัท/HR)**
* **Company Auth Pages:** หน้า Register, Sign In, Sign Out และ Email Verification (แยกเฉพาะฝั่งบริษัท)
* **Company Admin Dashboard:** หน้าศูนย์กลางสำหรับ Admin เพื่อดูภาพรวม (สถิติต่างๆ)
* **Company Profile Settings:** หน้าจัดการข้อมูลบริษัท (Logo, Short/Full Bio, Industry, Size)
* **Company Feed Management:** หน้าสำหรับสร้างและจัดการโพสต์อัปเดต Story หรือ Announcement ของบริษัท
* **Team Management:** หน้าสำหรับ Admin ในการ Invite และจัดการสิทธิ์ของ Recruiter ในบริษัท
* **Job Management:** หน้าแสดงรายการประกาศงานทั้งหมด สามารถกดสร้าง (Create), แก้ไข (Edit), ปิดรับสมัคร (Change Status) และตั้งค่า Custom Prescreen Questions
* **ATS / Candidate Kanban Board:** หน้าบริหารจัดการผู้สมัครในรูปแบบบอร์ด ลากเปลี่ยนสถานะได้ พร้อมระบบ Filter/Search และหน้าต่างดู Contact Info ของผู้สมัครที่ผ่านเกณฑ์