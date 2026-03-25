# FutureCareer — App Architecture (Page-by-Page Breakdown)

> 20 pages total across 4 sections: Public, Auth, Job Seeker Dashboard, Company Dashboard.

---

## Public Pages

---

### 1. Landing Page

- **Purpose**: Convert visitors into registered users (job seekers or companies). Communicate the platform's value proposition.
- **Layout Structure**: Sticky top navbar → hero section → features section → how-it-works section → testimonials → CTA section → footer.
- **Key Components**:
  - Top navigation bar (logo, Job Search link, Sign In dropdown, Register buttons)
  - Hero banner with headline, subtext, and dual CTA buttons ("Find Jobs" / "Hire Talent")
  - Feature cards (3–4 cards highlighting: smart matching, ATS, pre-screening, company profiles)
  - How-it-works stepper (3 steps for each user type, togglable between job seeker / company)
  - Testimonial carousel or grid
  - Final CTA banner with registration buttons
  - Footer (links, copyright, social icons)
- **Interactive Elements**:
  - Toggle between "For Job Seekers" and "For Companies" in the how-it-works section
  - CTA buttons navigate to respective registration pages
  - Navbar sign-in dropdown to choose role (Job Seeker / Company)
- **Navigation**:
  - Entry point: direct URL (futurecareer.co)
  - Links to: Job Search, Job Seeker Register, Company Register, Sign In pages
- **Content**:
  - Headline: e.g., "Find Your Future Career — Matched to You"
  - Subtext explaining tag-based matching
  - Feature titles + short descriptions
  - Step-by-step illustrations for each user journey
  - Testimonial quotes with names and roles
- **States**:
  - Default (static content, no loading needed)
  - If user is already logged in: navbar shows dashboard link instead of Sign In/Register

- **Wireframe**:
```
┌─────────────────────────────────────────────────────────────────┐
│  ┌──────┐   ค้นหางาน   สำหรับบริษัท   [เข้าสู่ระบบ] [สมัครสมาชิก] │
│  │ LOGO │                                                       │
│  └──────┘                                                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│              ค้นหาอาชีพในฝันของคุณ                                │
│              — จับคู่งานที่ใช่ ให้คุณ                              │
│                                                                 │
│        ระบบจับคู่งานอัจฉริยะด้วย Smart Tags                       │
│        หางานที่ตรงใจ · หาคนที่ใช่                                 │
│                                                                 │
│           [ ค้นหางาน ]    [ ลงประกาศรับสมัคร ]                    │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│   ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│   │  ◎            │  │  ◎            │  │  ◎            │         │
│   │ Smart Match   │  │ ระบบ ATS     │  │ Pre-Screen    │         │
│   │               │  │ ในตัว         │  │ Questions     │         │
│   │ จับคู่งาน     │  │ Kanban +     │  │ ตั้งคำถาม     │         │
│   │ จาก Tag       │  │ List View    │  │ คัดกรองได้เอง │         │
│   └──────────────┘  └──────────────┘  └──────────────┘         │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│     วิธีการใช้งาน                                                │
│     [สำหรับผู้หางาน]  [สำหรับบริษัท]                              │
│                                                                 │
│     ①  สร้าง Profile  →  ②  ค้นหา & จับคู่  →  ③  สมัครงาน     │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│   "FutureCareer จับคู่งานให้ผม     "เราเจอ Senior Dev 3 คน      │
│    ได้ภายใน 2 สัปดาห์"              ในสัปดาห์แรก"                │
│         — สมชาย, Developer           — Mike R., CTO             │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│        พร้อมค้นหาอาชีพในฝัน?                                     │
│           [ เริ่มต้นใช้งานฟรี ]                                   │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│  เกี่ยวกับ · ติดต่อ · นโยบายความเป็นส่วนตัว · ข้อกำหนด  © FutureCareer │
└─────────────────────────────────────────────────────────────────┘
```

---

### 2. Job Search / Browse

- **Purpose**: Let users search and discover job postings using tag-based filters, with personalized match scores for logged-in members.
- **Layout Structure**: Top navbar → search/filter bar (sticky) → results grid/list → pagination → footer.
- **Key Components**:
  - Search bar with text input and autocomplete
  - Tag filter panel: multi-select dropdowns/chips for skill, industry, level, position, location, type (fulltime / contract / freelance)
  - Toggle: grid view vs. list view
  - Job result cards (company logo, job title, company name, location, type, tags, match % badge for logged-in users)
  - Pagination or infinite scroll controls
  - Sort dropdown (relevance, newest, match score)
- **Interactive Elements**:
  - Type in search bar → autocomplete suggestions appear from tag database
  - Select/deselect filter tags → results update in real-time
  - Click a job card → navigate to Job Detail page
  - Toggle grid/list view
  - Change sort order
  - Clear all filters button
- **Navigation**:
  - From: Landing Page CTA, navbar "Find Jobs" link, direct URL
  - To: Job Detail page (click card), Sign In (if applying while logged out)
- **Content**:
  - Result count text: "Showing X jobs matching your criteria"
  - Each card: job title, company name + logo, location, job type badge, 3–5 skill/tag chips, match % (if logged in), posted date
  - Empty state message when no results match
- **States**:
  - **Loading**: Skeleton cards while results fetch
  - **Empty**: "No jobs match your filters. Try adjusting your criteria." with illustration
  - **Error**: "Something went wrong. Please try again." with retry button
  - **Logged out**: Match % badges hidden, subtle banner: "Sign in to see personalized matches"
  - **Logged in**: Match % badges visible, sorted by relevance to user's profile tags

- **Wireframe**:
```
┌─────────────────────────────────────────────────────────────────┐
│  ┌──────┐   ค้นหางาน   สำหรับบริษัท   [เข้าสู่ระบบ] [สมัครสมาชิก] │
│  │ LOGO │                                                       │
│  └──────┘                                                       │
├─────────────────────────────────────────────────────────────────┤
│ ┌─────────────────────────────────────────────────────────────┐ │
│ │ 🔍 ค้นหาตำแหน่งงาน, ทักษะ, หรือคำที่สนใจ...                 │ │
│ └─────────────────────────────────────────────────────────────┘ │
│                                                                 │
│ ตัวกรอง:                                                        │
│ [ทักษะ ▾] [อุตสาหกรรม ▾] [ระดับ ▾] [สถานที่ ▾] [ประเภท ▾]    │
│ เลือกแล้ว: [React ✕] [Senior ✕] [กรุงเทพฯ ✕]   [ล้างทั้งหมด]  │
│                                                                 │
│ พบ 42 ตำแหน่ง         เรียงตาม: [ความเกี่ยวข้อง ▾] [≡] [⊞]    │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│ ┌───────────────────────┐  ┌───────────────────────┐           │
│ │ ┌────┐                │  │ ┌────┐                │           │
│ │ │logo│ Senior Frontend │  │ │logo│ Full Stack Dev │           │
│ │ └────┘ TechCorp       │  │ └────┘ StartupXYZ     │           │
│ │  📍 กรุงเทพฯ · Full-time│ │  📍 Remote · Contract │           │
│ │                        │  │                        │           │
│ │  [React] [TypeScript]  │  │  [Node.js] [React]    │           │
│ │  [Senior]              │  │  [Mid-level]           │           │
│ │                        │  │                        │           │
│ │  ตรงกัน: 92%  2 วันที่แล้ว│  │  ตรงกัน: 85%  5 วัน │           │
│ └───────────────────────┘  └───────────────────────┘           │
│                                                                 │
│ ┌───────────────────────┐  ┌───────────────────────┐           │
│ │ ┌────┐                │  │ ┌────┐                │           │
│ │ │logo│ Backend Engineer│  │ │logo│ DevOps Lead    │           │
│ │ └────┘ BigCo Inc.     │  │ └────┘ CloudFirm      │           │
│ │  📍 เชียงใหม่ · Full   │  │  📍 กรุงเทพฯ · Full   │           │
│ │                        │  │                        │           │
│ │  [Go] [PostgreSQL]     │  │  [AWS] [K8s]          │           │
│ │  [Mid-level]           │  │  [Senior]              │           │
│ │                        │  │                        │           │
│ │  ตรงกัน: 78%  1 สัปดาห์ │  │  ตรงกัน: 71%  1 สัปดาห์│           │
│ └───────────────────────┘  └───────────────────────┘           │
│                                                                 │
│              [ ← 1  2  3  4  5 → ]                             │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│  เกี่ยวกับ · ติดต่อ · ความเป็นส่วนตัว · ข้อกำหนด  © FutureCareer │
└─────────────────────────────────────────────────────────────────┘
```

---

### 3. Job Detail

- **Purpose**: Display full job posting information so the user can decide whether to apply.
- **Layout Structure**: Top navbar → breadcrumb → two-column layout (main content left, sidebar right) → footer.
- **Key Components**:
  - Breadcrumb (Jobs > [Category] > [Job Title])
  - Job header: title, company name + logo, location, job type badge, posted date
  - Tag chips row (skill, industry, level, position, location, type)
  - Match score badge (logged-in users only)
  - Job description section (rich text: responsibilities, qualifications, benefits)
  - Pre-screen questions preview (list of question titles so applicant knows what to expect)
  - Sidebar: company mini-card (logo, name, industry, size, link to company profile), "Apply Now" button, "Save Job" bookmark button, share button
- **Interactive Elements**:
  - "Apply Now" button → if logged in, navigate to Job Application Form; if logged out, redirect to Sign In with return URL
  - "Save Job" bookmark toggle
  - Share button (copy link, social share options)
  - Company name/logo → link to Company Profile (Public)
  - Tag chips → clickable, navigate to Job Search pre-filtered by that tag
- **Navigation**:
  - From: Job Search results, direct URL, Company Profile open positions list
  - To: Job Application Form, Company Profile (Public), Job Search (via tag click)
- **Content**:
  - Full job title, company info
  - Rich text job description (responsibilities, requirements, qualifications, benefits, salary range if provided)
  - List of tags
  - Pre-screen question count: "This application includes X screening questions"
  - Company sidebar: logo, name, industry, size, short bio
- **States**:
  - **Loading**: Skeleton layout for content areas
  - **Error**: "Job not found" or "This position is no longer available" with link back to search
  - **Already Applied**: "Apply Now" button replaced with "Applied ✓" disabled state
  - **Closed/Expired**: Banner: "This position is no longer accepting applications"

- **Wireframe**:
```
┌─────────────────────────────────────────────────────────────────┐
│  ┌──────┐   ค้นหางาน   สำหรับบริษัท   [เข้าสู่ระบบ] [สมัครสมาชิก] │
│  │ LOGO │                                                       │
│  └──────┘                                                       │
├─────────────────────────────────────────────────────────────────┤
│ งาน > Engineering > Senior Frontend Developer                   │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│ ┌──────────────────────────────────┐  ┌──────────────────────┐ │
│ │                                  │  │  ┌────┐              │ │
│ │  Senior Frontend Developer       │  │  │logo│ TechCorp     │ │
│ │  ┌────┐ TechCorp                 │  │  └────┘              │ │
│ │  │logo│ กรุงเทพฯ · Full-time     │  │  Technology · 51-200 │ │
│ │  └────┘ โพสต์เมื่อ 2 วันที่แล้ว    │  │  "Building the next  │ │
│ │                                  │  │   generation of..."  │ │
│ │  ตรงกัน: 92%                     │  │  → ดูข้อมูลบริษัท     │ │
│ │                                  │  │                      │ │
│ │  [React] [TypeScript] [Senior]   │  ├──────────────────────┤ │
│ │  [Frontend] [กรุงเทพฯ] [Fulltime]│  │                      │ │
│ │                                  │  │  [ สมัครงาน ]        │ │
│ │  ─────────────────────────────── │  │                      │ │
│ │                                  │  │  ☆ บันทึกงาน         │ │
│ │  หน้าที่รับผิดชอบ                  │  │  ↗ แชร์             │ │
│ │  • พัฒนาและดูแล React app...     │  │                      │ │
│ │  • ทำงานร่วมกับ Designer...      │  ├──────────────────────┤ │
│ │  • Code review และ mentoring...  │  │  การสมัครนี้มี        │ │
│ │                                  │  │  คำถามคัดกรอง 3 ข้อ  │ │
│ │  คุณสมบัติ                        │  │                      │ │
│ │  • ประสบการณ์ React 5+ ปี         │  └──────────────────────┘ │
│ │  • เชี่ยวชาญ TypeScript           │                            │
│ │  • มีประสบการณ์ Testing...        │                            │
│ │                                  │                            │
│ │  สวัสดิการ                        │                            │
│ │  • ทำงานจากที่ไหนก็ได้            │                            │
│ │  • ประกันสุขภาพ                   │                            │
│ │  • โบนัสประจำปี                   │                            │
│ │                                  │                            │
│ └──────────────────────────────────┘                            │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│  เกี่ยวกับ · ติดต่อ · ความเป็นส่วนตัว · ข้อกำหนด  © FutureCareer │
└─────────────────────────────────────────────────────────────────┘
```

---

### 4. Company Profile (Public)

- **Purpose**: Showcase a company's brand, open positions, and latest announcements to attract job seekers.
- **Layout Structure**: Top navbar → company header/banner → tabbed content (About, Open Positions, Feed) → footer.
- **Key Components**:
  - Company header: logo, company name, industry badge, size badge, short bio
  - Cover/banner image area
  - Tab navigation: About | Open Positions | Feed
  - About tab: full bio (rich text), industry, company size, contact info
  - Open Positions tab: list of active job cards (same style as search results, filtered to this company)
  - Feed tab: chronological list of company announcements/stories (card format with date, title, content)
- **Interactive Elements**:
  - Switch between tabs
  - Click a job card → navigate to Job Detail
  - Feed posts: expand/collapse long content
- **Navigation**:
  - From: Job Detail sidebar, Job Search result cards, direct URL
  - To: Job Detail (via open positions), Job Search (via tag clicks)
- **Content**:
  - Company logo, name, industry, size
  - Short bio (header) and full bio (about tab)
  - List of open job positions with title, location, type, tags
  - Feed posts with timestamps, titles, and content body
- **States**:
  - **Loading**: Skeleton for header + tab content
  - **No Open Positions**: "No open positions at the moment. Check back later!" in the positions tab
  - **No Feed Posts**: "No updates yet." in the feed tab
  - **Company Not Found**: 404 page with link back to search

- **Wireframe**:
```
┌─────────────────────────────────────────────────────────────────┐
│  ┌──────┐   ค้นหางาน   สำหรับบริษัท   [เข้าสู่ระบบ] [สมัครสมาชิก] │
│  │ LOGO │                                                       │
│  └──────┘                                                       │
├─────────────────────────────────────────────────────────────────┤
│ ┌─────────────────────────────────────────────────────────────┐ │
│ │  ░░░░░░░░░░░░░░░░░░░ COVER IMAGE ░░░░░░░░░░░░░░░░░░░░░░░  │ │
│ │                                                             │ │
│ │   ┌──────┐                                                  │ │
│ │   │ LOGO │  TechCorp                                        │ │
│ │   └──────┘  Technology · 51–200 พนักงาน                      │ │
│ │             "Building next-gen developer tools."             │ │
│ └─────────────────────────────────────────────────────────────┘ │
│                                                                 │
│  [ เกี่ยวกับ ]  [ ตำแหน่งที่เปิดรับ (5) ]  [ ฟีด ]              │
│  ─────────────────────────────────────────────                  │
│                                                                 │
│  ┌─ เกี่ยวกับ ──────────────────────────────────────────────┐  │
│  │                                                            │ │
│  │  เกี่ยวกับ TechCorp                                        │ │
│  │                                                            │ │
│  │  TechCorp เป็นบริษัทเทคโนโลยีชั้นนำที่มุ่งเน้น              │ │
│  │  การพัฒนาเครื่องมือสำหรับนักพัฒนา ก่อตั้งเมื่อปี              │ │
│  │  2018 ให้บริการบริษัทกว่า 10,000 แห่งทั่วโลก...              │ │
│  │                                                            │ │
│  │  อุตสาหกรรม: Technology                                     │ │
│  │  ขนาดบริษัท: 51–200 พนักงาน                                 │ │
│  │                                                            │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                 │
│  ┌─ ตำแหน่งที่เปิดรับ (alt view) ────────────────────────────┐  │
│  │  ┌──────────────────────────────────────────────────────┐  │ │
│  │  │ Senior Frontend Developer · กรุงเทพฯ · Full-time    │  │ │
│  │  │ [React] [TypeScript] [Senior]         2 วันที่แล้ว    │  │ │
│  │  └──────────────────────────────────────────────────────┘  │ │
│  │  ┌──────────────────────────────────────────────────────┐  │ │
│  │  │ Backend Engineer · Remote · Full-time                │  │ │
│  │  │ [Go] [PostgreSQL] [Mid]               1 สัปดาห์      │  │ │
│  │  └──────────────────────────────────────────────────────┘  │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                 │
│  ┌─ ฟีด (alt view) ─────────────────────────────────────────┐  │
│  │  ┌──────────────────────────────────────────────────────┐  │ │
│  │  │ 📅 20 มี.ค. 2026                                     │  │ │
│  │  │ เรากำลังรับสมัคร! มาร่วมทีม Engineering กัน            │  │ │
│  │  │ เรากำลังมองหาวิศวกรที่มีความหลงใหลในการพัฒนา...       │  │ │
│  │  └──────────────────────────────────────────────────────┘  │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│  เกี่ยวกับ · ติดต่อ · ความเป็นส่วนตัว · ข้อกำหนด  © FutureCareer │
└─────────────────────────────────────────────────────────────────┘
```

---

## Auth Pages

---

### 5. Job Seeker Register

- **Purpose**: Create a new job seeker account with email verification.
- **Layout Structure**: Centered card layout → form → footer link.
- **Key Components**:
  - FutureCareer logo at top
  - Registration form: full name, email, password, confirm password
  - Terms & conditions checkbox
  - "Create Account" submit button
  - Divider with social auth options (Google, LinkedIn) if applicable
  - Footer link: "Already have an account? Sign In" and "Are you hiring? Register as a Company"
- **Interactive Elements**:
  - Form field validation (inline errors on blur)
  - Password strength indicator
  - Show/hide password toggle
  - Submit → sends verification email → redirects to "Check your email" confirmation screen
- **Navigation**:
  - From: Landing Page CTA, Sign In page link, Job Detail "Apply" (if not registered)
  - To: Email Verification pending screen, Sign In page
- **Content**:
  - Heading: "Create Your Job Seeker Account"
  - Subtext: "Start finding jobs matched to your skills"
  - Field labels and placeholder text
  - Validation error messages
  - Success: "We've sent a verification link to your email"
- **States**:
  - **Default**: Empty form
  - **Validating**: Inline field errors (e.g., "Email is already registered", "Password must be at least 8 characters")
  - **Submitting**: Button shows spinner, fields disabled
  - **Success**: Redirect to "Check your email" screen
  - **Error**: Toast/banner: "Registration failed. Please try again."

- **Wireframe**:
```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│                       ┌──────┐                                  │
│                       │ LOGO │                                  │
│                       └──────┘                                  │
│                    FutureCareer                                  │
│                                                                 │
│            ┌──────────────────────────────┐                     │
│            │                              │                     │
│            │  สมัครสมาชิกผู้หางาน           │                     │
│            │  เริ่มค้นหางานที่ตรงกับ        │                     │
│            │  ทักษะของคุณ                  │                     │
│            │                              │                     │
│            │  ชื่อ-นามสกุล                  │                     │
│            │  ┌──────────────────────┐    │                     │
│            │  │ สมชาย ใจดี            │    │                     │
│            │  └──────────────────────┘    │                     │
│            │                              │                     │
│            │  อีเมล                       │                     │
│            │  ┌──────────────────────┐    │                     │
│            │  │ somchai@example.com  │    │                     │
│            │  └──────────────────────┘    │                     │
│            │                              │                     │
│            │  รหัสผ่าน                     │                     │
│            │  ┌──────────────────────┐    │                     │
│            │  │ ••••••••••••     👁   │    │                     │
│            │  └──────────────────────┘    │                     │
│            │  ████████░░ แข็งแรง          │                     │
│            │                              │                     │
│            │  ยืนยันรหัสผ่าน               │                     │
│            │  ┌──────────────────────┐    │                     │
│            │  │ ••••••••••••     👁   │    │                     │
│            │  └──────────────────────┘    │                     │
│            │                              │                     │
│            │  ☑ ยอมรับข้อกำหนดและ          │                     │
│            │    เงื่อนไขการใช้งาน           │                     │
│            │                              │                     │
│            │  [ สมัครสมาชิก              ] │                     │
│            │                              │                     │
│            │  ──── หรือดำเนินการผ่าน ────  │                     │
│            │                              │                     │
│            │  [ G  Google ] [in LinkedIn] │                     │
│            │                              │                     │
│            │  มีบัญชีอยู่แล้ว?              │                     │
│            │  เข้าสู่ระบบ                   │                     │
│            │                              │                     │
│            │  ต้องการหาคน?                 │                     │
│            │  สมัครในนามบริษัท              │                     │
│            │                              │                     │
│            └──────────────────────────────┘                     │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

### 6. Company Register

- **Purpose**: Create a new company account (for the company admin) with email verification.
- **Layout Structure**: Centered card layout → form → footer link.
- **Key Components**:
  - FutureCareer logo at top
  - Registration form: admin full name, work email, password, confirm password, company name
  - Terms & conditions checkbox
  - "Register Company" submit button
  - Footer link: "Already have an account? Sign In" and "Looking for a job? Register as a Job Seeker"
- **Interactive Elements**:
  - Same validation behavior as Job Seeker Register
  - Submit → sends verification email → redirects to "Check your email" screen
- **Navigation**:
  - From: Landing Page CTA ("Hire Talent"), Sign In page link
  - To: Email Verification pending screen, Sign In page
- **Content**:
  - Heading: "Register Your Company"
  - Subtext: "Start hiring the right talent today"
  - Field labels, placeholders, validation messages
- **States**:
  - Same as Job Seeker Register (default, validating, submitting, success, error)

- **Wireframe**:
```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│                       ┌──────┐                                  │
│                       │ LOGO │                                  │
│                       └──────┘                                  │
│                    FutureCareer                                  │
│                                                                 │
│            ┌──────────────────────────────┐                     │
│            │                              │                     │
│            │  ลงทะเบียนบริษัท             │                     │
│            │  เริ่มหาคนที่ใช่              │                     │
│            │  ให้องค์กรของคุณวันนี้         │                     │
│            │                              │                     │
│            │  ชื่อ-นามสกุล                  │                     │
│            │  ┌──────────────────────┐    │                     │
│            │  │                      │    │                     │
│            │  └──────────────────────┘    │                     │
│            │                              │                     │
│            │  อีเมลที่ทำงาน                │                     │
│            │  ┌──────────────────────┐    │                     │
│            │  │                      │    │                     │
│            │  └──────────────────────┘    │                     │
│            │                              │                     │
│            │  ชื่อบริษัท                    │                     │
│            │  ┌──────────────────────┐    │                     │
│            │  │                      │    │                     │
│            │  └──────────────────────┘    │                     │
│            │                              │                     │
│            │  รหัสผ่าน                     │                     │
│            │  ┌──────────────────────┐    │                     │
│            │  │                  👁   │    │                     │
│            │  └──────────────────────┘    │                     │
│            │                              │                     │
│            │  ยืนยันรหัสผ่าน               │                     │
│            │  ┌──────────────────────┐    │                     │
│            │  │                  👁   │    │                     │
│            │  └──────────────────────┘    │                     │
│            │                              │                     │
│            │  ☑ ยอมรับข้อกำหนดการใช้งาน    │                     │
│            │                              │                     │
│            │  [ ลงทะเบียนบริษัท          ] │                     │
│            │                              │                     │
│            │  มีบัญชีอยู่แล้ว?              │                     │
│            │  เข้าสู่ระบบ                   │                     │
│            │                              │                     │
│            │  กำลังหางาน?                  │                     │
│            │  สมัครสมาชิกผู้หางาน           │                     │
│            │                              │                     │
│            └──────────────────────────────┘                     │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

### 7. Sign In (Job Seeker)

- **Purpose**: Authenticate existing job seekers into their dashboard.
- **Layout Structure**: Centered card layout → form → footer links.
- **Key Components**:
  - FutureCareer logo
  - Sign-in form: email, password
  - "Remember me" checkbox
  - "Forgot password?" link
  - "Sign In" submit button
  - Divider with social auth options (Google, LinkedIn) if applicable
  - Footer link: "Don't have an account? Register" and "Are you hiring? Sign in as Company"
- **Interactive Elements**:
  - Form validation on submit
  - Show/hide password toggle
  - Submit → authenticate → redirect to Job Search or previous page (return URL)
  - "Forgot password?" → navigate to password reset flow
- **Navigation**:
  - From: Navbar, Landing Page, Job Detail "Apply" redirect, Registration success
  - To: Job Search (default), previous page (if return URL), Password Reset
- **Content**:
  - Heading: "Welcome Back"
  - Subtext: "Sign in to your job seeker account"
  - Error: "Invalid email or password"
- **States**:
  - **Default**: Empty form
  - **Submitting**: Button spinner, fields disabled
  - **Error**: "Invalid email or password" banner
  - **Email Not Verified**: "Please verify your email first. Resend verification link?"

- **Wireframe**:
```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│                       ┌──────┐                                  │
│                       │ LOGO │                                  │
│                       └──────┘                                  │
│                    FutureCareer                                  │
│                                                                 │
│            ┌──────────────────────────────┐                     │
│            │                              │                     │
│            │  ยินดีต้อนรับกลับ              │                     │
│            │  เข้าสู่ระบบบัญชีผู้หางาน       │                     │
│            │                              │                     │
│            │  อีเมล                       │                     │
│            │  ┌──────────────────────┐    │                     │
│            │  │ somchai@example.com  │    │                     │
│            │  └──────────────────────┘    │                     │
│            │                              │                     │
│            │  รหัสผ่าน                     │                     │
│            │  ┌──────────────────────┐    │                     │
│            │  │ ••••••••••••     👁   │    │                     │
│            │  └──────────────────────┘    │                     │
│            │                              │                     │
│            │  ☑ จดจำฉัน      ลืมรหัสผ่าน?  │                     │
│            │                              │                     │
│            │  [ เข้าสู่ระบบ              ] │                     │
│            │                              │                     │
│            │  ──── หรือดำเนินการผ่าน ────  │                     │
│            │                              │                     │
│            │  [ G  Google ] [in LinkedIn] │                     │
│            │                              │                     │
│            │  ยังไม่มีบัญชี?               │                     │
│            │  สมัครสมาชิก                  │                     │
│            │                              │                     │
│            │  ต้องการหาคน?                 │                     │
│            │  เข้าสู่ระบบในนามบริษัท        │                     │
│            │                              │                     │
│            └──────────────────────────────┘                     │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

### 8. Sign In (Company/HR)

- **Purpose**: Authenticate recruiters and company admins into the company dashboard.
- **Layout Structure**: Same as Job Seeker Sign In but with company-branded variant.
- **Key Components**:
  - Same as Job Seeker Sign In, with different heading and links
  - Footer link: "Don't have a company account? Register" and "Looking for a job? Sign in as Job Seeker"
- **Interactive Elements**: Same as Job Seeker Sign In.
- **Navigation**:
  - From: Navbar, Landing Page, Company Register success
  - To: Company Dashboard (default), Password Reset
- **Content**:
  - Heading: "Company Sign In"
  - Subtext: "Manage your job postings and candidates"
- **States**: Same as Job Seeker Sign In.

- **Wireframe**:
```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│                       ┌──────┐                                  │
│                       │ LOGO │                                  │
│                       └──────┘                                  │
│                    FutureCareer                                  │
│                                                                 │
│            ┌──────────────────────────────┐                     │
│            │                              │                     │
│            │  เข้าสู่ระบบบริษัท             │                     │
│            │  จัดการประกาศรับสมัครงาน       │                     │
│            │  และผู้สมัคร                   │                     │
│            │                              │                     │
│            │  อีเมลที่ทำงาน                │                     │
│            │  ┌──────────────────────┐    │                     │
│            │  │                      │    │                     │
│            │  └──────────────────────┘    │                     │
│            │                              │                     │
│            │  รหัสผ่าน                     │                     │
│            │  ┌──────────────────────┐    │                     │
│            │  │                  👁   │    │                     │
│            │  └──────────────────────┘    │                     │
│            │                              │                     │
│            │  ☑ จดจำฉัน      ลืมรหัสผ่าน?  │                     │
│            │                              │                     │
│            │  [ เข้าสู่ระบบ              ] │                     │
│            │                              │                     │
│            │  ยังไม่มีบัญชีบริษัท?          │                     │
│            │  ลงทะเบียนบริษัท              │                     │
│            │                              │                     │
│            │  กำลังหางาน?                  │                     │
│            │  เข้าสู่ระบบผู้หางาน           │                     │
│            │                              │                     │
│            └──────────────────────────────┘                     │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

### 9. Email Verification

- **Purpose**: Confirm the user's email after clicking the verification link.
- **Layout Structure**: Centered card with status message.
- **Key Components**:
  - FutureCareer logo
  - Status icon (success checkmark or error icon)
  - Status message
  - CTA button
- **Interactive Elements**:
  - Success → "Go to Sign In" button
  - Expired/invalid → "Resend Verification Email" button
- **Navigation**:
  - From: Email link click
  - To: Sign In page (job seeker or company, based on role)
- **Content**:
  - Success: "Your email has been verified! You can now sign in."
  - Expired: "This verification link has expired. Request a new one."
  - Invalid: "Invalid verification link."
- **States**:
  - **Loading**: Verifying spinner while token is validated
  - **Success**: Green checkmark + success message + Sign In button
  - **Expired**: Warning icon + expired message + Resend button
  - **Invalid**: Error icon + invalid message + link back to registration

- **Wireframe (สำเร็จ)**:
```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│                       ┌──────┐                                  │
│                       │ LOGO │                                  │
│                       └──────┘                                  │
│                    FutureCareer                                  │
│                                                                 │
│            ┌──────────────────────────────┐                     │
│            │                              │                     │
│            │            ✓                 │                     │
│            │                              │                     │
│            │   ยืนยันอีเมลสำเร็จ!          │                     │
│            │                              │                     │
│            │   อีเมลของคุณได้รับการยืนยัน   │                     │
│            │   แล้ว สามารถเข้าสู่ระบบ      │                     │
│            │   ได้เลย                     │                     │
│            │                              │                     │
│            │   [ ไปหน้าเข้าสู่ระบบ       ]  │                     │
│            │                              │                     │
│            └──────────────────────────────┘                     │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

- **Wireframe (ลิงก์หมดอายุ)**:
```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│                       ┌──────┐                                  │
│                       │ LOGO │                                  │
│                       └──────┘                                  │
│                    FutureCareer                                  │
│                                                                 │
│            ┌──────────────────────────────┐                     │
│            │                              │                     │
│            │            ⚠                 │                     │
│            │                              │                     │
│            │   ลิงก์หมดอายุ                │                     │
│            │                              │                     │
│            │   ลิงก์ยืนยันนี้หมดอายุแล้ว     │                     │
│            │   กรุณาขอลิงก์ใหม่             │                     │
│            │                              │                     │
│            │   [ ส่งลิงก์ยืนยันอีกครั้ง    ] │                     │
│            │                              │                     │
│            └──────────────────────────────┘                     │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Job Seeker Dashboard (Member Area)

> All pages share a common layout: top navbar (with user avatar/menu) + left sidebar navigation + main content area.

---

### 10. Profile Settings

- **Purpose**: Let the job seeker manage their personal profile information.
- **Layout Structure**: Dashboard shell (navbar + sidebar) → main content: profile form with photo upload.
- **Key Components**:
  - Profile photo uploader (circular avatar with upload/change/remove overlay)
  - Form fields: full name, bio (textarea), email (read-only or changeable with re-verification), phone number
  - Tag selection area: skills, preferred industries, preferred levels, preferred locations, preferred job types (these feed the matching algorithm)
  - "Save Changes" button
  - "Delete Account" danger zone at bottom
- **Interactive Elements**:
  - Upload/change profile photo (file picker, crop modal)
  - Edit form fields with inline validation
  - Add/remove tags via autocomplete multi-select inputs
  - Save → success toast notification
  - Delete account → confirmation modal
- **Navigation**:
  - From: Sidebar "Profile" link, navbar user menu
  - To: Other dashboard pages via sidebar
- **Content**:
  - Section heading: "Profile Settings"
  - Field labels: Full Name, Bio, Email, Phone
  - Tag section heading: "Your Preferences" with helper text "These help us match you with the right jobs"
  - Last updated timestamp
- **States**:
  - **Loading**: Skeleton form while profile data loads
  - **Saved**: Success toast "Profile updated successfully"
  - **Validation Error**: Inline field errors
  - **Upload Error**: "Failed to upload photo. Please try again."
  - **Unsaved Changes**: Warning if navigating away with unsaved edits

- **Wireframe**:
```
┌─────────────────────────────────────────────────────────────────┐
│  ┌──────┐   ค้นหางาน                      🔔  ┌──┐ สมชาย ▾   │
│  │ LOGO │                                      │👤│            │
│  └──────┘                                      └──┘            │
├──────────────┬──────────────────────────────────────────────────┤
│              │                                                  │
│  แดชบอร์ด    │  ตั้งค่าโปรไฟล์                                   │
│              │                                                  │
│  ● โปรไฟล์   │  ┌───────────────────────────────────────────┐  │
│  ○ เรซูเม่    │  │                                           │  │
│  ○ งานที่สมัคร │  │  ┌────┐                                   │  │
│              │  │  │ 👤 │  อัปโหลดรูป                        │  │
│              │  │  └────┘  เปลี่ยน · ลบ                       │  │
│              │  │                                           │  │
│              │  │  ชื่อ-นามสกุล                               │  │
│              │  │  ┌──────────────────────────────────┐     │  │
│              │  │  │ สมชาย ใจดี                        │     │  │
│              │  │  └──────────────────────────────────┘     │  │
│              │  │                                           │  │
│              │  │  แนะนำตัว                                  │  │
│              │  │  ┌──────────────────────────────────┐     │  │
│              │  │  │ Frontend developer มีประสบการณ์   │     │  │
│              │  │  │ 5+ ปีใน React...                 │     │  │
│              │  │  └──────────────────────────────────┘     │  │
│              │  │                                           │  │
│              │  │  อีเมล                  เบอร์โทร           │  │
│              │  │  ┌───────────────┐     ┌──────────────┐  │  │
│              │  │  │ somchai@m.com │     │ 081-234-5678 │  │  │
│              │  │  └───────────────┘     └──────────────┘  │  │
│              │  │                                           │  │
│              │  └───────────────────────────────────────────┘  │
│              │                                                  │
│              │  ความชอบของคุณ                                   │
│              │  ข้อมูลนี้ช่วยจับคู่งานที่เหมาะกับคุณ              │
│              │                                                  │
│              │  ทักษะ                                           │
│              │  ┌──────────────────────────────────────────┐   │
│              │  │ [React ✕] [TypeScript ✕] [Node.js ✕]  + │   │
│              │  └──────────────────────────────────────────┘   │
│              │                                                  │
│              │  อุตสาหกรรมที่สนใจ                                │
│              │  ┌──────────────────────────────────────────┐   │
│              │  │ [Technology ✕] [Fintech ✕]             + │   │
│              │  └──────────────────────────────────────────┘   │
│              │                                                  │
│              │  ระดับ           สถานที่          ประเภทงาน      │
│              │  [Senior ▾]    [กรุงเทพฯ ▾]    [Full-time ▾]   │
│              │                                                  │
│              │                          [ บันทึกการเปลี่ยนแปลง ] │
│              │                                                  │
│              │  ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─    │
│              │  โซนอันตราย                                      │
│              │  [ ลบบัญชี ]                                     │
│              │                                                  │
├──────────────┴──────────────────────────────────────────────────┤
└─────────────────────────────────────────────────────────────────┘
```

---

### 11. Resume Management

- **Purpose**: Upload, view, and manage PDF resumes used for job applications.
- **Layout Structure**: Dashboard shell → main content: resume list + upload area.
- **Key Components**:
  - Upload zone (drag-and-drop area + "Browse Files" button, accepts PDF only)
  - Resume list: cards showing file name, upload date, file size, preview thumbnail
  - Each card actions: Preview (open in viewer/new tab), Download, Set as Default, Delete
  - "Default resume" badge on the primary resume
- **Interactive Elements**:
  - Drag-and-drop or click to upload PDF
  - Preview → opens PDF in modal viewer or new tab
  - Set as Default → marks resume with badge, used as pre-selected in applications
  - Delete → confirmation modal: "Are you sure? Applications already submitted with this resume won't be affected."
- **Navigation**:
  - From: Sidebar "Resumes" link
  - To: Other dashboard pages via sidebar
- **Content**:
  - Section heading: "My Resumes"
  - Helper text: "Upload your resumes here. Your default resume will be pre-selected when applying."
  - Upload zone text: "Drag & drop your PDF here, or click to browse"
  - File format note: "Accepted format: PDF, max 5MB"
- **States**:
  - **Loading**: Skeleton cards
  - **Empty**: Illustration + "You haven't uploaded any resumes yet. Upload one to start applying!" + upload CTA
  - **Uploading**: Progress bar on the upload zone
  - **Upload Error**: "Failed to upload. Make sure the file is a PDF under 5MB."
  - **Delete Confirmation**: Modal with warning text

- **Wireframe**:
```
┌─────────────────────────────────────────────────────────────────┐
│  ┌──────┐   ค้นหางาน                      🔔  ┌──┐ สมชาย ▾   │
│  │ LOGO │                                      │👤│            │
│  └──────┘                                      └──┘            │
├──────────────┬──────────────────────────────────────────────────┤
│              │                                                  │
│  แดชบอร์ด    │  เรซูเม่ของฉัน                                    │
│              │                                                  │
│  ○ โปรไฟล์   │  อัปโหลดเรซูเม่ที่นี่ เรซูเม่หลักจะถูกเลือก        │
│  ● เรซูเม่    │  อัตโนมัติเมื่อสมัครงาน                            │
│  ○ งานที่สมัคร │                                                  │
│              │  ┌ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┐  │
│              │  ╎                                           ╎  │
│              │  ╎    📄 ลากไฟล์ PDF มาวางที่นี่               ╎  │
│              │  ╎       หรือคลิกเพื่อเลือกไฟล์                ╎  │
│              │  ╎                                           ╎  │
│              │  ╎    รองรับ: PDF, สูงสุด 5MB                 ╎  │
│              │  ╎                                           ╎  │
│              │  └ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┘  │
│              │                                                  │
│              │  ┌──────────────────────────────────────────┐   │
│              │  │ 📄 Resume_Somchai_2026.pdf  ⭐ หลัก       │   │
│              │  │    อัปโหลดเมื่อ 15 มี.ค. 2026 · 245 KB    │   │
│              │  │    [ดูตัวอย่าง] [ดาวน์โหลด] [ตั้งเป็นหลัก]  │   │
│              │  │    [ลบ]                                   │   │
│              │  └──────────────────────────────────────────┘   │
│              │                                                  │
│              │  ┌──────────────────────────────────────────┐   │
│              │  │ 📄 Resume_Somchai_Design.pdf             │   │
│              │  │    อัปโหลดเมื่อ 28 ก.พ. 2026 · 312 KB    │   │
│              │  │    [ดูตัวอย่าง] [ดาวน์โหลด] [ตั้งเป็นหลัก]  │   │
│              │  │    [ลบ]                                   │   │
│              │  └──────────────────────────────────────────┘   │
│              │                                                  │
├──────────────┴──────────────────────────────────────────────────┤
└─────────────────────────────────────────────────────────────────┘
```

---

### 12. My Applications

- **Purpose**: Let the job seeker track all submitted applications and their statuses.
- **Layout Structure**: Dashboard shell → main content: filter bar + application list.
- **Key Components**:
  - Filter/sort bar: status filter (All, Submitted, Reviewing, Interview, Offered, Rejected), sort by date
  - Application cards/rows: job title, company name + logo, applied date, current status badge (color-coded), link to view details
  - Application detail expandable or modal: shows submitted resume, intro message, answers to pre-screen questions, status timeline
- **Interactive Elements**:
  - Filter by status
  - Sort by date (newest/oldest)
  - Click card → expand to see full application details
  - Click job title → navigate to Job Detail page
  - Click company name → navigate to Company Profile
- **Navigation**:
  - From: Sidebar "My Applications" link
  - To: Job Detail (via job title link), Company Profile (via company name)
- **Content**:
  - Section heading: "My Applications"
  - Count: "You have X applications"
  - Each card: job title, company, date applied, status badge
  - Expanded detail: resume file name, intro message text, Q&A pairs, status timeline entries with dates
- **States**:
  - **Loading**: Skeleton list
  - **Empty**: Illustration + "You haven't applied to any jobs yet." + "Browse Jobs" CTA button
  - **Error**: "Failed to load applications. Please try again." + retry button

- **Wireframe**:
```
┌─────────────────────────────────────────────────────────────────┐
│  ┌──────┐   ค้นหางาน                      🔔  ┌──┐ สมชาย ▾   │
│  │ LOGO │                                      │👤│            │
│  └──────┘                                      └──┘            │
├──────────────┬──────────────────────────────────────────────────┤
│              │                                                  │
│  แดชบอร์ด    │  งานที่สมัคร                                      │
│              │  คุณมี 4 รายการที่สมัคร                             │
│  ○ โปรไฟล์   │                                                  │
│  ○ เรซูเม่    │  กรอง: [ทั้งหมด ▾]          เรียง: [ล่าสุด ▾]    │
│  ● งานที่สมัคร │                                                  │
│              │  ┌──────────────────────────────────────────┐   │
│              │  │ ┌────┐ Senior Frontend Developer         │   │
│              │  │ │logo│ TechCorp                          │   │
│              │  │ └────┘ สมัครเมื่อ: 20 มี.ค. 2026          │   │
│              │  │                    [กำลังพิจารณา] ●       │   │
│              │  │                                          │   │
│              │  │  ▼ ดูรายละเอียด                           │   │
│              │  │  ┌────────────────────────────────────┐  │   │
│              │  │  │ เรซูเม่: Resume_Somchai_2026.pdf   │  │   │
│              │  │  │                                    │  │   │
│              │  │  │ แนะนำตัว: "ผมมีความหลงใหลใน       │  │   │
│              │  │  │ การสร้าง UI ที่ดีและมีประสบการณ์..." │  │   │
│              │  │  │                                    │  │   │
│              │  │  │ ถ: ทำไมถึงสนใจตำแหน่งนี้?           │  │   │
│              │  │  │ ต: "ผมชื่นชมวิสัยทัศน์ของ..."       │  │   │
│              │  │  │                                    │  │   │
│              │  │  │ ไทม์ไลน์:                           │  │   │
│              │  │  │ ● ส่งใบสมัคร — 20 มี.ค.            │  │   │
│              │  │  │ ● กำลังพิจารณา — 22 มี.ค.          │  │   │
│              │  │  └────────────────────────────────────┘  │   │
│              │  └──────────────────────────────────────────┘   │
│              │                                                  │
│              │  ┌──────────────────────────────────────────┐   │
│              │  │ ┌────┐ Full Stack Developer              │   │
│              │  │ │logo│ StartupXYZ                        │   │
│              │  │ └────┘ สมัครเมื่อ: 18 มี.ค. 2026          │   │
│              │  │                    [ส่งแล้ว] ●            │   │
│              │  └──────────────────────────────────────────┘   │
│              │                                                  │
│              │  ┌──────────────────────────────────────────┐   │
│              │  │ ┌────┐ Backend Engineer                  │   │
│              │  │ │logo│ BigCo Inc.                        │   │
│              │  │ └────┘ สมัครเมื่อ: 10 มี.ค. 2026          │   │
│              │  │                    [ไม่ผ่าน] ●            │   │
│              │  └──────────────────────────────────────────┘   │
│              │                                                  │
├──────────────┴──────────────────────────────────────────────────┤
└─────────────────────────────────────────────────────────────────┘
```

---

### 13. Job Application Form

- **Purpose**: Submit a job application with resume, intro message, contact info, and pre-screen question answers.
- **Layout Structure**: Dashboard shell → main content: multi-step form or single scrollable form with sections.
- **Key Components**:
  - Job summary header (title, company, location — context for what they're applying to)
  - Section 1 — Resume: dropdown/card selector to pick from uploaded resumes, or upload a new one inline
  - Section 2 — Introductory Message: textarea (with character count/limit)
  - Section 3 — Contact Information: email (pre-filled), phone (pre-filled), editable
  - Section 4 — Pre-Screen Questions: dynamically rendered based on the job's custom questions; supports multiple choice (radio/checkbox) and open-ended (textarea)
  - Progress indicator (if multi-step)
  - "Submit Application" button
  - "Save as Draft" button (optional)
- **Interactive Elements**:
  - Select resume from dropdown or upload new one
  - Type intro message with character counter
  - Edit contact fields
  - Answer each pre-screen question (select options or type answers)
  - Submit → confirmation modal: "Are you sure you want to submit? You won't be able to edit after submission."
  - After submit → redirect to My Applications with success toast
- **Navigation**:
  - From: Job Detail "Apply Now" button
  - To: My Applications (after submit), Job Detail (back/cancel)
- **Content**:
  - Heading: "Apply to [Job Title] at [Company Name]"
  - Section labels: "Select Resume", "Introductory Message", "Contact Information", "Screening Questions"
  - Placeholder text for textarea: "Tell the recruiter why you're a great fit for this role..."
  - Pre-screen questions: question text + answer options (rendered dynamically)
  - Submit confirmation: "Your application will be sent to [Company Name]. Continue?"
- **States**:
  - **Loading**: Skeleton while job data and pre-screen questions load
  - **No Resume**: Warning: "You need to upload a resume before applying." + upload CTA
  - **Validation Errors**: Inline errors on required fields and unanswered required questions
  - **Submitting**: Button spinner, all fields disabled
  - **Success**: Redirect to My Applications + toast "Application submitted successfully!"
  - **Error**: "Failed to submit application. Please try again."

- **Wireframe**:
```
┌─────────────────────────────────────────────────────────────────┐
│  ┌──────┐   ค้นหางาน                      🔔  ┌──┐ สมชาย ▾   │
│  │ LOGO │                                      │👤│            │
│  └──────┘                                      └──┘            │
├──────────────┬──────────────────────────────────────────────────┤
│              │                                                  │
│  แดชบอร์ด    │  สมัครงาน Senior Frontend Developer               │
│              │  ที่ TechCorp                                     │
│  ○ โปรไฟล์   │                                                  │
│  ○ เรซูเม่    │  ┌─ 1. เลือกเรซูเม่ ────────────────────────┐   │
│  ● งานที่สมัคร │  │                                            │  │
│              │  │  ┌────────────────────────────────────┐    │  │
│              │  │  │ ● Resume_Somchai_2026.pdf ⭐       │    │  │
│              │  │  │ ○ Resume_Somchai_Design.pdf       │    │  │
│              │  │  └────────────────────────────────────┘    │  │
│              │  │  หรือ [อัปโหลดเรซูเม่ใหม่]                  │  │
│              │  └────────────────────────────────────────────┘  │
│              │                                                  │
│              │  ┌─ 2. ข้อความแนะนำตัว ───────────────────────┐  │
│              │  │                                            │  │
│              │  │  ┌────────────────────────────────────┐    │  │
│              │  │  │ บอก Recruiter ว่าทำไมคุณถึง         │    │  │
│              │  │  │ เหมาะกับตำแหน่งนี้...               │    │  │
│              │  │  │                                    │    │  │
│              │  │  │                                    │    │  │
│              │  │  └────────────────────────────────────┘    │  │
│              │  │                            0/500 ตัวอักษร  │  │
│              │  └────────────────────────────────────────────┘  │
│              │                                                  │
│              │  ┌─ 3. ข้อมูลติดต่อ ─────────────────────────┐  │
│              │  │                                            │  │
│              │  │  อีเมล                  เบอร์โทร            │  │
│              │  │  ┌───────────────┐     ┌──────────────┐   │  │
│              │  │  │ somchai@m.com │     │ 081-234-5678 │   │  │
│              │  │  └───────────────┘     └──────────────┘   │  │
│              │  │                                            │  │
│              │  └────────────────────────────────────────────┘  │
│              │                                                  │
│              │  ┌─ 4. คำถามคัดกรอง (3 ข้อ) ─────────────────┐  │
│              │  │                                            │  │
│              │  │  ข้อ 1: ทำไมถึงสนใจตำแหน่งนี้?              │  │
│              │  │  ┌────────────────────────────────────┐    │  │
│              │  │  │                                    │    │  │
│              │  │  └────────────────────────────────────┘    │  │
│              │  │                                            │  │
│              │  │  ข้อ 2: มีประสบการณ์ React กี่ปี? *          │  │
│              │  │  ○ 1-2 ปี                                  │  │
│              │  │  ○ 3-5 ปี                                  │  │
│              │  │  ● 5+ ปี                                   │  │
│              │  │                                            │  │
│              │  │  ข้อ 3: สะดวกทำงาน Remote หรือไม่?          │  │
│              │  │  ○ ได้  ○ ไม่ได้  ● Hybrid                  │  │
│              │  │                                            │  │
│              │  └────────────────────────────────────────────┘  │
│              │                                                  │
│              │        [← กลับไปหน้างาน]  [ ส่งใบสมัคร ]         │
│              │                                                  │
├──────────────┴──────────────────────────────────────────────────┤
└─────────────────────────────────────────────────────────────────┘
```

- **Wireframe (Modal ยืนยันการส่ง)**:
```
┌──────────────────────────────────────┐
│  ยืนยันการส่งใบสมัคร?                  │
│                                      │
│  ใบสมัครของคุณจะถูกส่งไปยัง            │
│  TechCorp คุณจะไม่สามารถแก้ไข         │
│  ได้หลังจากส่งแล้ว                     │
│                                      │
│        [ยกเลิก]  [ ส่งใบสมัคร ]        │
└──────────────────────────────────────┘
```

---

## Company Dashboard

> All pages share a common layout: top navbar (with company name, user role badge, avatar/menu) + left sidebar navigation + main content area.

---

### 14. Company Profile Settings

- **Purpose**: Let the company admin edit the public-facing company profile.
- **Layout Structure**: Dashboard shell → main content: company profile form.
- **Key Components**:
  - Logo uploader (square image with upload/change overlay)
  - Cover image uploader (wide banner format)
  - Form fields: company name, short bio (character-limited textarea), full bio (rich text editor), industry (autocomplete select), company size (dropdown: 1–10, 11–50, 51–200, 201–500, 500+)
  - Live preview link: "View public profile" opens Company Profile (Public) in new tab
  - "Save Changes" button
- **Interactive Elements**:
  - Upload/change logo and cover image (file picker, crop modal)
  - Edit all text fields with inline validation
  - Industry autocomplete from predefined list
  - Select company size from dropdown
  - Rich text editor for full bio (bold, italic, lists, links)
  - Save → success toast
  - "View Public Profile" → new tab
- **Navigation**:
  - From: Sidebar "Company Profile" link
  - To: Company Profile (Public) via preview link, other dashboard pages via sidebar
- **Content**:
  - Section heading: "Company Profile"
  - Field labels: Logo, Cover Image, Company Name, Short Bio, Full Bio, Industry, Company Size
  - Helper text: "Short bio appears on job cards and search results (max 160 characters)"
  - Rich text editor toolbar labels
- **States**:
  - **Loading**: Skeleton form
  - **Saved**: Success toast "Company profile updated"
  - **Validation Error**: Inline errors (e.g., "Short bio exceeds 160 characters")
  - **Upload Error**: "Failed to upload image. Max size 2MB, formats: JPG, PNG."
  - **Unsaved Changes**: Warning on navigation away

- **Wireframe**:
```
┌─────────────────────────────────────────────────────────────────┐
│  ┌──────┐   FutureCareer        TechCorp [แอดมิน] 🔔 ┌──┐ ▾   │
│  │ LOGO │                                             │👤│     │
│  └──────┘                                             └──┘     │
├──────────────┬──────────────────────────────────────────────────┤
│              │                                                  │
│  บริษัท       │  โปรไฟล์บริษัท                                    │
│              │  [ดูโปรไฟล์สาธารณะ →]                              │
│  ● โปรไฟล์   │                                                  │
│  ○ ฟีด       │  ┌───────────────────────────────────────────┐  │
│  ○ ทีมงาน    │  │                                           │  │
│  ○ ประกาศงาน │  │  โลโก้             ภาพปก                    │  │
│  ○ ผู้สมัคร   │  │  ┌──────┐        ┌──────────────────┐    │  │
│              │  │  │      │        │ ░░░░░░░░░░░░░░░░ │    │  │
│              │  │  │ LOGO │        │ ░░ COVER IMAGE ░ │    │  │
│              │  │  │      │        │ ░░░░░░░░░░░░░░░░ │    │  │
│              │  │  └──────┘        └──────────────────┘    │  │
│              │  │  [เปลี่ยน]        [เปลี่ยน]                │  │
│              │  │                                           │  │
│              │  │  ชื่อบริษัท                                 │  │
│              │  │  ┌──────────────────────────────────┐    │  │
│              │  │  │ TechCorp                         │    │  │
│              │  │  └──────────────────────────────────┘    │  │
│              │  │                                           │  │
│              │  │  คำอธิบายสั้น (สูงสุด 160 ตัวอักษร)         │  │
│              │  │  ┌──────────────────────────────────┐    │  │
│              │  │  │ Building next-gen developer...   │    │  │
│              │  │  └──────────────────────────────────┘    │  │
│              │  │  แสดงบนการ์ดงานและผลการค้นหา              │  │
│              │  │                                           │  │
│              │  │  คำอธิบายเต็ม                               │  │
│              │  │  ┌──────────────────────────────────┐    │  │
│              │  │  │ [B] [I] [• list] [1. list] [🔗]  │    │  │
│              │  │  ├──────────────────────────────────┤    │  │
│              │  │  │ TechCorp เป็นบริษัทเทคโนโลยี     │    │  │
│              │  │  │ ชั้นนำที่มุ่งเน้นการพัฒนา...       │    │  │
│              │  │  │                                  │    │  │
│              │  │  └──────────────────────────────────┘    │  │
│              │  │                                           │  │
│              │  │  อุตสาหกรรม            ขนาดบริษัท          │  │
│              │  │  ┌───────────────┐     ┌──────────────┐  │  │
│              │  │  │ Technology  ▾ │     │ 51-200     ▾ │  │  │
│              │  │  └───────────────┘     └──────────────┘  │  │
│              │  │                                           │  │
│              │  │                    [ บันทึกการเปลี่ยนแปลง ] │  │
│              │  │                                           │  │
│              │  └───────────────────────────────────────────┘  │
│              │                                                  │
├──────────────┴──────────────────────────────────────────────────┤
└─────────────────────────────────────────────────────────────────┘
```

---

### 15. Company Feed Management

- **Purpose**: Create and manage company stories and announcements visible on the public company profile.
- **Layout Structure**: Dashboard shell → main content: compose area at top + feed post list below.
- **Key Components**:
  - Compose card: title input, content textarea (rich text or markdown), optional image attachment, "Publish" button
  - Feed post list: cards with title, content preview, published date, edit/delete actions
  - Each post card: expand to see full content, edit button (opens compose in edit mode), delete button
- **Interactive Elements**:
  - Write new post → fill title + content + optional image → "Publish"
  - Edit existing post → fields populate in compose area → "Update"
  - Delete post → confirmation modal: "This will remove the post from your public profile."
  - Image upload for post
- **Navigation**:
  - From: Sidebar "Feed" link
  - To: Other dashboard pages via sidebar
- **Content**:
  - Section heading: "Company Feed"
  - Compose placeholder: "Share an update, announcement, or story..."
  - Post card: title, content preview (truncated), full date, author name
  - Delete confirmation: "Are you sure you want to delete this post?"
- **States**:
  - **Loading**: Skeleton post cards
  - **Empty**: "No posts yet. Share your first company update!" + compose area highlighted
  - **Publishing**: Button spinner while post is being created
  - **Published**: Success toast "Post published!" + new post appears at top of list
  - **Error**: "Failed to publish post. Please try again."

- **Wireframe**:
```
┌─────────────────────────────────────────────────────────────────┐
│  ┌──────┐   FutureCareer        TechCorp [แอดมิน] 🔔 ┌──┐ ▾   │
│  │ LOGO │                                             │👤│     │
│  └──────┘                                             └──┘     │
├──────────────┬──────────────────────────────────────────────────┤
│              │                                                  │
│  บริษัท       │  ฟีดบริษัท                                       │
│              │                                                  │
│  ○ โปรไฟล์   │  ┌─ เขียนโพสต์ ─────────────────────────────┐   │
│  ● ฟีด       │  │                                           │  │
│  ○ ทีมงาน    │  │  หัวข้อ                                    │  │
│  ○ ประกาศงาน │  │  ┌──────────────────────────────────┐    │  │
│  ○ ผู้สมัคร   │  │  │                                  │    │  │
│              │  │  └──────────────────────────────────┘    │  │
│              │  │                                           │  │
│              │  │  เนื้อหา                                   │  │
│              │  │  ┌──────────────────────────────────┐    │  │
│              │  │  │ แชร์อัปเดต ประกาศ หรือเรื่องราว... │    │  │
│              │  │  │                                  │    │  │
│              │  │  │                                  │    │  │
│              │  │  └──────────────────────────────────┘    │  │
│              │  │                                           │  │
│              │  │  [📎 แนบรูปภาพ]           [ เผยแพร่ ]     │  │
│              │  │                                           │  │
│              │  └───────────────────────────────────────────┘  │
│              │                                                  │
│              │  ┌──────────────────────────────────────────┐   │
│              │  │  📅 20 มี.ค. 2026      [แก้ไข][ลบ]       │   │
│              │  │                                          │   │
│              │  │  เรากำลังรับสมัคร! มาร่วมทีม Engineering  │   │
│              │  │                                          │   │
│              │  │  เรายินดีที่จะประกาศเปิดรับสมัครหลาย       │   │
│              │  │  ตำแหน่งใน Engineering team...             │   │
│              │  │                                          │   │
│              │  └──────────────────────────────────────────┘   │
│              │                                                  │
│              │  ┌──────────────────────────────────────────┐   │
│              │  │  📅 10 มี.ค. 2026      [แก้ไข][ลบ]       │   │
│              │  │                                          │   │
│              │  │  อัปเดตบริษัท Q1 2026                     │   │
│              │  │                                          │   │
│              │  │  เมื่อจบ Q1 เราภูมิใจที่จะแบ่งปัน          │   │
│              │  │  ความสำเร็จที่น่าตื่นเต้น...                │   │
│              │  │                                          │   │
│              │  └──────────────────────────────────────────┘   │
│              │                                                  │
├──────────────┴──────────────────────────────────────────────────┤
└─────────────────────────────────────────────────────────────────┘
```

---

### 16. Team Management

- **Purpose**: Let the company admin invite and manage recruiters.
- **Layout Structure**: Dashboard shell → main content: invite form + team member list.
- **Key Components**:
  - Invite form: email input + role selector (Recruiter) + "Send Invite" button
  - Team member table/list: name, email, role badge (Admin / Recruiter), status (Active / Pending Invite), joined date, actions (Remove, Change Role — admin only)
  - Pending invites section: email, sent date, status, "Resend" and "Revoke" actions
- **Interactive Elements**:
  - Enter email → "Send Invite" → invitation email sent
  - Remove team member → confirmation modal
  - Resend invite → re-sends email
  - Revoke invite → removes pending invitation
  - Change role (if supporting role changes)
- **Navigation**:
  - From: Sidebar "Team" link (visible to admins only)
  - To: Other dashboard pages via sidebar
- **Content**:
  - Section heading: "Team Management"
  - Invite section: "Invite a Recruiter"
  - Table headers: Name, Email, Role, Status, Joined, Actions
  - Confirmation: "Remove [name] from the team? They will lose access to all company resources."
- **States**:
  - **Loading**: Skeleton table
  - **Empty**: "You're the only team member. Invite recruiters to start collaborating."
  - **Invite Sent**: Success toast "Invitation sent to [email]"
  - **Invite Error**: "Failed to send invitation. Check the email address and try again."
  - **Already Invited**: "This email has already been invited."
  - **Removing**: Confirmation modal → spinner → success toast

- **Wireframe**:
```
┌─────────────────────────────────────────────────────────────────┐
│  ┌──────┐   FutureCareer        TechCorp [แอดมิน] 🔔 ┌──┐ ▾   │
│  │ LOGO │                                             │👤│     │
│  └──────┘                                             └──┘     │
├──────────────┬──────────────────────────────────────────────────┤
│              │                                                  │
│  บริษัท       │  จัดการทีมงาน                                     │
│              │                                                  │
│  ○ โปรไฟล์   │  ┌─ เชิญ Recruiter ──────────────────────────┐  │
│  ○ ฟีด       │  │                                           │  │
│  ● ทีมงาน    │  │  อีเมล                                    │  │
│  ○ ประกาศงาน │  │  ┌──────────────────────┐                │  │
│  ○ ผู้สมัคร   │  │  │ recruiter@company.com│ [ ส่งคำเชิญ ]  │  │
│              │  │  └──────────────────────┘                │  │
│              │  │                                           │  │
│              │  └───────────────────────────────────────────┘  │
│              │                                                  │
│              │  สมาชิกทีม (3)                                   │
│              │  ┌──────────────────────────────────────────┐   │
│              │  │ ชื่อ        อีเมล          ตำแหน่ง  สถานะ │   │
│              │  ├──────────────────────────────────────────┤   │
│              │  │ สมชาย     somchai@t.co  แอดมิน  ใช้งาน   │   │
│              │  │                                     ──── │   │
│              │  │ Jane S.  jane@tech.co  Recruiter ใช้งาน  │   │
│              │  │                             [ลบออก]      │   │
│              │  │ Mike R.  mike@tech.co  Recruiter ใช้งาน  │   │
│              │  │                             [ลบออก]      │   │
│              │  └──────────────────────────────────────────┘   │
│              │                                                  │
│              │  คำเชิญที่รอดำเนินการ (1)                         │
│              │  ┌──────────────────────────────────────────┐   │
│              │  │ อีเมล             ส่งเมื่อ      จัดการ    │   │
│              │  ├──────────────────────────────────────────┤   │
│              │  │ new@tech.co      22 มี.ค.  [ส่งอีกครั้ง] │   │
│              │  │                             [ยกเลิก]     │   │
│              │  └──────────────────────────────────────────┘   │
│              │                                                  │
├──────────────┴──────────────────────────────────────────────────┤
└─────────────────────────────────────────────────────────────────┘
```

- **Wireframe (Modal ยืนยันการลบสมาชิก)**:
```
┌──────────────────────────────────────┐
│  ลบสมาชิกทีม?                         │
│                                      │
│  ลบ Jane Smith ออกจากทีม?            │
│  สมาชิกจะไม่สามารถเข้าถึง             │
│  ทรัพยากรของบริษัทได้อีก               │
│                                      │
│        [ยกเลิก]  [ ลบออก ]            │
└──────────────────────────────────────┘
```

---

### 17. Job Postings List

- **Purpose**: View and manage all job positions created by the company, with status indicators.
- **Layout Structure**: Dashboard shell → main content: action bar + job postings table/card list.
- **Key Components**:
  - Action bar: "Create New Job" button, search input, status filter (All, Draft, Active, Paused, Closed), sort dropdown
  - Job postings table/cards: job title, status badge (color-coded), number of applicants, created date, last updated, actions (Edit, View, Pause/Activate, Close, Delete)
  - Bulk actions (optional): select multiple → change status
- **Interactive Elements**:
  - "Create New Job" → navigate to Job Posting Editor (blank)
  - Search by job title
  - Filter by status
  - Click job title → navigate to Job Posting Editor (edit mode)
  - "View" → opens Job Detail (public view) in new tab
  - Status toggle (Pause/Activate)
  - "Close" → confirmation: "Close this position? It will no longer accept applications."
  - Delete → confirmation modal
  - Click applicant count → navigate to Candidate Management for that job
- **Navigation**:
  - From: Sidebar "Job Postings" link
  - To: Job Posting Editor (create/edit), Candidate Management (via applicant count), Job Detail (via view)
- **Content**:
  - Section heading: "Job Postings"
  - Table headers: Title, Status, Applicants, Created, Updated, Actions
  - Status badges: Draft (gray), Active (green), Paused (yellow), Closed (red)
  - Delete confirmation: "This will permanently delete the job posting and all associated data."
- **States**:
  - **Loading**: Skeleton table rows
  - **Empty**: Illustration + "No job postings yet. Create your first job posting!" + CTA button
  - **Filtered Empty**: "No postings match your filters."
  - **Error**: "Failed to load job postings. Please try again."

- **Wireframe**:
```
┌─────────────────────────────────────────────────────────────────┐
│  ┌──────┐   FutureCareer        TechCorp [แอดมิน] 🔔 ┌──┐ ▾   │
│  │ LOGO │                                             │👤│     │
│  └──────┘                                             └──┘     │
├──────────────┬──────────────────────────────────────────────────┤
│              │                                                  │
│  บริษัท       │  ประกาศรับสมัครงาน          [ + สร้างประกาศใหม่ ] │
│              │                                                  │
│  ○ โปรไฟล์   │  🔍 ค้นหาตำแหน่ง... [สถานะ: ทั้งหมด ▾] [เรียง ▾]│
│  ○ ฟีด       │                                                  │
│  ○ ทีมงาน    │  ┌──────────────────────────────────────────┐   │
│  ● ประกาศงาน │  │ ตำแหน่ง       สถานะ  ผู้สมัคร วันที่   ⋮  │   │
│  ○ ผู้สมัคร   │  ├──────────────────────────────────────────┤   │
│              │  │ Senior         เปิดรับ   12  15 มี.ค. ⋮  │   │
│              │  │ Frontend Dev   ●                      ──── │   │
│              │  │                              แก้ไข        │   │
│              │  │                              ดู           │   │
│              │  │                              หยุดชั่วคราว  │   │
│              │  │                              ปิดรับ        │   │
│              │  │                              ลบ           │   │
│              │  ├──────────────────────────────────────────┤   │
│              │  │ Full Stack     เปิดรับ    8  12 มี.ค. ⋮  │   │
│              │  │ Developer      ●                          │   │
│              │  ├──────────────────────────────────────────┤   │
│              │  │ Backend        หยุดชั่ว   3  10 มี.ค. ⋮  │   │
│              │  │ Engineer       คราว ●                     │   │
│              │  ├──────────────────────────────────────────┤   │
│              │  │ UI/UX          แบบร่าง   0  22 มี.ค. ⋮  │   │
│              │  │ Designer       ●                          │   │
│              │  ├──────────────────────────────────────────┤   │
│              │  │ DevOps Lead    ปิดแล้ว  15  28 ก.พ.  ⋮  │   │
│              │  │                ●                          │   │
│              │  └──────────────────────────────────────────┘   │
│              │                                                  │
│              │              [ ← 1  2 → ]                       │
│              │                                                  │
├──────────────┴──────────────────────────────────────────────────┤
└─────────────────────────────────────────────────────────────────┘
```

---

### 18. Job Posting Editor

- **Purpose**: Create or edit a job posting with full details, tags, and custom pre-screen questions.
- **Layout Structure**: Dashboard shell → main content: multi-section form with sticky save bar at bottom.
- **Key Components**:
  - Form section 1 — Basic Info: job title, job description (rich text editor), specifications, qualifications
  - Form section 2 — Tags: autocomplete multi-select inputs for industry, level, skill, position, location, type (fulltime/contract/freelance)
  - Form section 3 — Pre-Screen Questions: dynamic question builder
    - "Add Question" button
    - Each question: question text input, type toggle (Multiple Choice / Open-Ended)
    - Multiple choice: option inputs with add/remove, "required" toggle
    - Open-ended: character limit setting, "required" toggle
    - Drag-and-drop reordering of questions
  - Form section 4 — Status: dropdown (Draft, Active)
  - Sticky bottom bar: "Save as Draft" and "Publish" buttons (for new), or "Save Changes" (for edit)
- **Interactive Elements**:
  - Rich text editor for job description (bold, italic, lists, headings, links)
  - Autocomplete tag inputs with chip display
  - Add/remove/reorder pre-screen questions via drag handles
  - Add/remove multiple choice options within a question
  - Toggle question as required/optional
  - "Save as Draft" → saves without publishing
  - "Publish" → validates all required fields → publishes and redirects to Job Postings List
  - "Preview" button → opens Job Detail view in modal or new tab
- **Navigation**:
  - From: Job Postings List ("Create New Job" or edit action)
  - To: Job Postings List (after save/publish), Job Detail (via preview)
- **Content**:
  - Heading: "Create Job Posting" or "Edit: [Job Title]"
  - Section labels: "Job Details", "Tags & Categories", "Screening Questions", "Status"
  - Rich text placeholder: "Describe the role, responsibilities, and what you're looking for..."
  - Tag helper text: "Add tags to help candidates find this position"
  - Question builder: "Add questions that candidates must answer when applying"
- **States**:
  - **Loading** (edit mode): Skeleton form while existing data loads
  - **New** (create mode): Empty form with defaults
  - **Validation Errors**: Inline errors on required fields (title, description, at least one tag)
  - **Saving**: Button spinner, fields disabled
  - **Saved**: Success toast "Job posting saved" + redirect
  - **Unsaved Changes**: Warning on navigation away
  - **Error**: "Failed to save. Please try again."

- **Wireframe**:
```
┌─────────────────────────────────────────────────────────────────┐
│  ┌──────┐   FutureCareer        TechCorp [แอดมิน] 🔔 ┌──┐ ▾   │
│  │ LOGO │                                             │👤│     │
│  └──────┘                                             └──┘     │
├──────────────┬──────────────────────────────────────────────────┤
│              │                                                  │
│  บริษัท       │  สร้างประกาศรับสมัครงาน          [ดูตัวอย่าง]     │
│              │                                                  │
│  ○ โปรไฟล์   │  ┌─ 1. รายละเอียดงาน ───────────────────────┐  │
│  ○ ฟีด       │  │                                           │  │
│  ○ ทีมงาน    │  │  ชื่อตำแหน่ง *                              │  │
│  ● ประกาศงาน │  │  ┌──────────────────────────────────┐    │  │
│  ○ ผู้สมัคร   │  │  │ Senior Frontend Developer        │    │  │
│              │  │  └──────────────────────────────────┘    │  │
│              │  │                                           │  │
│              │  │  รายละเอียดงาน *                           │  │
│              │  │  ┌──────────────────────────────────┐    │  │
│              │  │  │ [B] [I] [H1] [• ] [1.] [🔗]     │    │  │
│              │  │  ├──────────────────────────────────┤    │  │
│              │  │  │ อธิบายตำแหน่งงาน หน้าที่           │    │  │
│              │  │  │ รับผิดชอบ และคุณสมบัติที่           │    │  │
│              │  │  │ ต้องการ...                        │    │  │
│              │  │  │                                  │    │  │
│              │  │  └──────────────────────────────────┘    │  │
│              │  │                                           │  │
│              │  └───────────────────────────────────────────┘  │
│              │                                                  │
│              │  ┌─ 2. Tags & หมวดหมู่ ──────────────────────┐  │
│              │  │  เพิ่ม Tag เพื่อให้ผู้สมัครค้นหาตำแหน่งนี้ได้  │  │
│              │  │                                            │  │
│              │  │  ทักษะ *                                   │  │
│              │  │  ┌────────────────────────────────────┐    │  │
│              │  │  │ [React ✕] [TypeScript ✕]         + │    │  │
│              │  │  └────────────────────────────────────┘    │  │
│              │  │                                            │  │
│              │  │  อุตสาหกรรม       ตำแหน่ง                   │  │
│              │  │  ┌─────────┐    ┌──────────────────┐      │  │
│              │  │  │ Tech  ▾ │    │ Frontend Dev   ▾ │      │  │
│              │  │  └─────────┘    └──────────────────┘      │  │
│              │  │                                            │  │
│              │  │  ระดับ          สถานที่        ประเภทงาน    │  │
│              │  │  [Senior ▾]   [กรุงเทพฯ ▾]  [Fulltime▾]  │  │
│              │  │                                            │  │
│              │  └────────────────────────────────────────────┘  │
│              │                                                  │
│              │  ┌─ 3. คำถามคัดกรอง ─────────────────────────┐  │
│              │  │  เพิ่มคำถามที่ผู้สมัครต้องตอบ                 │  │
│              │  │                                            │  │
│              │  │  ┌────────────────────────────────────┐    │  │
│              │  │  │ ≡ ข้อ 1: ทำไมถึงสนใจตำแหน่งนี้?     │    │  │
│              │  │  │   ประเภท: [คำตอบอิสระ] จำเป็น: ☑    │    │  │
│              │  │  │                           [ลบ]      │    │  │
│              │  │  └────────────────────────────────────┘    │  │
│              │  │                                            │  │
│              │  │  ┌────────────────────────────────────┐    │  │
│              │  │  │ ≡ ข้อ 2: มีประสบการณ์ React กี่ปี?   │    │  │
│              │  │  │   ประเภท: [หลายตัวเลือก] จำเป็น: ☑  │    │  │
│              │  │  │   ○ 1-2 ปี                          │    │  │
│              │  │  │   ○ 3-5 ปี                          │    │  │
│              │  │  │   ○ 5+ ปี                           │    │  │
│              │  │  │   [+ เพิ่มตัวเลือก]           [ลบ]   │    │  │
│              │  │  └────────────────────────────────────┘    │  │
│              │  │                                            │  │
│              │  │  [ + เพิ่มคำถาม ]                          │  │
│              │  │                                            │  │
│              │  └────────────────────────────────────────────┘  │
│              │                                                  │
│              │  ┌─ 4. สถานะ ────────────────────────────────┐  │
│              │  │  สถานะ: [แบบร่าง ▾]                        │  │
│              │  └────────────────────────────────────────────┘  │
│              │                                                  │
├──────────────┼──────────────────────────────────────────────────┤
│              │     [ บันทึกเป็นแบบร่าง ]    [ เผยแพร่ ]         │
├──────────────┴──────────────────────────────────────────────────┤
└─────────────────────────────────────────────────────────────────┘
```

---

### 19. Candidate Management (ATS)

- **Purpose**: Review and manage applicants for a specific job position through a hiring pipeline.
- **Layout Structure**: Dashboard shell → main content: job selector/header → view toggle → kanban board or list view.
- **Key Components**:
  - Job position selector: dropdown to switch between job postings (or breadcrumb from job postings list)
  - View toggle: Kanban Board | List View
  - **Kanban Board**:
    - Columns: New, Reviewing, Interview, Offered, Hired, Rejected
    - Candidate cards in each column: name, photo, applied date, match tags, quick-action menu
    - Drag-and-drop cards between columns to update status
  - **List View**:
    - Search bar + filters (status, applied date range, skill tags)
    - Table: candidate name, email, applied date, status badge, resume link, actions
    - Sortable columns
  - Quick actions per candidate: View Details, Move to Stage, Reject, View Contact
- **Interactive Elements**:
  - Switch between kanban and list views
  - Kanban: drag-and-drop cards between columns to change pipeline stage
  - List: click column headers to sort, use filters, search by name
  - Click candidate card/row → navigate to Candidate Detail
  - Quick action "View Contact" → popover showing email and phone
  - Quick action "Move to Stage" → dropdown with stage options
  - Quick action "Reject" → confirmation modal with optional rejection reason
- **Navigation**:
  - From: Job Postings List (click applicant count), sidebar "Candidates" link
  - To: Candidate Detail (click candidate), Job Postings List (via breadcrumb)
- **Content**:
  - Heading: "Candidates for [Job Title]"
  - Column headers (kanban): New, Reviewing, Interview, Offered, Hired, Rejected
  - Card info: candidate name, avatar, applied date, 2–3 top skill tags
  - Candidate count per column: "(X)"
  - Table headers (list): Name, Email, Applied, Status, Resume, Actions
- **States**:
  - **Loading**: Skeleton columns/rows
  - **Empty**: "No applications received yet for this position." with illustration
  - **Filtered Empty**: "No candidates match your search/filters."
  - **Drag Active**: Visual highlight on target column during drag
  - **Error**: "Failed to load candidates. Please try again."

- **Wireframe (Kanban View)**:
```
┌─────────────────────────────────────────────────────────────────┐
│  ┌──────┐   FutureCareer        TechCorp [แอดมิน] 🔔 ┌──┐ ▾   │
│  │ LOGO │                                             │👤│     │
│  └──────┘                                             └──┘     │
├──────────────┬──────────────────────────────────────────────────┤
│              │                                                  │
│  บริษัท       │  งาน > ผู้สมัคร Senior Frontend Developer        │
│              │  ตำแหน่ง: [Senior Frontend Developer ▾]           │
│  ○ โปรไฟล์   │                                                  │
│  ○ ฟีด       │  [■ Kanban]  [≡ รายการ]                          │
│  ○ ทีมงาน    │                                                  │
│  ○ ประกาศงาน │  ┌─ ใหม่ (4) ─┐ ┌─ พิจารณา(3)┐ ┌─ สัมภาษณ์ ─┐ │
│  ● ผู้สมัคร   │  │            │ │             │ │   (2)       │ │
│              │  │ ┌────────┐ │ │ ┌─────────┐ │ │ ┌─────────┐ │ │
│              │  │ │ ┌──┐   │ │ │ │ ┌──┐    │ │ │ │ ┌──┐    │ │ │
│              │  │ │ │👤│   │ │ │ │ │👤│    │ │ │ │ │👤│    │ │ │
│              │  │ │ └──┘   │ │ │ │ └──┘    │ │ │ │ └──┘    │ │ │
│              │  │ │ Alice  │ │ │ │ Dave    │ │ │ │ Grace   │ │ │
│              │  │ │ 20มี.ค.│ │ │ │ 18มี.ค. │ │ │ │ 15มี.ค. │ │ │
│              │  │ │[React] │ │ │ │[React]  │ │ │ │[React]  │ │ │
│              │  │ │[TS]    │ │ │ │[Vue]    │ │ │ │[TS]     │ │ │
│              │  │ │   ⋮    │ │ │ │   ⋮     │ │ │ │   ⋮     │ │ │
│              │  │ └────────┘ │ │ └─────────┘ │ │ └─────────┘ │ │
│              │  │            │ │             │ │             │ │
│              │  │ ┌────────┐ │ │ ┌─────────┐ │ │ ┌─────────┐ │ │
│              │  │ │ Bob    │ │ │ │ Eve     │ │ │ │ Hank    │ │ │
│              │  │ │ 19มี.ค.│ │ │ │ 17มี.ค. │ │ │ │ 12มี.ค. │ │ │
│              │  │ │   ⋮    │ │ │ │   ⋮     │ │ │ │   ⋮     │ │ │
│              │  │ └────────┘ │ │ └─────────┘ │ │ └─────────┘ │ │
│              │  │            │ │             │ │             │ │
│              │  │ ┌────────┐ │ │ ┌─────────┐ │ └─────────────┘ │
│              │  │ │ Carol  │ │ │ │ Frank   │ │                  │
│              │  │ │ 18มี.ค.│ │ │ │ 16มี.ค. │ │ ┌─ เสนอ ───────┐│
│              │  │ │   ⋮    │ │ │ │   ⋮     │ │ │   (1)        ││
│              │  │ └────────┘ │ │ └─────────┘ │ │ ┌─────────┐  ││
│              │  │            │ │             │ │ │ Ivy      │  ││
│              │  │ ┌────────┐ │ └─────────────┘ │ │ 10มี.ค.  │  ││
│              │  │ │ Dan    │ │                  │ │   ⋮      │  ││
│              │  │ │ 17มี.ค.│ │                  │ └─────────┘  ││
│              │  │ │   ⋮    │ │                  │              ││
│              │  │ └────────┘ │                  └──────────────┘│
│              │  │            │                                  │
│              │  └────────────┘                                  │
│              │                                                  │
├──────────────┴──────────────────────────────────────────────────┤
└─────────────────────────────────────────────────────────────────┘
```

- **Wireframe (List View)**:
```
┌─────────────────────────────────────────────────────────────────┐
│  ┌──────┐   FutureCareer        TechCorp [แอดมิน] 🔔 ┌──┐ ▾   │
│  │ LOGO │                                             │👤│     │
│  └──────┘                                             └──┘     │
├──────────────┬──────────────────────────────────────────────────┤
│              │                                                  │
│  บริษัท       │  งาน > ผู้สมัคร Senior Frontend Developer        │
│              │  ตำแหน่ง: [Senior Frontend Developer ▾]           │
│  ○ โปรไฟล์   │                                                  │
│  ○ ฟีด       │  [■ Kanban]  [≡ รายการ]                          │
│  ○ ทีมงาน    │                                                  │
│  ○ ประกาศงาน │  🔍 ค้นหาผู้สมัคร...  [สถานะ ▾] [วันที่ ▾]       │
│  ● ผู้สมัคร   │                                                  │
│              │  ┌──────────────────────────────────────────┐   │
│              │  │ ชื่อ     อีเมล         สมัครเมื่อ  สถานะ ⋮ │   │
│              │  ├──────────────────────────────────────────┤   │
│              │  │ Alice   alice@m.co   20มี.ค.  ใหม่    ⋮ │   │
│              │  │ Bob     bob@m.co     19มี.ค.  ใหม่    ⋮ │   │
│              │  │ Dave    dave@m.co    18มี.ค.  พิจารณา ⋮ │   │
│              │  │ Grace   grace@m.co   15มี.ค.  สัมภาษณ์⋮ │   │
│              │  │ Ivy     ivy@m.co     10มี.ค.  เสนอ    ⋮ │   │
│              │  └──────────────────────────────────────────┘   │
│              │                                                  │
├──────────────┴──────────────────────────────────────────────────┤
└─────────────────────────────────────────────────────────────────┘
```

---

### 20. Candidate Detail

- **Purpose**: View a candidate's full profile, submitted application, resume, and contact information.
- **Layout Structure**: Dashboard shell → main content: two-column layout (candidate info left, application details right) or tabbed view.
- **Key Components**:
  - Candidate header: name, photo, current pipeline stage badge, applied date
  - Stage action bar: buttons/dropdown to move candidate to different pipeline stages
  - Left column / Tab 1 — Profile & Contact:
    - Profile photo, name, bio
    - Contact info: email, phone (revealed on click/permission)
    - Resume viewer: embedded PDF viewer or download link
  - Right column / Tab 2 — Application:
    - Introductory message (full text)
    - Pre-screen question responses: question text + candidate's answer (listed as Q&A pairs)
  - Tab 3 — Activity / Notes (optional):
    - Internal notes textarea for recruiter to add comments
    - Status change history timeline
  - Action buttons: "Move to [Next Stage]", "Reject", "Download Resume"
- **Interactive Elements**:
  - Click stage buttons to move candidate through pipeline → status updates in real-time
  - "View Contact" → reveals email and phone
  - Resume: view inline or download PDF
  - Add/edit internal notes
  - "Reject" → confirmation modal with optional message
  - Navigate back to Candidate Management
- **Navigation**:
  - From: Candidate Management (click candidate card/row)
  - To: Candidate Management (back button/breadcrumb)
- **Content**:
  - Heading: "[Candidate Name]" with stage badge
  - Subtext: "Applied to [Job Title] on [Date]"
  - Profile section: name, bio, contact details
  - Application section: intro message, Q&A pairs
  - Notes section: internal recruiter notes with timestamps
  - Stage history: timeline of status changes with dates
- **States**:
  - **Loading**: Skeleton layout
  - **Contact Hidden**: "Click to reveal contact info" (privacy measure until recruiter explicitly requests)
  - **No Notes**: "No internal notes yet. Add a note..." placeholder
  - **Stage Updated**: Success toast "Candidate moved to [Stage]"
  - **Error**: "Failed to load candidate details. Please try again."

- **Wireframe**:
```
┌─────────────────────────────────────────────────────────────────┐
│  ┌──────┐   FutureCareer        TechCorp [แอดมิน] 🔔 ┌──┐ ▾   │
│  │ LOGO │                                             │👤│     │
│  └──────┘                                             └──┘     │
├──────────────┬──────────────────────────────────────────────────┤
│              │                                                  │
│  บริษัท       │  ← กลับไปหน้าผู้สมัคร                             │
│              │                                                  │
│  ○ โปรไฟล์   │  ┌──┐ Alice Johnson          [กำลังพิจารณา] ●   │
│  ○ ฟีด       │  │👤│ สมัครตำแหน่ง Senior Frontend Dev            │
│  ○ ทีมงาน    │  └──┘ เมื่อ 20 มี.ค. 2026                       │
│  ○ ประกาศงาน │                                                  │
│  ● ผู้สมัคร   │  [ย้ายไปสัมภาษณ์] [ปฏิเสธ]  [ดาวน์โหลดเรซูเม่]  │
│              │                                                  │
│              │  ┌─ โปรไฟล์ & ติดต่อ ───┐ ┌─ ใบสมัคร ──────────┐│
│              │  │                       │ │                    ││
│              │  │  Alice Johnson        │ │ ข้อความแนะนำตัว      ││
│              │  │  "Frontend developer  │ │                    ││
│              │  │  มีความหลงใหล..."     │ │ "ดิฉันตื่นเต้นกับ    ││
│              │  │                       │ │ โอกาสนี้เพราะได้     ││
│              │  │  ┌─ ข้อมูลติดต่อ ───┐ │ │ ติดตาม TechCorp    ││
│              │  │  │ 👁 คลิกเพื่อ     │ │ │ มานาน..."          ││
│              │  │  │ ดูข้อมูลติดต่อ    │ │ │                    ││
│              │  │  │                  │ │ ├────────────────────┤│
│              │  │  │ หลังจากคลิก:     │ │ │                    ││
│              │  │  │ ✉ alice@mail.co  │ │ │ คำตอบคัดกรอง       ││
│              │  │  │ 📞 +66 8123456  │ │ │                    ││
│              │  │  └─────────────────┘ │ │ ถ: ทำไมถึงสนใจ?     ││
│              │  │                       │ │ ต: "ดิฉันชื่นชม..."  ││
│              │  │  ┌─ เรซูเม่ ────────┐ │ │                    ││
│              │  │  │                 │ │ │ ถ: ประสบการณ์ React? ││
│              │  │  │ ┌─────────────┐ │ │ │ ต: 5+ ปี            ││
│              │  │  │ │             │ │ │ │                    ││
│              │  │  │ │   PDF       │ │ │ │ ถ: สะดวก Remote?   ││
│              │  │  │ │  PREVIEW    │ │ │ │ ต: Hybrid          ││
│              │  │  │ │             │ │ │ │                    ││
│              │  │  │ └─────────────┘ │ │ └────────────────────┘│
│              │  │  │ [ดาวน์โหลด PDF] │ │                       │
│              │  │  └─────────────────┘ │ ┌─ บันทึก ──────────┐│
│              │  │                       │ │                    ││
│              │  └───────────────────────┘ │ บันทึกภายใน:       ││
│              │                            │ ┌────────────────┐││
│              │  ┌─ ประวัติสถานะ ────────┐ │ │ React แข็งแกร่ง │││
│              │  │ ● พิจารณา  22 มี.ค.   │ │ │ นัดสัมภาษณ์      │││
│              │  │ │                     │ │ └────────────────┘││
│              │  │ ● ส่งใบสมัคร 20 มี.ค. │ │ [บันทึก]          ││
│              │  └───────────────────────┘ │                    ││
│              │                            └────────────────────┘│
│              │                                                  │
├──────────────┴──────────────────────────────────────────────────┤
└─────────────────────────────────────────────────────────────────┘
```

- **Wireframe (Modal ยืนยันการปฏิเสธ)**:
```
┌──────────────────────────────────────┐
│  ปฏิเสธผู้สมัคร?                       │
│                                      │
│  ปฏิเสธ Alice Johnson สำหรับ         │
│  ตำแหน่ง Senior Frontend Developer?   │
│                                      │
│  เหตุผล (ไม่จำเป็น):                   │
│  ┌──────────────────────────────┐   │
│  │                              │   │
│  └──────────────────────────────┘   │
│                                      │
│        [ยกเลิก]  [ ปฏิเสธ ]          │
└──────────────────────────────────────┘
```

---

## Shared Components Reference

These components appear across multiple pages:

| Component | Used On | Description |
|-----------|---------|-------------|
| **Top Navbar** | All pages | Logo, navigation links, auth buttons (public) or user menu (dashboard) |
| **Sidebar** | All dashboard pages | Role-appropriate navigation links with active state indicators |
| **Tag Autocomplete** | Job Search, Profile Settings, Job Posting Editor | Multi-select input with autocomplete from tag database |
| **Job Card** | Job Search, Company Profile, Job Postings List | Reusable card showing job summary with company, tags, and status |
| **Candidate Card** | ATS Kanban, Candidate List | Reusable card showing candidate name, photo, date, tags |
| **PDF Viewer** | Resume Management, Candidate Detail | Inline PDF preview component |
| **Rich Text Editor** | Job Posting Editor, Company Profile, Feed | Formatted text input with toolbar |
| **Confirmation Modal** | Delete/submit actions across all pages | Reusable modal with title, message, confirm/cancel buttons |
| **Toast Notifications** | All pages | Success/error/warning transient notifications |
| **File Uploader** | Profile photo, company logo, resume upload | Drag-and-drop zone with file type/size validation |
| **Status Badge** | Job cards, application list, ATS | Color-coded badge component for various statuses |
