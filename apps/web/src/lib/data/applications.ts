import { createServerClient } from "@/lib/supabase/server";
import type { Application, ApplicationWithDetails } from "@futurecareer/types";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapApplication(row: any): Application {
  return {
    id: row.id,
    jobId: row.job_id,
    applicantId: row.applicant_id,
    resumeId: row.resume_id,
    coverMessage: row.cover_message,
    contactEmail: row.contact_email,
    contactPhone: row.contact_phone,
    status: row.status,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function getApplicationsByJob(jobId: string): Promise<ApplicationWithDetails[]> {
  const supabase = await createServerClient();
  const { data, error } = await supabase
    .from("applications")
    .select(
      `
      *,
      job:jobs(*),
      applicant:profiles(*),
      resume:resumes(*),
      answers:application_answers(*)
    `
    )
    .eq("job_id", jobId)
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (data ?? []).map((row: any): ApplicationWithDetails => ({
    ...mapApplication(row),
    job: {
      id: row.job.id,
      companyId: row.job.company_id,
      createdBy: row.job.created_by,
      title: row.job.title,
      description: row.job.description,
      qualifications: row.job.qualifications,
      benefits: row.job.benefits,
      status: row.job.status,
      location: row.job.location,
      jobType: row.job.job_type,
      level: row.job.level,
      createdAt: row.job.created_at,
      updatedAt: row.job.updated_at,
    },
    applicant: {
      id: row.applicant.id,
      userType: row.applicant.user_type,
      fullName: row.applicant.full_name,
      bio: row.applicant.bio,
      avatarUrl: row.applicant.avatar_url,
      phone: row.applicant.phone,
      email: row.applicant.email,
      createdAt: row.applicant.created_at,
      updatedAt: row.applicant.updated_at,
    },
    resume: row.resume
      ? {
          id: row.resume.id,
          userId: row.resume.user_id,
          fileUrl: row.resume.file_url,
          fileName: row.resume.file_name,
          fileSize: row.resume.file_size,
          isPrimary: row.resume.is_primary,
          createdAt: row.resume.created_at,
        }
      : null,
    answers: (row.answers ?? []).map((a: { id: string; application_id: string; question_id: string; answer_text: string }) => ({
      id: a.id,
      applicationId: a.application_id,
      questionId: a.question_id,
      answerText: a.answer_text,
    })),
  }));
}

export async function getApplicationsByUser(userId: string): Promise<ApplicationWithDetails[]> {
  const supabase = await createServerClient();
  const { data, error } = await supabase
    .from("applications")
    .select(
      `
      *,
      job:jobs(*, company:companies(*)),
      applicant:profiles(*),
      resume:resumes(*),
      answers:application_answers(*)
    `
    )
    .eq("applicant_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (data ?? []).map((row: any): ApplicationWithDetails => ({
    ...mapApplication(row),
    job: {
      id: row.job.id,
      companyId: row.job.company_id,
      createdBy: row.job.created_by,
      title: row.job.title,
      description: row.job.description,
      qualifications: row.job.qualifications,
      benefits: row.job.benefits,
      status: row.job.status,
      location: row.job.location,
      jobType: row.job.job_type,
      level: row.job.level,
      createdAt: row.job.created_at,
      updatedAt: row.job.updated_at,
    },
    applicant: {
      id: row.applicant.id,
      userType: row.applicant.user_type,
      fullName: row.applicant.full_name,
      bio: row.applicant.bio,
      avatarUrl: row.applicant.avatar_url,
      phone: row.applicant.phone,
      email: row.applicant.email,
      createdAt: row.applicant.created_at,
      updatedAt: row.applicant.updated_at,
    },
    resume: row.resume
      ? {
          id: row.resume.id,
          userId: row.resume.user_id,
          fileUrl: row.resume.file_url,
          fileName: row.resume.file_name,
          fileSize: row.resume.file_size,
          isPrimary: row.resume.is_primary,
          createdAt: row.resume.created_at,
        }
      : null,
    answers: (row.answers ?? []).map((a: { id: string; application_id: string; question_id: string; answer_text: string }) => ({
      id: a.id,
      applicationId: a.application_id,
      questionId: a.question_id,
      answerText: a.answer_text,
    })),
  }));
}

export async function getApplicationById(id: string): Promise<ApplicationWithDetails | null> {
  const supabase = await createServerClient();
  const { data, error } = await supabase
    .from("applications")
    .select(
      `
      *,
      job:jobs(*),
      applicant:profiles(*),
      resume:resumes(*),
      answers:application_answers(*)
    `
    )
    .eq("id", id)
    .single();

  if (error) return null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const row: any = data;

  return {
    ...mapApplication(row),
    job: {
      id: row.job.id,
      companyId: row.job.company_id,
      createdBy: row.job.created_by,
      title: row.job.title,
      description: row.job.description,
      qualifications: row.job.qualifications,
      benefits: row.job.benefits,
      status: row.job.status,
      location: row.job.location,
      jobType: row.job.job_type,
      level: row.job.level,
      createdAt: row.job.created_at,
      updatedAt: row.job.updated_at,
    },
    applicant: {
      id: row.applicant.id,
      userType: row.applicant.user_type,
      fullName: row.applicant.full_name,
      bio: row.applicant.bio,
      avatarUrl: row.applicant.avatar_url,
      phone: row.applicant.phone,
      email: row.applicant.email,
      createdAt: row.applicant.created_at,
      updatedAt: row.applicant.updated_at,
    },
    resume: row.resume
      ? {
          id: row.resume.id,
          userId: row.resume.user_id,
          fileUrl: row.resume.file_url,
          fileName: row.resume.file_name,
          fileSize: row.resume.file_size,
          isPrimary: row.resume.is_primary,
          createdAt: row.resume.created_at,
        }
      : null,
    answers: (row.answers ?? []).map((a: { id: string; application_id: string; question_id: string; answer_text: string }) => ({
      id: a.id,
      applicationId: a.application_id,
      questionId: a.question_id,
      answerText: a.answer_text,
    })),
  };
}
