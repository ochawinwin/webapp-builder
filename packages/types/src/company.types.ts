export type CompanyRole = "admin" | "recruiter";

export interface Company {
  id: string;
  name: string;
  logoUrl: string | null;
  coverUrl: string | null;
  shortBio: string | null;
  fullBio: string | null;
  industry: string | null;
  size: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CompanyMember {
  id: string;
  companyId: string;
  userId: string;
  role: CompanyRole;
  invitedBy: string | null;
  createdAt: string;
}

export interface CompanyWithMembers extends Company {
  members: CompanyMember[];
}
