export interface Application {
  id: string;
  jobId: string;
  candidateId: string;
  status: 'new' | 'reviewing' | 'interview' | 'hired' | 'rejected';
  appliedAt: string;
  introMessage?: string;
  prescreenAnswers?: Record<string, string>;
  candidateName: string;
  candidateAvatar: string;
  jobTitle: string;
  companyName: string;
}

export const getApplications = (): Application[] => {
  const data = localStorage.getItem('futurecareer_applications');
  return data ? JSON.parse(data) : [];
};

export const saveApplication = (app: Application) => {
  const apps = getApplications();
  apps.push(app);
  localStorage.setItem('futurecareer_applications', JSON.stringify(apps));
};

export const updateApplicationStatus = (appId: string, status: Application['status']) => {
  const apps = getApplications();
  const updatedApps = apps.map(app => 
    app.id === appId ? { ...app, status } : app
  );
  localStorage.setItem('futurecareer_applications', JSON.stringify(updatedApps));
};

export const getCandidateApplications = (candidateId: string) => {
  return getApplications().filter(app => app.candidateId === candidateId);
};

export const getJobApplications = (jobId: string) => {
  return getApplications().filter(app => app.jobId === jobId);
};
