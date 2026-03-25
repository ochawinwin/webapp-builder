Build this following engineering best practices:
- Write all code to WCAG AA accessibility standards
- Create and use reusable components throughout
- Use semantic HTML and proper component architecture
- Avoid absolute positioning; use flexbox/grid layouts
- Build actual code components, not image SVGs
- Keep code clean, maintainable, and well-structured

I need you to build a complete application. Here's everything:

**PROJECT OVERVIEW:**
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


**ALL PAGES & DETAILED SPECIFICATIONS:**
### 1. Home / Landing Page

* **Purpose**: หน้าแรกเพื่อดึงดูดผู้ใช้งาน แนะนำจุดเด่นของแพลตฟอร์ม และแยกประเภทผู้ใช้ (ผู้หางาน / บริษัท) เข้าสู่ระบบ
* **Layout Structure**: Header (Navbar), Hero Section, Features Section, Call-to-Action (CTA) Section, Footer
* **Key Components**: Navbar, Hero Banner, 2x Primary CTA Buttons, Feature Cards
* **Interactive Elements**: ปุ่ม Login/Register (แยก Candidate/HR), ปุ่มเริ่มค้นหางาน
* **Navigation**: เป็นหน้าแรกที่เข้าถึงได้ผ่าน Root URL (`/`) นำไปสู่หน้า Auth หรือ Job Search
* **Content**: โลโก้ FutureCareer, ข้อความเชิญชวน (Copywriting), ลิงก์ไปยังส่วนต่างๆ
* **States**: 
    * *Loaded*: แสดงผลปกติ
    * *Logged In*: Navbar จะเปลี่ยนปุ่ม Auth เป็น Profile Avatar / Dashboard link
* **Functional Behavior**:
    * **Page Load/Auth**: หน้า Public ไม่ต้องการ Auth Check
    * **Buttons**: 
        * `หางานทันที` -> Navigate ไปที่ `/search`
        * `สำหรับบริษัท` -> Navigate ไปที่ `/hr/login`

**Wireframe:**
```text
+-----------------------------------------------------------+
| [FutureCareer]                    [Job Search] [Log In]   |
+-----------------------------------------------------------+
|                                                           |
|        Find your next career with Personalized Match      |
|                                                           |
|      [ I'm a Candidate ]         [ I'm a Company ]        |
|                                                           |
+-----------------------------------------------------------+
|  Features:  [Smart Match]  [Easy Apply]  [Kanban ATS]     |
+-----------------------------------------------------------+
|  Footer: Links, Contact, Privacy                          |
+-----------------------------------------------------------+
```

---

### 2. Auth Pages (Register / Sign In)

* **Purpose**: จัดการการเข้าสู่ระบบและสมัครสมาชิก โดยแยก Flow ระหว่าง Candidate และ Company
* **Layout Structure**: Split Screen (ซ้าย: รูปภาพกราฟิก / ขวา: Form Area)
* **Key Components**: Email/Password Form, Role Toggle (หรือแยก URL), Social Login (Optional), Error Message Box
* **Interactive Elements**: Text Inputs, Submit Button, "Forgot Password" link
* **Navigation**: เข้าจาก Home Page หลังจาก Login สำเร็จจะเด้งไปที่ Dashboard ของแต่ละ Role
* **Content**: หัวข้อ "เข้าสู่ระบบ / สมัครสมาชิก", ฟิลด์ Email, Password, Confirm Password
* **States**: *Loading* (ปุ่มหมุนตอนกด Submit), *Error* (กรอกผิด/อีเมลซ้ำ), *Success* (แจ้งเตือนให้ไปเช็คอีเมล Verify)
* **Functional Behavior**:
    * **Page Load**: ถ้ามี Session อยู่แล้ว ให้ Redirect ไปหน้า Dashboard ทันที
    * **Forms**:
        * *Fields*: `email`, `password`, `role` (candidate/company)
        * *Validation*: Client-side (รูปแบบอีเมล, รหัสผ่าน > 8 ตัว), Server-side (อีเมลซ้ำไหม?)
        * *Action*: `POST /api/auth/register` หรือ `POST /api/auth/login`
    * **Buttons**: `Submit` -> เรียก API -> ถ้า Success นำ Token เก็บใน HTTP-only Cookie / LocalStorage -> Redirect ไป `/search` หรือ `/hr/dashboard`

**Wireframe:**
```text
+-------------------------+---------------------------------+
|                         |  Welcome to FutureCareer        |
|      [ Graphic /        |  [Candidate] | [Company]        |
|        Branding ]       |                                 |
|                         |  Email: [_______________]       |
|                         |  Pass:  [_______________]       |
|                         |                                 |
|                         |      [ Sign In ]                |
|                         |  Don't have account? Register   |
+-------------------------+---------------------------------+
```

---

### 3. Job Search & Personalized Match Dashboard

* **Purpose**: หน้าหลักสำหรับผู้หางานในการค้นหาและดูงานที่ระบบแนะนำจาก Tag (Personalized)
* **Layout Structure**: Header, Top Search Bar, Left Sidebar (Filters), Main Content (Job List)
* **Key Components**: Search Input with Autocomplete, Filter Checkboxes, Job Card List, Pagination
* **Interactive Elements**: พิมพ์ค้นหา, คลิกเลือก Filter, คลิก Job Card เพื่อดูรายละเอียด, กด Save Job
* **Navigation**: เข้าจาก Navbar ผู้หางาน นำไปสู่ Job Detail Page
* **Content**: รายการงาน (Job Title, Company Name, Location, Salary, Tags)
* **States**: *Loading* (Skeleton ตอนดึงข้อมูลงาน), *Empty* (ไม่พบงานที่ค้นหา), *Error* (ดึงข้อมูลล้มเหลว)
* **Functional Behavior**:
    * **Page Load/Auth**: เข้าได้ทั้ง Public และ Logged-in ถ้า Logged-in จะยิง API ดึง User Profile มาทำ Personalized Match
    * **Forms (Search Bar)**:
        * *Fields*: `keyword`, `tags` (autocomplete จาก DB เช่น skill, industry)
        * *Action*: พิมพ์แล้วรอ 300ms (Debounce) -> `GET /api/jobs/search?q=...&tags=...`
    * **Lists/Tables**:
        * *Data Source*: `GET /api/jobs`
        * *Filters*: Map parameter จาก Checkbox (Full-time, Location, Level) ไปที่ Query String
        * *Pagination*: Server-side pagination (limit=10, offset=X)

**Wireframe:**
```text
+-----------------------------------------------------------+
| [Logo]   Search: [ Software Engineer...| Q ]   [Profile]  |
+-----------------------------------------------------------+
| Filters:        | Recommended for You (Based on tags)     |
| [x] Full-time   | +-------------------------------------+ |
| [ ] Contract    | | Frontend Dev @ TechCorp             | |
|                 | | Tags: React, Junior, Bangkok        | |
| Industry:       | | [ View Detail ]                     | |
| [ Dropdown ]    | +-------------------------------------+ |
|                 | | Backend Dev @ DataCo                | |
+-----------------------------------------------------------+
```

---

### 4. Job Detail Page & Apply Modal

* **Purpose**: แสดงรายละเอียดเชิงลึกของตำแหน่งงาน และให้ผู้หางานกดสมัคร (Apply)
* **Layout Structure**: Header, Main Content (2 Columns: Left for Job Info, Right for Company Summary)
* **Key Components**: Job Description, Company Info Card, Apply Button, Apply Modal (Form)
* **Interactive Elements**: ปุ่ม "Apply Now", ปุ่มแชร์งาน, การกรอกฟอร์มใน Modal
* **Navigation**: เข้าจาก Job Search -> กด Apply แล้วเปิด Modal
* **Content**: Spec, Qualification, ประวัติบริษัทสั้นๆ, ข้อความ Prescreen
* **States**: Modal *Open/Closed*, *Submitting* (ตอนกดสมัคร)
* **Functional Behavior**:
    * **Page Load**: `GET /api/jobs/:id` (Public). ถ้ากด Apply จะเช็ค Auth -> ถ้ายังไม่ล็อกอิน Redirect ไปหน้า Login
    * **Apply Modal Form**:
        * *Fields*: `intro_message` (Textarea), `prescreen_answers` (Dynamic array ตามที่ HR ตั้งไว้), `use_profile_resume` (Boolean)
        * *Data Source*: ดึง Resume PDF link และ Contact info จาก `GET /api/user/profile` มาแสดงให้ยืนยัน
        * *Action*: `POST /api/applications`
        * *Validation*: เช็คว่าตอบ Prescreen ครบไหม, มี Resume ในระบบหรือยัง (ถ้าไม่มี บังคับให้อัปโหลดก่อน)
    * **Buttons**: `Submit Application` -> Success Alert -> ปิด Modal -> เปลี่ยนปุ่ม Apply เป็น "Applied"

**Wireframe (Apply Modal):**
```text
+-------------------------------------------------------+
| Apply for Frontend Dev @ TechCorp                 [X] |
+-------------------------------------------------------+
| Contact: user@email.com | +66-123-4567                |
| Resume: [My_Resume_2024.pdf] (v) Use my profile resume|
|                                                       |
| Intro Message:                                        |
| [___________________________________________________] |
|                                                       |
| Prescreen Question: How many years of React exp?      |
| ( ) 0-1 years  ( ) 1-3 years  ( ) 3+ years            |
|                                                       |
|                     [ Cancel ]  [ Submit Application ]|
+-------------------------------------------------------+
```

---

### 5. My Profile (End User)

* **Purpose**: จัดการข้อมูลส่วนตัวและ Resume เพื่อใช้ในการสมัครงาน
* **Layout Structure**: Header, Left Menu (Profile, Settings), Main Content Form
* **Key Components**: Avatar Upload, Basic Info Form, Resume Upload Zone (Drag & Drop)
* **Interactive Elements**: Upload File, Edit Text, Save Changes
* **Navigation**: เมนู Profile บน Navbar
* **Content**: ชื่อ, Bio, รูปภาพ, อีเมล, เบอร์โทร, ไฟล์ PDF ที่เคยอัปโหลด
* **States**: *Uploading* (Progress bar ตอนอัปโหลด PDF), *Saving*, *Saved Successfully*
* **Functional Behavior**:
    * **Page Load/Auth**: ต้องมี Role = Candidate. `GET /api/user/profile`.
    * **Resume Upload**:
        * *Action*: `POST /api/user/resume` (Multipart/form-data)
        * *Validation*: File type `application/pdf` เท่านั้น, Size < 5MB.
    * **Forms**:
        * *Fields*: `first_name`, `last_name`, `bio`, `phone`
        * *Action*: `PUT /api/user/profile`

**Wireframe:**
```text
+-----------------------------------------------------------+
| My Profile                                                |
+-----------------------------------------------------------+
| [Avatar] [Upload new picture]                             |
|                                                           |
| First Name: [___________]   Last Name: [___________]      |
| Phone:      [___________]                                 |
| Bio:        [_____________________________________]       |
|                                                           |
| Resume (PDF only):                                        |
| +-------------------------------------------------------+ |
| |   Drag and Drop your resume here or [Browse]          | |
| |   Current: my_resume.pdf                              | |
| +-------------------------------------------------------+ |
|                                             [ Save ]      |
+-----------------------------------------------------------+
```

---

### 6. Job Position Management (HR/Recruiter)

* **Purpose**: ให้ Recruiter สร้าง แก้ไข หรือปิดประกาศงาน พร้อมตั้งคำถาม Prescreen
* **Layout Structure**: HR Navbar, Top Actions (Create Job), Data Table List
* **Key Components**: Data Table (List of jobs), Status Dropdown, Create Job Form (Page/Modal)
* **Interactive Elements**: ปุ่ม Create, แก้ไขสถานะ (Open/Closed), เพิ่ม Tags
* **Navigation**: เข้าจากเมนู "Manage Jobs" ในฝั่ง Company
* **Content**: รายการงานของบริษัท, สถิติเบื้องต้น (เช่น จำนวนผู้สมัครต่อตำแหน่ง)
* **States**: *Loading List*, *Empty* (ยังไม่มีประกาศงาน)
* **Functional Behavior**:
    * **Page Load/Auth**: ต้องมี Role = HR/Admin ของ Company นั้นๆ `GET /api/company/jobs`.
    * **Create Job Form (เมื่อกด Create)**:
        * *Fields*: `title`, `description`, `spec`, `qualifications`, `tags` (Autocomplete), `prescreen_questions` (Dynamic array: type, question_text, options).
        * *Action*: `POST /api/company/jobs`
        * *Tags Autocomplete*: ยิง API `GET /api/tags?type=skill&q=...`
    * **Lists/Tables**:
        * สามารถกดเปลี่ยน Status จาก Dropdown ในตารางได้โดยตรง -> ยิง `PATCH /api/company/jobs/:id/status`

**Wireframe (Job Management List):**
```text
+-----------------------------------------------------------+
| HR Dashboard > Manage Jobs                 [ + Create Job]|
+-----------------------------------------------------------+
| Title          | Status  | Applicants | Actions           |
|----------------|---------|------------|-------------------|
| Frontend Dev   | [Open v]| 12         | [Edit] [View ATS] |
| Backend Dev    | [Close v| 45         | [Edit] [View ATS] |
+-----------------------------------------------------------+
```

---

### 7. ATS / Candidate Kanban Board

* **Purpose**: บอร์ดจัดการผู้สมัคร ลากเปลี่ยนสถานะ (Pipeline) และดูข้อมูล Contact
* **Layout Structure**: Header (Job Title context), Search/Filter Bar, Kanban Columns (New, Reviewing, Interview, Hired, Rejected)
* **Key Components**: Drag-and-Drop Columns, Candidate Cards, Contact Info Modal
* **Interactive Elements**: ลากการ์ดข้ามคอลัมน์, พิมพ์ค้นหาผู้สมัคร, คลิกการ์ดเพื่อดูข้อมูล/Resume
* **Navigation**: กดปุ่ม [View ATS] จากหน้า Job Management
* **Content**: ชื่อ Candidate, วันที่สมัคร, แท็กสรุปคุณสมบัติ, คำตอบ Prescreen
* **States**: *Dragging* (Visual feedback ตอนลาก), *Loading* (อัปเดตสถานะ)
* **Functional Behavior**:
    * **Page Load/Auth**: ต้องเป็น HR ที่รับผิดชอบงานนี้ `GET /api/jobs/:id/applications`
    * **Kanban Drag & Drop**:
        * *Action*: เมื่อปล่อยการ์ดลงคอลัมน์ใหม่ จะยิง `PATCH /api/applications/:app_id/status` พร้อม parameter `new_status`
        * *Error Handling*: ถ้า API fail ให้การ์ดเด้งกลับคอลัมน์เดิม (Optimistic UI fallback)
    * **Candidate Card Click**:
        * เปิด Modal แสดงข้อมูล: `GET /api/applications/:app_id` (ประกอบด้วย Resume Link, คำตอบ Prescreen)
        * ปุ่ม `View Contact`: หาก HR สนใจ กดปุ่มนี้เพื่อแสดง Email/Phone (การกดอาจบันทึก Log ลง DB ว่า HR คนไหนเปิดดูข้อมูล)

**Wireframe:**
```text
+-----------------------------------------------------------+
| ATS: Frontend Dev                           Search: [___] |
+-----------------------------------------------------------+
| New (2)         | Reviewing (1)   | Interview (0)         |
| +-------------+ | +-------------+ |                       |
| | John Doe    | | | Jane Smith  | |                       |
| | 3 yrs React | | | [View info] | |                       |
| +-------------+ | +-------------+ |                       |
| +-------------+ |                 |                       |
| | Alan Walker | |                 |                       |
| +-------------+ |                 |                       |
+-----------------------------------------------------------+
```


**DESIGN SYSTEM:**

## 🎨 1. Color Palette

เราจะใช้สีจากเอกสาร FutureSkill Brand Guidelines เป็นหลัก โดยนำมาจับคู่กับสีพื้นหลังโทนสว่างเพื่อให้ดูสะอาดตาและเป็นมืออาชีพสำหรับการหางานครับ

**Brand Colors (อิงจาก Primary Palette ของ FutureSkill):**
* [cite_start]**Primary Color:** `#9A52E4` (Violet) [cite: 136] - ใช้สำหรับปุ่มหลัก (Primary Action), ลิงก์, และสถานะ Active
* [cite_start]**Secondary Color:** `#F1CB46` (Yellow) [cite: 138] - ใช้สำหรับดึงดูดสายตา เช่น แท็ก "งานแนะนำ" (Recommended Job) หรือปุ่ม Call to Action รอง
* [cite_start]**Accent Color:** `#E73A77` (Pink) [cite: 139] - ใช้ประดับ UI เบาๆ หรือเป็นสี Gradient คู่กับ Primary

**Background & Surface Colors (White Theme):**
* **Background (Main):** `#FFFFFF` (White) - สีพื้นหลังหลักของเว็บไซต์
* **Surface (Cards/Sections):** `#F8F9FA` (Off-white/Light Gray) - ใช้สำหรับพื้นหลังของการ์ดงาน (Job Cards) หรือ Sidebar เพื่อให้เกิดมิติแยกจากพื้นหลังหลัก

**Text Colors:**
* [cite_start]**Primary Text:** `#442767` (Dark Purple) [cite: 135] - ใช้แทนสีดำสนิทสำหรับหัวข้อ (Headings) เพื่อคุมโทนแบรนด์
* **Secondary Text:** `#6B7280` (Cool Gray) - ใช้สำหรับข้อความทั่วไป (Body text), รายละเอียดรอง, หรือ Placeholder
* **Disabled Text:** `#9CA3AF` (Light Gray) - ใช้สำหรับปุ่มที่กดไม่ได้หรือช่องที่ห้ามแก้ไข

**Status Colors (อิงจาก Secondary Palette ของ FutureSkill):**
* [cite_start]**Success:** `#46E08C` (Green) [cite: 158] - ใช้สำหรับสถานะ "สมัครสำเร็จ", "บันทึกข้อมูลแล้ว"
* [cite_start]**Error:** `#ED536F` (Red/Pink) [cite: 158] - ใช้สำหรับแจ้งเตือนกรอกฟอร์มผิดพลาด
* [cite_start]**Warning:** `#F08D5F` (Orange) [cite: 158] - ใช้สำหรับแจ้งเตือนให้ดำเนินการ เช่น "กรุณาอัปโหลด Resume"
* [cite_start]**Info:** `#276DC0` (Blue) [cite: 158] - ใช้สำหรับ Tooltips หรือข้อความแนะนำทั่วไป

---

## 🔤 2. Typography

ระบบจะใช้ Google Webfonts ตามข้อกำหนดของคุณ โดยแบ่งการใช้งานอย่างชัดเจน:

**Font Families:**
* [cite_start]**English Headings:** `Poppins` [cite: 115]
* [cite_start]**Thai Headings:** `Kanit` [cite: 103]
* [cite_start]**Body / Content (TH & EN):** `Sarabun` [cite: 105]

**Font Sizes (Modular Scale - Base 16px):**
* **H1 (Hero Title):** 48px (Line height 1.2) - สำหรับข้อความต้อนรับหน้า Home
* **H2 (Page Title):** 32px (Line height 1.3) - สำหรับชื่อหน้า เช่น "Job Search", "My Profile"
* **H3 (Section Title / Job Title):** 24px (Line height 1.4) - สำหรับชื่อตำแหน่งงานในการ์ด
* **Body Large (Intro/Lead):** 18px (Line height 1.5) - สำหรับรายละเอียดเกริ่นนำ
* **Body Regular (Main Content):** 16px (Line height 1.5) - สำหรับ Job Description, ข้อมูลทั่วไป
* **Body Small (Tags / Metadata):** 14px (Line height 1.4) - สำหรับ Location, Salary, Tags
* **Micro:** 12px (Line height 1.4) - สำหรับข้อความหมายเหตุ (Disclaimer)

**Font Weights:**
* [cite_start]**Regular (400):** สำหรับ Body text ทั่วไป [cite: 122]
* [cite_start]**Medium (500):** สำหรับปุ่ม (Buttons) และ Sub-headings [cite: 120]
* [cite_start]**Semi-Bold (600):** สำหรับ H3 และจุดที่ต้องการเน้น [cite: 121]
* [cite_start]**Bold (700):** สำหรับ H1, H2 [cite: 122]

**Logo Usage:**
* [cite_start]**Logo Text:** ใช้ไอคอน (Small logo ที่คุณอัปโหลด) วางซ้ายมือ ตามด้วยคำว่า "FutureCareer" โดยใช้ฟอนต์ `Poppins` หรือ `Kanit` น้ำหนัก Bold สี `#442767` [cite: 135]

---

## 📏 3. Spacing System

ใช้ระบบ 8-Point Grid System เพื่อความสม่ำเสมอในการจัดวาง Layout (อิงตาม Base 4px/8px):

* **xs (Extra Small):** 4px - ระยะห่างระหว่าง Icon กับ Text ในปุ่ม
* **sm (Small):** 8px - ระยะห่างระหว่างหัวข้อและเนื้อหาใน Job Card
* **md (Medium):** 16px - Padding มาตรฐานในปุ่ม, ระยะห่างระหว่าง Input fields ในฟอร์ม
* **lg (Large):** 24px - Padding ภายใน Card ใหญ่ (เช่น Candidate Profile)
* **xl (Extra Large):** 32px - ระยะห่างระหว่าง Section ย่อย
* **2xl (Double Extra Large):** 64px - ระยะห่างระหว่าง Section หลักในหน้า Landing Page

---

## 🧩 4. Component Styles

เพื่อให้แอปดูทันสมัย เข้าถึงง่าย (Sleek & Professional):

**Buttons:**
* [cite_start]**Primary Button:** สีพื้น `#9A52E4` [cite: 136][cite_start], ตัวหนังสือสี `#FFFFFF`, Hover state: `#7E39D8` [cite: 158]
* [cite_start]**Secondary Button:** พื้นใส (Transparent), เส้นขอบ (Border) 1px สี `#9A52E4` [cite: 136][cite_start], ตัวหนังสือสี `#9A52E4` [cite: 136]
* **Ghost Button:** ไม่มีสีและเส้นขอบ, ตัวหนังสือสี `#6B7280`, Hover state: พื้นหลังเทาอ่อน `#F3F4F6`
* **Border Radius:** `8px` สำหรับความรู้สึกเป็นมิตรแต่ยังดูเป็นทางการ

**Input Fields (Forms & Search):**
* **Default:** พื้นหลัง `#FFFFFF`, เส้นขอบ (Border) 1px สี `#E5E7EB` (Light Gray), Border Radius `8px`
* [cite_start]**Focus State:** เส้นขอบเปลี่ยนเป็นสี `#9A52E4` [cite: 136] พร้อมเงาบางๆ (Glow effect) สี `#9A52E4` แบบโปร่งใส 20%
* [cite_start]**Error State:** เส้นขอบสี `#ED536F` [cite: 158]

**Cards (Job Cards, Profile Cards):**
* **Background:** `#FFFFFF`
* **Border:** ไม่มีเส้นขอบ แต่ใช้ **Shadow/Elevation** แทน
* [cite_start]**Border Radius:** `12px` (ให้โค้งกว่าปุ่มเล็กน้อยตามรูปทรงของโลโก้ [cite: 20])
* **Shadow (Hover):** เมื่อนำเมาส์ไปชี้การ์ดงาน (Job Card) ให้เงาเข้มและขยายขึ้นเล็กน้อย เพื่อบอกว่าคลิกได้ (Interactive)

**Tags (Skills, Industry, Level):**
* [cite_start]พื้นหลังสีเทาอ่อน `#F3F4F6`, ตัวหนังสือสี `#442767`[cite: 135], มุมโค้งกลม (Pill shape) `100px`

---

## 📱 5. Layout Grid

ระบบจัดวางหน้าจอที่รองรับ Responsive Design:

* **Container Max-width:** `1200px` (เพื่อให้อ่านง่าย ไม่กว้างเกินไปบนจอใหญ่)
* **Grid Columns:** 12 Columns
* **Gutter Size (ช่องว่างระหว่างคอลัมน์):** 24px
* **Responsive Breakpoints:**
    * **Mobile (sm):** `< 768px` (แสดงผล 1 คอลัมน์แบบ Stack)
    * **Tablet (md):** `768px - 1023px` (แสดงผล 2 คอลัมน์ หรือ Sidebar ยุบซ่อนได้)
    * **Desktop (lg):** `1024px - 1279px` (แสดงผล 12 คอลัมน์เต็มรูปแบบ)
    * **Large Desktop (xl):** `> 1280px` (Container จัดกึ่งกลางหน้าจอ)


Build out all pages as separate page components with full functionality, content, and styling according to the design system. Make this a complete, working prototype.

When finished, generate mock accounts for each role for me to login and test the app.