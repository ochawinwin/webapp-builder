export type UserRole = 'candidate' | 'company' | null;

export interface User {
  id: string;
  email: string;
  role: UserRole;
  name?: string;
  avatar?: string;
  bio?: string;
  phone?: string;
  resumeUrl?: string;
}

export interface Company {
  id: string;
  name: string;
  logo: string;
  bio: string;
  industry: string;
  size: string;
  feed: CompanyPost[];
}

export interface CompanyPost {
  id: string;
  content: string;
  createdAt: string;
  image?: string;
}

export interface Job {
  id: string;
  companyId: string;
  companyName: string;
  companyLogo: string;
  title: string;
  description: string;
  spec: string;
  qualifications: string[];
  location: string;
  type: 'Full-time' | 'Part-time' | 'Contract' | 'Internship';
  level: 'Junior' | 'Mid' | 'Senior' | 'Lead';
  salary?: string;
  tags: string[];
  status: 'Open' | 'Closed';
  createdAt: string;
  prescreenQuestions?: PrescreenQuestion[];
}

export interface PrescreenQuestion {
  id: string;
  type: 'text' | 'choice';
  question: string;
  options?: string[];
}

export type ApplicationStatus = 'New' | 'Reviewing' | 'Interview' | 'Hired' | 'Rejected';

export interface Application {
  id: string;
  jobId: string;
  jobTitle: string;
  candidateId: string;
  candidateName: string;
  candidateAvatar?: string;
  candidateEmail: string;
  candidatePhone: string;
  resumeUrl: string;
  introMessage: string;
  prescreenAnswers: Record<string, string>;
  status: ApplicationStatus;
  appliedAt: string;
}
