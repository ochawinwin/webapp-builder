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