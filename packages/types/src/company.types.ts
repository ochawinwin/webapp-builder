export type MemberRole = "admin" | "recruiter";

export interface Company {
  id: string;
  name: string;
  logo_url: string | null;
  short_bio: string | null;
  full_bio: string | null;
  industry: string | null;
  size: string | null;
  website: string | null;
  contact_email: string | null;
  contact_phone: string | null;
  location: string | null;
  created_at: string;
}

export interface CompanyMember {
  id: string;
  company_id: string;
  user_id: string;
  role: MemberRole;
  invited_by: string | null;
  created_at: string;
}

export interface CompanyPost {
  id: string;
  company_id: string;
  title: string;
  content: string;
  image_url: string | null;
  created_by: string;
  created_at: string;
}

export interface CompanyWithMembers extends Company {
  company_members: CompanyMember[];
}
