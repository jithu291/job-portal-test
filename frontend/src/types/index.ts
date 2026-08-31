export type Role = 'ADMIN' | 'USER';

export type JobCategory =
  | 'ENGINEERING'
  | 'DESIGN'
  | 'MARKETING'
  | 'SALES'
  | 'OPERATIONS'
  | 'HR'
  | 'OTHER';

export type ExperienceLevel = 'INTERN' | 'JUNIOR' | 'MID' | 'SENIOR' | 'LEAD';

export type JobStatus = 'DRAFT' | 'PUBLISHED' | 'CLOSED';

export interface User {
  id: string;
  email: string;
  role: Role;
}

export interface Job {
  id: string;
  title: string;
  description: string;
  category: JobCategory;
  experienceLevel: ExperienceLevel;
  location: string;
  companyName: string;
  status: JobStatus;
  createdById: string;
  createdAt: string;
  updatedAt: string;
  createdBy?: { id: string; email: string };
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface DashboardStats {
  totalJobs: number;
  publishedJobs: number;
  draftJobs: number;
  closedJobs: number;
  byCategory: { category: JobCategory; count: number }[];
  recentJobs: Pick<Job, 'id' | 'title' | 'companyName' | 'status' | 'category' | 'createdAt'>[];
}

export const JOB_CATEGORIES: { value: JobCategory; label: string }[] = [
  { value: 'ENGINEERING', label: 'Engineering' },
  { value: 'DESIGN', label: 'Design' },
  { value: 'MARKETING', label: 'Marketing' },
  { value: 'SALES', label: 'Sales' },
  { value: 'OPERATIONS', label: 'Operations' },
  { value: 'HR', label: 'HR' },
  { value: 'OTHER', label: 'Other' },
];

export const EXPERIENCE_LEVELS: { value: ExperienceLevel; label: string }[] = [
  { value: 'INTERN', label: 'Intern' },
  { value: 'JUNIOR', label: 'Junior' },
  { value: 'MID', label: 'Mid' },
  { value: 'SENIOR', label: 'Senior' },
  { value: 'LEAD', label: 'Lead' },
];

export const JOB_STATUSES: { value: JobStatus; label: string }[] = [
  { value: 'DRAFT', label: 'Draft' },
  { value: 'PUBLISHED', label: 'Published' },
  { value: 'CLOSED', label: 'Closed' },
];

export type ApplicationStatus = 'PENDING' | 'REVIEWED' | 'REJECTED' | 'ACCEPTED';

export interface PublicJob {
  id: string;
  title: string;
  description: string;
  category: JobCategory;
  experienceLevel: ExperienceLevel;
  location: string;
  companyName: string;
  status: JobStatus;
  createdAt: string;
  updatedAt: string;
}

export interface Application {
  id: string;
  userId: string;
  jobId: string;
  coverLetter: string;
  resumeUrl: string | null;
  status: ApplicationStatus;
  appliedAt: string;
  job?: Pick<Job, 'id' | 'title' | 'companyName' | 'location' | 'status'>;
  user?: { id: string; email: string };
}

export const APPLICATION_STATUSES: { value: ApplicationStatus; label: string }[] = [
  { value: 'PENDING', label: 'Pending' },
  { value: 'REVIEWED', label: 'Reviewed' },
  { value: 'REJECTED', label: 'Rejected' },
  { value: 'ACCEPTED', label: 'Accepted' },
];

export interface CategoryCount {
  category: JobCategory;
  count: number;
}
