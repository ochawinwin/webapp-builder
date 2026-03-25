import { Job, Company, Application } from './types';

export const mockCompanies: Company[] = [
  {
    id: 'c1',
    name: 'TechCorp Solutions',
    logo: 'https://images.unsplash.com/photo-1549923746-c502d488b3ea?q=80&w=200&h=200&auto=format&fit=crop',
    bio: 'Leading software development company focusing on innovation and scalable solutions.',
    industry: 'Technology',
    size: '101-500 employees',
    feed: [
      {
        id: 'p1',
        content: "Excited to announce our new office in Bangkok! We're growing and looking for talents.",
        createdAt: '2026-03-20',
        image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=800&auto=format&fit=crop'
      }
    ]
  },
  {
    id: 'c2',
    name: 'FutureSkill Academy',
    logo: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=200&h=200&auto=format&fit=crop',
    bio: 'Empowering the next generation of digital professionals through high-quality education.',
    industry: 'Education',
    size: '51-200 employees',
    feed: []
  }
];

export const mockJobs: Job[] = [
  {
    id: 'j1',
    companyId: 'c1',
    companyName: 'TechCorp Solutions',
    companyLogo: mockCompanies[0].logo,
    title: 'Senior Frontend Engineer (React)',
    description: 'We are looking for an experienced React developer to lead our frontend team.',
    spec: 'Build scalable web applications using React, TypeScript, and Tailwind CSS.',
    qualifications: ['5+ years of React experience', 'Proficiency in TypeScript', 'Strong architectural skills'],
    location: 'Bangkok (Remote Friendly)',
    type: 'Full-time',
    level: 'Senior',
    salary: '80,000 - 120,000 THB',
    tags: ['React', 'TypeScript', 'Tailwind', 'Senior'],
    status: 'Open',
    createdAt: '2026-03-15',
    prescreenQuestions: [
      { id: 'q1', type: 'choice', question: 'How many years of React experience do you have?', options: ['< 3 years', '3-5 years', '5+ years'] },
      { id: 'q2', type: 'text', question: 'What is your expected salary?' }
    ]
  },
  {
    id: 'j2',
    companyId: 'c1',
    companyName: 'TechCorp Solutions',
    companyLogo: mockCompanies[0].logo,
    title: 'Junior UI/UX Designer',
    description: 'Join our design team to create beautiful and intuitive user experiences.',
    spec: 'Collaborate with PMs and devs to design mobile-first web experiences.',
    qualifications: ['Proficiency in Figma', 'Portfolio of web/mobile designs', 'Understanding of accessibility'],
    location: 'Bangkok',
    type: 'Full-time',
    level: 'Junior',
    salary: '35,000 - 50,000 THB',
    tags: ['Figma', 'UI/UX', 'Junior', 'Design'],
    status: 'Open',
    createdAt: '2026-03-22',
    prescreenQuestions: [
      { id: 'q1', type: 'text', question: 'Link to your portfolio' }
    ]
  },
  {
    id: 'j3',
    companyId: 'c2',
    companyName: 'FutureSkill Academy',
    companyLogo: mockCompanies[1].logo,
    title: 'Customer Success Manager',
    description: 'Help our students achieve their career goals by providing exceptional support.',
    spec: 'Manage student inquiries, handle onboarding, and collect feedback.',
    qualifications: ['Strong communication skills', 'Experience in EdTech is a plus', 'Problem-solving mindset'],
    location: 'Phuket',
    type: 'Full-time',
    level: 'Mid',
    salary: '45,000 - 65,000 THB',
    tags: ['Customer Success', 'Education', 'Mid-level'],
    status: 'Open',
    createdAt: '2026-03-24',
    prescreenQuestions: []
  }
];

export const mockApplications: Application[] = [
  {
    id: 'a1',
    jobId: 'j1',
    jobTitle: 'Senior Frontend Engineer (React)',
    candidateId: 'u1',
    candidateName: 'Somchai Jaidee',
    candidateAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&h=200&auto=format&fit=crop',
    candidateEmail: 'somchai@email.com',
    candidatePhone: '081-234-5678',
    resumeUrl: '/mock-resume.pdf',
    introMessage: 'I am highly interested in this role and believe my 6 years of experience aligns perfectly.',
    prescreenAnswers: {
      'q1': '5+ years',
      'q2': '110,000 THB'
    },
    status: 'Reviewing',
    appliedAt: '2026-03-18'
  },
  {
    id: 'a2',
    jobId: 'j1',
    jobTitle: 'Senior Frontend Engineer (React)',
    candidateId: 'u2',
    candidateName: 'Jane Smith',
    candidateAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&h=200&auto=format&fit=crop',
    candidateEmail: 'jane@email.com',
    candidatePhone: '089-876-5432',
    resumeUrl: '/jane-resume.pdf',
    introMessage: 'Excited to apply for the Senior position. I have been using React since its early days.',
    prescreenAnswers: {
      'q1': '5+ years',
      'q2': '100,000 THB'
    },
    status: 'New',
    appliedAt: '2026-03-20'
  }
];
