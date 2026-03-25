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