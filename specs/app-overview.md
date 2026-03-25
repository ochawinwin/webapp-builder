# FutureCareer — App Overview

> **Domain**: futurecareer.co
> **Industry**: Job Matching Platform

---

## 1. App Type & Purpose

FutureCareer is a **job matching platform** that connects job seekers with companies hiring through recruiters. It solves two problems:

- **For job seekers**: Finding relevant positions quickly through personalized tag-based matching (skills, industry, level, location, job type) instead of endless manual searching.
- **For companies**: Streamlining recruitment with job posting management, custom pre-screening questions, and a built-in applicant tracking system (ATS) — reducing the need for separate tools.

The platform serves three user roles: **Job Seekers** (end users), **Recruiters**, and **Company Admins**.

---

## 2. Core Features

1. **Authentication & Role-Based Access** — Separate registration/sign-in flows for job seekers and company users (HR), with email verification.
2. **Smart Job Search & Personalized Matching** — Search by criteria with autocomplete tag selection (skill, industry, level, position, location, type). Personalized match scores based on the user's selected tags.
3. **Resume & Profile Management** — Job seekers manage their profile (name, photo, bio, contact info) and upload/manage resumes (PDF).
4. **Job Application System** — Members apply to jobs via a structured form: attach a resume from the system, write an introductory message, provide contact info, and answer custom pre-screen questions.
5. **Job Position Management** — Recruiters create and manage job postings with status, specs, qualifications, tagging, and custom pre-screen questions (multiple choice + open-ended).
6. **Applicant Tracking System (ATS)** — Kanban board and filterable/searchable list view for managing candidates through the hiring pipeline, with the ability to view candidate contact details.
7. **Company Profiles & Feed** — Company admins manage company branding (logo, bio, industry, size) and post stories/announcements via a company feed.

---

## 3. User Flow

### Job Seeker Journey

1. **Register** → Create account on the job seeker registration page → verify email.
2. **Set Up Profile** → Add name, photo, bio, contact info → upload resume (PDF).
3. **Browse & Search Jobs** → Use tag-based search/filter (skill, industry, level, position, location, type) → see personalized match results.
4. **View Job Details** → Read full job description, specs, qualifications, and company info.
5. **Apply** → Fill out application form: select resume, write intro message, provide contact info, answer pre-screen questions → submit.
6. **Track Applications** → Monitor application status from the member area.

### Company / Recruiter Journey

1. **Register Company** → Company admin registers the company → verify email.
2. **Set Up Company Profile** → Add logo, short bio, full bio, industry, company size.
3. **Invite Recruiters** → Admin invites recruiters to join the company.
4. **Create Job Postings** → Recruiter creates positions with specs, qualifications, tags, and custom pre-screen questions.
5. **Manage Candidates** → Review applications on the ATS kanban board or filtered list → view candidate profiles and contact info.
6. **Post Updates** → Admin publishes stories/announcements on the company feed.

---

## 4. Page Structure

### Public Pages

| Page | Description |
|------|-------------|
| **Landing Page** | Marketing page introducing FutureCareer with value propositions and CTAs for job seekers and companies. |
| **Job Search / Browse** | Main search page with tag-based filters, autocomplete, and personalized match results. |
| **Job Detail** | Full job posting view showing description, qualifications, tags, company info, and an "Apply" button. |
| **Company Profile (Public)** | Public-facing company page with logo, bio, industry, size, open positions, and company feed. |

### Auth Pages

| Page | Description |
|------|-------------|
| **Job Seeker Register** | Registration form for job seekers with email verification flow. |
| **Company Register** | Registration form for company admins to create a company account with email verification. |
| **Sign In (Job Seeker)** | Login page for job seekers. |
| **Sign In (Company/HR)** | Login page for recruiters and company admins. |
| **Email Verification** | Confirmation page after email verification link is clicked. |

### Job Seeker Dashboard (Member Area)

| Page | Description |
|------|-------------|
| **Profile Settings** | Edit name, photo, bio, and contact information (email, phone). |
| **Resume Management** | Upload, view, and manage PDF resumes. |
| **My Applications** | List of submitted applications with status tracking. |
| **Job Application Form** | Multi-step form to apply: select resume, intro message, contact info, and pre-screen question responses. |

### Company Dashboard

| Page | Description |
|------|-------------|
| **Company Profile Settings** | Edit company logo, short bio, full bio, industry, and company size. |
| **Company Feed Management** | Create and manage company stories and announcements. |
| **Team Management** | Invite and manage recruiters (admin only). |
| **Job Postings List** | View and manage all job positions with status indicators. |
| **Job Posting Editor** | Create/edit a job posting: description, specs, qualifications, tags, and pre-screen questions. |
| **Candidate Management (ATS)** | Kanban board and searchable/filterable list of applicants per position with pipeline stage tracking. |
| **Candidate Detail** | View a candidate's profile, resume, application answers, and contact information. |
